const prisma = require('../../config/prisma');

const err = (msg, status) => Object.assign(new Error(msg), { status });

async function processEvent(agentId, apiKey, eventData) {
  const agent = await prisma.agent.findFirst({ where: { id: agentId, isActive: true } });
  if (!agent) throw err('Agent not found.', 404);
  if (!agent.apiKey || agent.apiKey !== apiKey) throw err('Invalid API key.', 401);

  const { eventType = 'CUSTOM', channel, customerName, customerContact, message, output, metadata, requiresReview } = eventData;
  const shouldReview = requiresReview !== undefined ? requiresReview : agent.reviewRequired;

  const agentEvent = await prisma.agentEvent.create({
    data: {
      agentId: agent.id,
      organizationId: agent.organizationId,
      eventType,
      channel: channel || agent.channel,
      status: 'RECEIVED',
      customerName,
      customerContact,
      message,
      output,
      metadata: metadata ? JSON.stringify(metadata) : null,
      requiresReview: shouldReview,
    },
  });

  await prisma.agent.update({
    where: { id: agent.id },
    data: { lastEventAt: new Date(), connectionStatus: 'CONNECTED' },
  });

  prisma.activityLog.create({
    data: {
      eventType: 'AGENT_EVENT_RECEIVED',
      message: `Agent "${agent.name}" sent event: ${eventType}`,
      agentId: agent.id,
      organizationId: agent.organizationId,
    },
  }).catch(() => {});

  if (shouldReview && output) {
    await prisma.reviewItem.create({
      data: {
        agentId: agent.id,
        organizationId: agent.organizationId,
        agentEventId: agentEvent.id,
        status: 'PENDING',
        originalOutput: output,
      },
    });
  }

  return { eventId: agentEvent.id, status: 'RECEIVED', requiresReview: shouldReview };
}

async function simulateEvent(organizationId, userId, eventData) {
  const { agentId, ...rest } = eventData;
  const agent = await prisma.agent.findFirst({ where: { id: agentId, organizationId, isActive: true } });
  if (!agent) throw err('Agent not found.', 404);

  const { eventType = 'OUTPUT_GENERATED', channel, customerName, customerContact, message, output, requiresReview } = rest;
  const shouldReview = requiresReview !== undefined ? requiresReview : agent.reviewRequired;

  const agentEvent = await prisma.agentEvent.create({
    data: {
      agentId: agent.id,
      organizationId,
      eventType,
      channel: channel || agent.channel || 'Demo',
      status: 'RECEIVED',
      customerName: customerName || 'Demo Customer',
      customerContact: customerContact || 'demo@example.com',
      message: message || 'Simulated message',
      output,
      requiresReview: shouldReview,
    },
  });

  await prisma.agent.update({
    where: { id: agent.id },
    data: { lastEventAt: new Date(), connectionStatus: 'CONNECTED' },
  });

  prisma.activityLog.create({
    data: {
      eventType: 'AGENT_EVENT_SIMULATED',
      message: `Simulated event "${eventType}" for agent "${agent.name}".`,
      agentId: agent.id,
      organizationId,
    },
  }).catch(() => {});

  if (shouldReview && output) {
    await prisma.reviewItem.create({
      data: {
        agentId: agent.id,
        organizationId,
        agentEventId: agentEvent.id,
        status: 'PENDING',
        originalOutput: output,
      },
    });
  }

  return { eventId: agentEvent.id, agentName: agent.name, status: 'RECEIVED', requiresReview: shouldReview };
}

module.exports = { processEvent, simulateEvent };
