const prisma = require('../../config/prisma');

async function getSummary(organizationId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [connectedAgents, eventsToday, pendingReviews, customers, members] = await Promise.all([
    prisma.agent.count({ where: { organizationId, isActive: true, connectionStatus: 'CONNECTED' } }),
    prisma.agentEvent.count({ where: { organizationId, createdAt: { gte: today } } }),
    prisma.reviewItem.count({ where: { organizationId, status: 'PENDING' } }),
    prisma.customer.count({ where: { organizationId } }),
    prisma.membership.count({ where: { organizationId, isActive: true } }),
  ]);
  return { connectedAgents, eventsToday, pendingReviews, customers, members };
}

async function getTasksByStatus(organizationId) {
  const statuses = ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'];
  const counts = await Promise.all(statuses.map(s => prisma.task.count({ where: { organizationId, status: s } })));
  const result = {};
  statuses.forEach((s, i) => { result[s] = counts[i]; });
  return result;
}

async function getEventsByType(organizationId) {
  const types = ['MESSAGE_RECEIVED', 'MESSAGE_SENT', 'TASK_STARTED', 'TASK_COMPLETED', 'OUTPUT_GENERATED', 'ERROR', 'CUSTOM'];
  const counts = await Promise.all(types.map(t => prisma.agentEvent.count({ where: { organizationId, eventType: t } })));
  return types.map((type, i) => ({ type, count: counts[i] })).filter(x => x.count > 0);
}

async function getAgentsByChannel(organizationId) {
  const channels = ['WhatsApp', 'Messenger', 'Website Chat', 'Voice', 'Email', 'Custom API', 'Demo', 'Other'];
  const counts = await Promise.all(channels.map(c => prisma.agent.count({ where: { organizationId, isActive: true, channel: c } })));
  return channels.map((channel, i) => ({ channel, count: counts[i] })).filter(x => x.count > 0);
}

async function getAgentsByType(organizationId) {
  const types = ['CALL_CENTER', 'SALES', 'SUPPORT', 'BOOKING', 'MARKETING', 'CUSTOM'];
  const counts = await Promise.all(types.map(t => prisma.agent.count({ where: { organizationId, type: t, isActive: true } })));
  return types.map((type, i) => ({ type, count: counts[i] }));
}

async function getRecentActivity(organizationId) {
  return prisma.activityLog.findMany({
    where: { organizationId }, orderBy: { createdAt: 'desc' }, take: 20,
    include: { agent: { select: { id: true, name: true } } },
  });
}

module.exports = { getSummary, getTasksByStatus, getEventsByType, getAgentsByChannel, getAgentsByType, getRecentActivity };
