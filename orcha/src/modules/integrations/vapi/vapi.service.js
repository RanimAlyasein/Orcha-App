const prisma = require('../../../config/prisma');
const { processEvent } = require('../../externalEvents/externalEvents.service');

// Maps Vapi call-ended reasons to success vs failure
const FAILED_REASONS = ['voicemail', 'assistant-error', 'pipeline-error', 'media-stream-error'];

function mapVapiEvent(message, agent) {
  const call = message.call || {};
  const customer = call.customer || {};
  const customerName = customer.name || null;
  const customerContact = customer.number || null;

  switch (message.type) {
    case 'call-started':
      return {
        eventType: 'TASK_STARTED',
        customerName,
        customerContact,
        message: `Incoming call from ${customerContact || 'unknown'}`,
        metadata: { vapiCallId: call.id, callType: call.type },
      };

    case 'call-ended': {
      const failed = FAILED_REASONS.includes(call.endedReason);
      const transcript = call.transcript || null;
      const summary = call.summary || null;
      return {
        eventType: failed ? 'TASK_FAILED' : 'TASK_COMPLETED',
        customerName,
        customerContact,
        message: `Call ended — reason: ${call.endedReason || 'unknown'}`,
        output: summary || transcript,
        requiresReview: agent.reviewRequired,
        metadata: {
          vapiCallId: call.id,
          endedReason: call.endedReason,
          durationSeconds: call.duration || null,
          transcript,
        },
      };
    }

    case 'transcript':
      // Only log final transcripts to avoid noise
      if (message.transcriptType !== 'final') return null;
      return {
        eventType: message.role === 'user' ? 'MESSAGE_RECEIVED' : 'MESSAGE_SENT',
        customerName,
        customerContact,
        message: message.transcript,
        metadata: { vapiCallId: call.id, role: message.role },
      };

    default:
      return null;
  }
}

async function handleVapiWebhook(agentId, apiKey, body) {
  const agent = await prisma.agent.findFirst({ where: { id: agentId, isActive: true } });
  if (!agent) throw Object.assign(new Error('Agent not found.'), { status: 404 });
  if (!agent.apiKey || agent.apiKey !== apiKey) throw Object.assign(new Error('Invalid API key.'), { status: 401 });

  const message = body.message || body;
  const eventData = mapVapiEvent(message, agent);

  // Silently accept event types we don't handle (Vapi sends many)
  if (!eventData) return { status: 'ignored', type: message.type };

  const result = await processEvent(agentId, apiKey, eventData);
  return { status: 'ok', type: message.type, ...result };
}

module.exports = { handleVapiWebhook };
