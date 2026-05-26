const { Router } = require('express');
const ctrl = require('./organizations.controller');
const { authenticate } = require('../../middleware/auth');
const { resolveOrg, requireRole, requireOrgRole } = require('../../middleware/authorize');
const { SYSTEM_ROLES, ORG_ROLES } = require('../../config/constants');

const router = Router();
router.use(authenticate);

router.get('/', requireRole(SYSTEM_ROLES.SYSTEM_ADMIN), ctrl.list);
router.get('/me/current', resolveOrg, ctrl.getMine);
router.put('/me/current', resolveOrg, requireOrgRole(ORG_ROLES.COMPANY_ADMIN), ctrl.update);
router.get('/:id', requireRole(SYSTEM_ROLES.SYSTEM_ADMIN), ctrl.getOne);
router.patch('/:id/status', requireRole(SYSTEM_ROLES.SYSTEM_ADMIN), ctrl.setStatus);

module.exports = router;
