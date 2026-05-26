const prisma = require('../../config/prisma');
const { parsePagination, buildMeta } = require('../../utils/paginate');
const { logAudit } = require('../../utils/audit');

const err = (msg, status) => Object.assign(new Error(msg), { status });
const INCLUDE = { agent: { select: { id: true, name: true, type: true } }, createdBy: { select: { id: true, name: true } }, assignedTo: { select: { id: true, name: true } } };

function taskInput(data) {
  const allowed = ['title', 'description', 'status', 'priority', 'agentId', 'assignedToId', 'dueDate'];
  return Object.fromEntries(Object.entries(data).filter(([key]) => allowed.includes(key)));
}

async function validateTaskRelations(data, organizationId) {
  if (data.agentId) {
    const agent = await prisma.agent.findFirst({ where: { id: data.agentId, organizationId, isActive: true } });
    if (!agent) throw err('Agent not found in this organization.', 422);
  }

  if (data.assignedToId) {
    const membership = await prisma.membership.findFirst({
      where: { userId: data.assignedToId, organizationId, isActive: true },
    });
    if (!membership) throw err('Assigned user is not an active member of this organization.', 422);
  }
}

async function listTasks(organizationId, query) {
  const { page, limit, skip } = parsePagination(query);
  const where = { organizationId };
  if (query.status) where.status = query.status;
  if (query.agentId) where.agentId = query.agentId;
  if (query.priority) where.priority = query.priority;
  const [items, total] = await Promise.all([
    prisma.task.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: INCLUDE }),
    prisma.task.count({ where }),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
}

async function getTask(id, organizationId) {
  const task = await prisma.task.findFirst({ where: { id, organizationId }, include: INCLUDE });
  if (!task) throw err('Task not found.', 404);
  return task;
}

async function createTask(data, organizationId, userId) {
  const safeData = taskInput(data);
  await validateTaskRelations(safeData, organizationId);
  const task = await prisma.task.create({ data: { ...safeData, organizationId, createdById: userId } });
  logAudit({ action: 'TASK_CREATED', actorId: userId, organizationId, metadata: { taskId: task.id } });
  prisma.activityLog.create({ data: { eventType: 'TASK_CREATED', message: `Task "${task.title}" was created.`, taskId: task.id, agentId: task.agentId, organizationId } }).catch(() => {});
  return task;
}

async function updateTask(id, data, organizationId, userId) {
  const task = await prisma.task.findFirst({ where: { id, organizationId } });
  if (!task) throw err('Task not found.', 404);
  const safeData = taskInput(data);
  await validateTaskRelations(safeData, organizationId);
  const updated = await prisma.task.update({ where: { id }, data: safeData });
  if (safeData.status && safeData.status !== task.status) {
    prisma.activityLog.create({ data: { eventType: 'TASK_STATUS_CHANGED', message: `Task "${task.title}" status changed to ${safeData.status}.`, taskId: id, agentId: task.agentId, organizationId } }).catch(() => {});
  }
  logAudit({ action: 'TASK_UPDATED', actorId: userId, organizationId, metadata: { taskId: id } });
  return updated;
}

async function updateTaskStatus(id, status, organizationId, userId) {
  return updateTask(id, { status }, organizationId, userId);
}

async function deleteTask(id, organizationId, userId) {
  const task = await prisma.task.findFirst({ where: { id, organizationId } });
  if (!task) throw err('Task not found.', 404);
  await prisma.activityLog.deleteMany({ where: { taskId: id } });
  await prisma.task.delete({ where: { id } });
  logAudit({ action: 'TASK_DELETED', actorId: userId, organizationId, metadata: { taskId: id } });
}

module.exports = { listTasks, getTask, createTask, updateTask, updateTaskStatus, deleteTask };
