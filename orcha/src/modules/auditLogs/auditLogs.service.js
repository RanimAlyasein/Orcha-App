const prisma = require('../../config/prisma');
const { parsePagination, buildMeta } = require('../../utils/paginate');

async function listAuditLogs(user, organizationId, query) {
  const { page, limit, skip } = parsePagination(query);
  const where = user.role === 'SYSTEM_ADMIN' ? {} : { organizationId };
  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { actor: { select: { id: true, name: true, email: true } } } }),
    prisma.auditLog.count({ where }),
  ]);
  return {
    items: items.map(l => ({ ...l, metadata: l.metadata ? JSON.parse(l.metadata) : null })),
    meta: buildMeta(total, page, limit),
  };
}

module.exports = { listAuditLogs };
