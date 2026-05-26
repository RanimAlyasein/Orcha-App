const svc = require('./dashboard.service');
const { sendSuccess } = require('../../utils/response');

const summary = async (req, res, next) => { try { sendSuccess(res, await svc.getSummary(req.organizationId)); } catch (e) { next(e); } };
const tasksByStatus = async (req, res, next) => { try { sendSuccess(res, await svc.getTasksByStatus(req.organizationId)); } catch (e) { next(e); } };
const eventsByType = async (req, res, next) => { try { sendSuccess(res, await svc.getEventsByType(req.organizationId)); } catch (e) { next(e); } };
const agentsByChannel = async (req, res, next) => { try { sendSuccess(res, await svc.getAgentsByChannel(req.organizationId)); } catch (e) { next(e); } };
const agentsByType = async (req, res, next) => { try { sendSuccess(res, await svc.getAgentsByType(req.organizationId)); } catch (e) { next(e); } };
const recentActivity = async (req, res, next) => { try { sendSuccess(res, await svc.getRecentActivity(req.organizationId)); } catch (e) { next(e); } };

module.exports = { summary, tasksByStatus, eventsByType, agentsByChannel, agentsByType, recentActivity };
