const router = require('express').Router();
const { handleVapiWebhook } = require('./vapi.service');

// POST /api/v1/integrations/vapi/:agentId
// Vapi sends its secret via the x-vapi-secret header — we use it as the Orcha API key
router.post('/:agentId', async (req, res, next) => {
  try {
    const apiKey = req.headers['x-vapi-secret'] || req.headers['x-api-key'];
    if (!apiKey) return res.status(400).json({ success: false, error: 'Missing x-vapi-secret header.' });

    const result = await handleVapiWebhook(req.params.agentId, apiKey, req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
