const { Router } = require('express');
const ctrl = require('./dashboard.controller');
const { authenticate } = require('../../middleware/auth');
const { resolveOrg } = require('../../middleware/authorize');

const router = Router();
router.use(authenticate, resolveOrg);
router.get('/summary', ctrl.summary);
router.get('/tasks-by-status', ctrl.tasksByStatus);
router.get('/events-by-type', ctrl.eventsByType);
router.get('/agents-by-channel', ctrl.agentsByChannel);
router.get('/agents-by-type', ctrl.agentsByType);
router.get('/recent-activity', ctrl.recentActivity);

module.exports = router;
