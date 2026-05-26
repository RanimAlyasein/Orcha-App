const { Router } = require('express');
const ctrl = require('./team.controller');
const { authenticate } = require('../../middleware/auth');
const { resolveOrg, requireOrgRole } = require('../../middleware/authorize');
const { ORG_ROLES } = require('../../config/constants');

const router = Router();

// Public
router.get('/invitations/:token', ctrl.getInvitation);
router.post('/invitations/accept', ctrl.acceptInvitation);

// Authenticated
router.use(authenticate, resolveOrg);
router.get('/team', ctrl.listMembers);
router.post('/invitations', requireOrgRole(ORG_ROLES.COMPANY_ADMIN, ORG_ROLES.MANAGER), ctrl.invite);
router.patch('/team/:memberId/role', requireOrgRole(ORG_ROLES.COMPANY_ADMIN), ctrl.updateRole);
router.delete('/team/:memberId', requireOrgRole(ORG_ROLES.COMPANY_ADMIN), ctrl.removeMember);

module.exports = router;
