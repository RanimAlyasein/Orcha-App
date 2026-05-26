const prisma = require('../../config/prisma');
const { parsePagination, buildMeta } = require('../../utils/paginate');
const { logAudit } = require('../../utils/audit');

async function listOrganizations(query) {
  const { page, limit, skip } = parsePagination(query);
  const [items, total] = await Promise.all([
    prisma.organization.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.organization.count(),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
}

async function getOrganization(id) {
  const org = await prisma.organization.findUnique({ where: { id }, include: { _count: { select: { memberships: true, agents: true, tasks: true, customers: true } } } });
  if (!org) throw Object.assign(new Error('Organization not found.'), { status: 404 });
  return org;
}

async function getMyOrganization(organizationId) {
  return getOrganization(organizationId);
}

async function updateOrganization(organizationId, data, actorId) {
  const org = await prisma.organization.update({ where: { id: organizationId }, data: { name: data.name } });
  logAudit({ action: 'ORGANIZATION_UPDATED', actorId, organizationId });
  return org;
}

async function setOrganizationStatus(id, isActive, actorId) {
  const org = await prisma.organization.update({ where: { id }, data: { isActive } });
  logAudit({ action: isActive ? 'ORGANIZATION_ACTIVATED' : 'ORGANIZATION_DISABLED', actorId, organizationId: id });
  return org;
}

module.exports = { listOrganizations, getOrganization, getMyOrganization, updateOrganization, setOrganizationStatus };
