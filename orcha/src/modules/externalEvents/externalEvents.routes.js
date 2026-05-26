const { Router } = require('express');
const ctrl = require('./externalEvents.controller');
const { authenticate } = require('../../middleware/auth');
const { resolveOrg } = require('../../middleware/authorize');

const router = Router();

// Public webhook endpoint — authenticated via API key headers, not JWT
router.post('/external/agent-events', ctrl.receiveEvent);

// Demo simulate endpoint — requires JWT auth
router.post('/demo/simulate-event', authenticate, resolveOrg, ctrl.simulateEvent);

module.exports = router;
