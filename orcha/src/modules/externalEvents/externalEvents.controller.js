const svc = require('./externalEvents.service');
const { sendSuccess } = require('../../utils/response');

const receiveEvent = async (req, res, next) => {
  try {
    const agentId = req.headers['x-agent-id'];
    const apiKey = req.headers['x-api-key'];
    if (!agentId || !apiKey) {
      return res.status(400).json({ success: false, error: { message: 'Missing X-Agent-Id or X-Api-Key headers.', code: 'BAD_REQUEST' } });
    }
    sendSuccess(res, await svc.processEvent(agentId, apiKey, req.body), 200);
  } catch (e) { next(e); }
};

const simulateEvent = async (req, res, next) => {
  try {
    sendSuccess(res, await svc.simulateEvent(req.organizationId, req.user.id, req.body), 201);
  } catch (e) { next(e); }
};

module.exports = { receiveEvent, simulateEvent };
