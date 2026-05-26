const { Router } = require('express');
const ctrl = require('./agents.controller');
const { authenticate } = require('../../middleware/auth');
const { resolveOrg, requireOrgRole } = require('../../middleware/authorize');
const { ORG_ROLES } = require('../../config/constants');

const router = Router();
router.use(authenticate, resolveOrg);

router.get('/', ctrl.list);
router.post('/', requireOrgRole(ORG_ROLES.COMPANY_ADMIN, ORG_ROLES.MANAGER), ctrl.create);
router.get('/:id', ctrl.getOne);
router.put('/:id', requireOrgRole(ORG_ROLES.COMPANY_ADMIN, ORG_ROLES.MANAGER), ctrl.update);
router.delete('/:id', requireOrgRole(ORG_ROLES.COMPANY_ADMIN, ORG_ROLES.MANAGER), ctrl.remove);
router.get('/:id/tasks', ctrl.tasks);
router.get('/:id/logs', ctrl.logs);
router.get('/:id/events', ctrl.events);
router.get('/:id/integration', requireOrgRole(ORG_ROLES.COMPANY_ADMIN, ORG_ROLES.MANAGER), ctrl.integration);

module.exports = router;
