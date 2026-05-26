const prisma = require('../../config/prisma');
const { parsePagination, buildMeta } = require('../../utils/paginate');
const { logAudit } = require('../../utils/audit');

const err = (msg, status) => Object.assign(new Error(msg), { status });

function customerInput(data) {
  const allowed = ['name', 'email', 'phone', 'company', 'status', 'notes'];
  return Object.fromEntries(Object.entries(data).filter(([key]) => allowed.includes(key)));
}

async function listCustomers(organizationId, query) {
  const { page, limit, skip } = parsePagination(query);
  const where = { organizationId };
  if (query.status) where.status = query.status;
  if (query.search) where.OR = [{ name: { contains: query.search } }, { email: { contains: query.search } }, { company: { contains: query.search } }];
  const [items, total] = await Promise.all([
    prisma.customer.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.customer.count({ where }),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
}

async function getCustomer(id, organizationId) {
  const c = await prisma.customer.findFirst({ where: { id, organizationId } });
  if (!c) throw err('Customer not found.', 404);
  return c;
}

async function createCustomer(data, organizationId, userId) {
  const c = await prisma.customer.create({ data: { ...customerInput(data), organizationId, createdById: userId } });
  logAudit({ action: 'CUSTOMER_CREATED', actorId: userId, organizationId, metadata: { customerId: c.id } });
  return c;
}

async function updateCustomer(id, data, organizationId, userId) {
  const c = await prisma.customer.findFirst({ where: { id, organizationId } });
  if (!c) throw err('Customer not found.', 404);
  const updated = await prisma.customer.update({ where: { id }, data: customerInput(data) });
  logAudit({ action: 'CUSTOMER_UPDATED', actorId: userId, organizationId, metadata: { customerId: id } });
  return updated;
}

async function deleteCustomer(id, organizationId, userId) {
  const c = await prisma.customer.findFirst({ where: { id, organizationId } });
  if (!c) throw err('Customer not found.', 404);
  await prisma.customer.delete({ where: { id } });
  logAudit({ action: 'CUSTOMER_DELETED', actorId: userId, organizationId, metadata: { customerId: id } });
}

module.exports = { listCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };
