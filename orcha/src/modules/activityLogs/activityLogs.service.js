const prisma = require('../../config/prisma');
const { parsePagination, buildMeta } = require('../../utils/paginate');

const err = (msg, status) => Object.assign(new Error(msg), { status });

function activityLogInput(data) {
  const allowed = ['eventType', 'message', 'agentId', 'taskId'];
  return Object.fromEntries(Object.entries(data).filter(([key]) => allowed.includes(key)));
}

async function validateActivityLogRelations(data, organizationId) {
  if (data.agentId) {
    const agent = await prisma.agent.findFirst({ where: { id: data.agentId, organizationId, isActive: true } });
    if (!agent) throw err('Agent not found in this organization.', 422);
  }

  if (data.taskId) {
    const task = await prisma.task.findFirst({ where: { id: data.taskId, organizationId } });
    if (!task) throw err('Task not found in this organization.', 422);
  }
}

async function listActivityLogs(organizationId, query) {
  const { page, limit, skip } = parsePagination(query);
  const where = { organizationId };
  if (query.agentId) where.agentId = query.agentId;
  if (query.taskId) where.taskId = query.taskId;
  if (query.eventType) where.eventType = query.eventType;
  const [items, total] = await Promise.all([
    prisma.activityLog.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { agent: { select: { id: true, name: true } }, task: { select: { id: true, title: true } } } }),
    prisma.activityLog.count({ where }),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
}

async function createActivityLog(data, organizationId) {
  const safeData = activityLogInput(data);
  await validateActivityLogRelations(safeData, organizationId);
  return prisma.activityLog.create({ data: { ...safeData, organizationId } });
}

module.exports = { listActivityLogs, createActivityLog };
