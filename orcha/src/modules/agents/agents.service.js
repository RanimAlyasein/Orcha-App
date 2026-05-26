const crypto = require('crypto');
const prisma = require('../../config/prisma');
const { parsePagination, buildMeta } = require('../../utils/paginate');
const { logAudit } = require('../../utils/audit');

const err = (msg, status) => Object.assign(new Error(msg), { status });

function generateApiKey() {
  return 'orcha_' + crypto.randomBytes(24).toString('hex');
}

function publicAgent(agent) {
  if (!agent) return agent;
  const { apiKey, ...safe } = agent;
  return {
    ...safe,
    hasApiKey: Boolean(apiKey),
  };
}

function agentInput(data) {
  const allowed = [
    'name',
    'type',
    'description',
    'status',
    'language',
    'instructions',
    'provider',
    'channel',
    'connectionStatus',
    'reviewRequired',
  ];
  return Object.fromEntries(Object.entries(data).filter(([key]) => allowed.includes(key)));
}

async function listAgents(organizationId, query) {
  const { page, limit, skip } = parsePagination(query);
  const where = { organizationId, isActive: true };
  if (query.status) where.status = query.status;
  if (query.type) where.type = query.type;
  if (query.connectionStatus) where.connectionStatus = query.connectionStatus;
  const [items, total] = await Promise.all([
    prisma.agent.findMany({
      where, skip, take: limit, orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { id: true, name: true } },
        _count: { select: { tasks: true, activityLogs: true, agentEvents: true, reviewItems: true } },
      },
    }),
    prisma.agent.count({ where }),
  ]);
  return { items: items.map(publicAgent), meta: buildMeta(total, page, limit) };
}

async function getAgent(id, organizationId) {
  const agent = await prisma.agent.findFirst({
    where: { id, organizationId, isActive: true },
    include: {
      createdBy: { select: { id: true, name: true } },
      _count: { select: { tasks: true, activityLogs: true, agentEvents: true, reviewItems: true } },
    },
  });
  if (!agent) throw err('Agent not found.', 404);
  return publicAgent(agent);
}

async function createAgent(data, organizationId, userId) {
  const apiKey = generateApiKey();
  const agent = await prisma.agent.create({
    data: { ...agentInput(data), apiKey, organizationId, createdById: userId },
  });
  logAudit({ action: 'AGENT_CREATED', actorId: userId, organizationId, metadata: { agentId: agent.id, name: agent.name } });
  prisma.activityLog.create({
    data: { eventType: 'AGENT_CREATED', message: `Agent "${agent.name}" was connected.`, agentId: agent.id, organizationId },
  }).catch(() => {});
  // Return the apiKey once in the response so the user can copy it
  return { ...agent, apiKey };
}

async function updateAgent(id, data, organizationId, userId) {
  const agent = await prisma.agent.findFirst({ where: { id, organizationId, isActive: true } });
  if (!agent) throw err('Agent not found.', 404);
  const updated = await prisma.agent.update({ where: { id }, data: agentInput(data) });
  logAudit({ action: 'AGENT_UPDATED', actorId: userId, organizationId, metadata: { agentId: id } });
  return publicAgent(updated);
}

async function deleteAgent(id, organizationId, userId) {
  const agent = await prisma.agent.findFirst({ where: { id, organizationId, isActive: true } });
  if (!agent) throw err('Agent not found.', 404);
  await prisma.agent.update({ where: { id }, data: { isActive: false } });
  logAudit({ action: 'AGENT_DELETED', actorId: userId, organizationId, metadata: { agentId: id } });
}

async function getAgentTasks(agentId, organizationId, query) {
  await getAgent(agentId, organizationId);
  const { page, limit, skip } = parsePagination(query);
  const [items, total] = await Promise.all([
    prisma.task.findMany({ where: { agentId, organizationId }, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.task.count({ where: { agentId, organizationId } }),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
}

async function getAgentLogs(agentId, organizationId, query) {
  await getAgent(agentId, organizationId);
  const { page, limit, skip } = parsePagination(query);
  const [items, total] = await Promise.all([
    prisma.activityLog.findMany({ where: { agentId, organizationId }, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.activityLog.count({ where: { agentId, organizationId } }),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
}

async function getAgentEvents(agentId, organizationId, query) {
  await getAgent(agentId, organizationId);
  const { page, limit, skip } = parsePagination(query);
  const where = { agentId, organizationId };
  if (query.eventType) where.eventType = query.eventType;
  const [items, total] = await Promise.all([
    prisma.agentEvent.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.agentEvent.count({ where }),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
}

async function getIntegration(agentId, organizationId) {
  const agent = await prisma.agent.findFirst({ where: { id: agentId, organizationId, isActive: true } });
  if (!agent) throw err('Agent not found.', 404);
  return {
    agentId: agent.id,
    agentName: agent.name,
    apiKey: agent.apiKey,
    webhookEndpoint: '/api/v1/external/agent-events',
    headers: { 'X-Agent-Id': agent.id, 'X-Api-Key': agent.apiKey || '<your-api-key>' },
    examplePayload: {
      eventType: 'OUTPUT_GENERATED',
      channel: agent.channel || 'WhatsApp',
      customerName: 'Jane Smith',
      customerContact: '+1-555-0100',
      message: 'User asked about pricing',
      output: 'Our plans start at $49/month...',
      requiresReview: agent.reviewRequired,
    },
  };
}

module.exports = { listAgents, getAgent, createAgent, updateAgent, deleteAgent, getAgentTasks, getAgentLogs, getAgentEvents, getIntegration };
