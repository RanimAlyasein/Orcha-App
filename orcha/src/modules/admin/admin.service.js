const prisma = require('../../config/prisma');
const { parsePagination, buildMeta } = require('../../utils/paginate');
const { logAudit } = require('../../utils/audit');

async function listUsers(query) {
  const { page, limit, skip } = parsePagination(query);
  const [items, total] = await Promise.all([
    prisma.user.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, role: true, isVerified: true, isActive: true, createdAt: true } }),
    prisma.user.count(),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
}

async function setUserStatus(id, isActive, actorId) {
  const user = await prisma.user.update({ where: { id }, data: { isActive }, select: { id: true, name: true, email: true, isActive: true } });
  logAudit({ action: isActive ? 'USER_ACTIVATED' : 'USER_DISABLED', actorId, metadata: { userId: id } });
  return user;
}

module.exports = { listUsers, setUserStatus };
