const { Router } = require('express');
const ctrl = require('./admin.controller');
const { authenticate } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/authorize');

const router = Router();
router.use(authenticate, requireRole('SYSTEM_ADMIN'));
router.get('/users', ctrl.listUsers);
router.patch('/users/:id/status', ctrl.setUserStatus);

module.exports = router;
