const svc = require('./tasks.service');
const { sendSuccess, sendList } = require('../../utils/response');

const list = async (req, res, next) => { try { const { items, meta } = await svc.listTasks(req.organizationId, req.query); sendList(res, items, meta); } catch (e) { next(e); } };
const getOne = async (req, res, next) => { try { sendSuccess(res, await svc.getTask(req.params.id, req.organizationId)); } catch (e) { next(e); } };
const create = async (req, res, next) => { try { sendSuccess(res, await svc.createTask(req.body, req.organizationId, req.user.id), 201); } catch (e) { next(e); } };
const update = async (req, res, next) => { try { sendSuccess(res, await svc.updateTask(req.params.id, req.body, req.organizationId, req.user.id)); } catch (e) { next(e); } };
const updateStatus = async (req, res, next) => { try { sendSuccess(res, await svc.updateTaskStatus(req.params.id, req.body.status, req.organizationId, req.user.id)); } catch (e) { next(e); } };
const remove = async (req, res, next) => { try { await svc.deleteTask(req.params.id, req.organizationId, req.user.id); sendSuccess(res, { message: 'Task deleted.' }); } catch (e) { next(e); } };

module.exports = { list, getOne, create, update, updateStatus, remove };
