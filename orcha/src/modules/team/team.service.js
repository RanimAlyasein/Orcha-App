const prisma = require('../../config/prisma');
const { generateToken, signJwt } = require('../../utils/tokens');
const { hashPassword } = require('../../utils/hash');
const { logAudit } = require('../../utils/audit');
const emailSvc = require('../email/email.service');

const err = (msg, status) => Object.assign(new Error(msg), { status });

async function listMembers(organizationId) {
  return prisma.membership.findMany({
    where: { organizationId, isActive: true },
    include: { user: { select: { id: true, name: true, email: true, isVerified: true, isActive: true, createdAt: true } } },
    orderBy: { createdAt: 'asc' },
  });
}

async function inviteMember({ email, role, organizationId, invitedById }) {
  const org = await prisma.organization.findUnique({ where: { id: organizationId } });
  if (!org) throw err('Organization not found.', 404);

  const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existingUser) {
    const existing = await prisma.membership.findUnique({ where: { userId_organizationId: { userId: existingUser.id, organizationId } } });
    if (existing && existing.isActive) throw err('User is already a member.', 409);
  }

  const token = generateToken();
  await prisma.invitation.updateMany({ where: { email: email.toLowerCase(), organizationId, acceptedAt: null }, data: { expiresAt: new Date(0) } });
  const invitation = await prisma.invitation.create({
    data: { email: email.toLowerCase(), token, role, organizationId, invitedById, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  });
  emailSvc.sendInvitationEmail(email, org.name, token).catch(() => {});
  logAudit({ action: 'MEMBER_INVITED', actorId: invitedById, organizationId, metadata: { email, role } });
  return invitation;
}

async function getInvitation(token) {
  const inv = await prisma.invitation.findUnique({ where: { token }, include: { organization: true } });
  if (!inv) throw err('Invitation not found.', 404);
  if (inv.acceptedAt) throw err('Invitation already accepted.', 400);
  if (inv.expiresAt < new Date()) throw err('Invitation has expired.', 400);
  const existingUser = await prisma.user.findUnique({ where: { email: inv.email } });
  return { ...inv, userExists: !!existingUser };
}

async function acceptInvitation({ token, name, password }) {
  const inv = await getInvitation(token);
  let user = await prisma.user.findUnique({ where: { email: inv.email } });
  if (!user) {
    if (!name || !password) throw err('Name and password are required.', 400);
    user = await prisma.user.create({ data: { name, email: inv.email, password: await hashPassword(password), isVerified: true } });
  }
  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: user.id, organizationId: inv.organizationId } },
    create: { userId: user.id, organizationId: inv.organizationId, role: inv.role },
    update: { role: inv.role, isActive: true },
  });
  await prisma.invitation.update({ where: { id: inv.id }, data: { acceptedAt: new Date() } });
  logAudit({ action: 'INVITATION_ACCEPTED', actorId: user.id, organizationId: inv.organizationId });
  const fullUser = await prisma.user.findUnique({ where: { id: user.id }, include: { memberships: { include: { organization: true } } } });
  const jwtToken = signJwt({ userId: user.id });
  return { token: jwtToken, user: fullUser };
}

async function updateMemberRole({ memberId, role, organizationId, actorId }) {
  const m = await prisma.membership.findFirst({ where: { id: memberId, organizationId } });
  if (!m) throw err('Member not found.', 404);
  const updated = await prisma.membership.update({ where: { id: memberId }, data: { role } });
  logAudit({ action: 'MEMBER_ROLE_UPDATED', actorId, organizationId, metadata: { memberId, role } });
  return updated;
}

async function removeMember({ memberId, organizationId, actorId }) {
  const m = await prisma.membership.findFirst({ where: { id: memberId, organizationId } });
  if (!m) throw err('Member not found.', 404);
  await prisma.membership.update({ where: { id: memberId }, data: { isActive: false } });
  logAudit({ action: 'MEMBER_REMOVED', actorId, organizationId, metadata: { memberId } });
}

module.exports = { listMembers, inviteMember, getInvitation, acceptInvitation, updateMemberRole, removeMember };
