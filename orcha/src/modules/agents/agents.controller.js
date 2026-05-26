const svc = require('./agents.service');
const { sendSuccess, sendList } = require('../../utils/response');

const list = async (req, res, next) => { try { const { items, meta } = await svc.listAgents(req.organizationId, req.query); sendList(res, items, meta); } catch (e) { next(e); } };
const getOne = async (req, res, next) => { try { sendSuccess(res, await svc.getAgent(req.params.id, req.organizationId)); } catch (e) { next(e); } };
const create = async (req, res, next) => { try { sendSuccess(res, await svc.createAgent(req.body, req.organizationId, req.user.id), 201); } catch (e) { next(e); } };
const update = async (req, res, next) => { try { sendSuccess(res, await svc.updateAgent(req.params.id, req.body, req.organizationId, req.user.id)); } catch (e) { next(e); } };
const remove = async (req, res, next) => { try { await svc.deleteAgent(req.params.id, req.organizationId, req.user.id); sendSuccess(res, { message: 'Agent deleted.' }); } catch (e) { next(e); } };
const tasks = async (req, res, next) => { try { const { items, meta } = await svc.getAgentTasks(req.params.id, req.organizationId, req.query); sendList(res, items, meta); } catch (e) { next(e); } };
const logs = async (req, res, next) => { try { const { items, meta } = await svc.getAgentLogs(req.params.id, req.organizationId, req.query); sendList(res, items, meta); } catch (e) { next(e); } };
const events = async (req, res, next) => { try { const { items, meta } = await svc.getAgentEvents(req.params.id, req.organizationId, req.query); sendList(res, items, meta); } catch (e) { next(e); } };
const integration = async (req, res, next) => { try { sendSuccess(res, await svc.getIntegration(req.params.id, req.organizationId)); } catch (e) { next(e); } };

module.exports = { list, getOne, create, update, remove, tasks, logs, events, integration };
