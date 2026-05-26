const { Router } = require('express');
const ctrl = require('./auditLogs.controller');
const { authenticate } = require('../../middleware/auth');
const { resolveOrg } = require('../../middleware/authorize');

const router = Router();
router.use(authenticate, resolveOrg);
router.get('/', ctrl.list);

module.exports = router;
