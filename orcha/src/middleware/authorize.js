// ─── Authorization Middleware ──────────────────────────────────────────────────
// Handles role-based access control (RBAC). Three separate middleware functions
// work together to enforce who can access what:
//
//   requireRole   — checks the user's SYSTEM role (e.g. SYSTEM_ADMIN)
//   resolveOrg    — determines which organization the request belongs to and
//                   attaches it as req.organizationId
//   requireOrgRole — checks the user's role within their organization
//                   (e.g. COMPANY_ADMIN, MANAGER, MEMBER)
//
// These are composed per-route in each routes.js file.
// ──────────────────────────────────────────────────────────────────────────────

const { sendError } = require('../utils/response');
const prisma = require('../config/prisma');
const { SYSTEM_ROLES } = require('../config/constants');

// Checks that the logged-in user has one of the allowed system-level roles.
// Used to gate routes that only SYSTEM_ADMIN should access (e.g. admin panel).
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return sendError(res, 'Insufficient permissions.', 403, 'FORBIDDEN');
  next();
};

// Resolves which organization a request is scoped to and attaches it to req.
// SYSTEM_ADMINs can access any org by passing ?orgId= or X-Org-Id header.
// Regular users are automatically scoped to their own organization membership.
const resolveOrg = async (req, res, next) => {
  if (req.user.role === SYSTEM_ROLES.SYSTEM_ADMIN) {
    // A system admin must explicitly declare which org they are acting on
    const orgId = req.query.orgId || req.headers['x-org-id'];
    if (!orgId) return sendError(res, 'Organization context is required.', 400, 'ORG_REQUIRED');
    const org = await prisma.organization.findFirst({ where: { id: orgId, isActive: true } });
    if (!org) return sendError(res, 'Organization not found.', 404, 'ORG_NOT_FOUND');
    req.organizationId = orgId;
    return next();
  }

  // For normal users, look up their active membership to determine their org.
  // Takes the earliest membership (first org they joined) if they belong to multiple.
  const membership = await prisma.membership.findFirst({
    where: { userId: req.user.id, isActive: true },
    orderBy: { createdAt: 'asc' },
  });
  if (!membership) return sendError(res, 'You do not belong to any organization.', 403, 'NO_ORG');

  req.organizationId = membership.organizationId;
  req.membership = membership; // also attach the membership so requireOrgRole can read the role
  next();
};

// Checks that the user has one of the required org-level roles (e.g. COMPANY_ADMIN).
// SYSTEM_ADMINs bypass this check — they have full access to everything.
const requireOrgRole = (...roles) => (req, res, next) => {
  if (req.user.role === SYSTEM_ROLES.SYSTEM_ADMIN) return next();
  if (!req.membership || !roles.includes(req.membership.role)) {
    return sendError(res, 'Insufficient permissions.', 403, 'FORBIDDEN');
  }
  next();
};

module.exports = { requireRole, resolveOrg, requireOrgRole };
