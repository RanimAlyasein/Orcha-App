const prisma = require('../../config/prisma');
const { parsePagination, buildMeta } = require('../../utils/paginate');
const { logAudit } = require('../../utils/audit');

const err = (msg, status) => Object.assign(new Error(msg), { status });

async function listReviewItems(organizationId, query) {
  const { page, limit, skip } = parsePagination(query);
  const where = { organizationId };
  if (query.status) where.status = query.status;
  if (query.agentId) where.agentId = query.agentId;
  const [items, total] = await Promise.all([
    prisma.reviewItem.findMany({
      where, skip, take: limit, orderBy: { createdAt: 'desc' },
      include: { agent: { select: { id: true, name: true, channel: true } } },
    }),
    prisma.reviewItem.count({ where }),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
}

async function getReviewItem(id, organizationId) {
  const item = await prisma.reviewItem.findFirst({
    where: { id, organizationId },
    include: { agent: { select: { id: true, name: true, channel: true } } },
  });
  if (!item) throw err('Review item not found.', 404);
  return item;
}

async function approve(id, organizationId, userId) {
  const item = await getReviewItem(id, organizationId);
  if (item.status !== 'PENDING') throw err('Only PENDING items can be approved.', 400);
  const updated = await prisma.reviewItem.update({
    where: { id },
    data: { status: 'APPROVED', reviewedAt: new Date() },
  });
  logAudit({ action: 'REVIEW_APPROVED', actorId: userId, organizationId, metadata: { reviewItemId: id } });
  return updated;
}

async function reject(id, organizationId, userId, reviewNote) {
  const item = await getReviewItem(id, organizationId);
  if (item.status !== 'PENDING') throw err('Only PENDING items can be rejected.', 400);
  const updated = await prisma.reviewItem.update({
    where: { id },
    data: { status: 'REJECTED', reviewNote, reviewedAt: new Date() },
  });
  logAudit({ action: 'REVIEW_REJECTED', actorId: userId, organizationId, metadata: { reviewItemId: id } });
  return updated;
}

async function edit(id, organizationId, userId, editedOutput) {
  const item = await getReviewItem(id, organizationId);
  if (!['PENDING', 'EDITED'].includes(item.status)) throw err('Only PENDING or EDITED items can be edited.', 400);
  const updated = await prisma.reviewItem.update({
    where: { id },
    data: { status: 'EDITED', editedOutput, reviewedAt: new Date() },
  });
  logAudit({ action: 'REVIEW_EDITED', actorId: userId, organizationId, metadata: { reviewItemId: id } });
  return updated;
}

async function markSent(id, organizationId, userId) {
  const item = await getReviewItem(id, organizationId);
  if (!['APPROVED', 'EDITED'].includes(item.status)) throw err('Only APPROVED or EDITED items can be marked as sent.', 400);
  const updated = await prisma.reviewItem.update({
    where: { id },
    data: { status: 'SENT' },
  });
  logAudit({ action: 'REVIEW_SENT', actorId: userId, organizationId, metadata: { reviewItemId: id } });
  return updated;
}

module.exports = { listReviewItems, getReviewItem, approve, reject, edit, markSent };
