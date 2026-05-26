const { Router } = require('express');
const ctrl = require('./activityLogs.controller');
const { authenticate } = require('../../middleware/auth');
const { resolveOrg } = require('../../middleware/authorize');

const router = Router();
router.use(authenticate, resolveOrg);
router.get('/', ctrl.list);
router.post('/', ctrl.create);

module.exports = router;
