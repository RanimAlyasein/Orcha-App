const svc = require('./activityLogs.service');
const { sendSuccess, sendList } = require('../../utils/response');

const list = async (req, res, next) => { try { const { items, meta } = await svc.listActivityLogs(req.organizationId, req.query); sendList(res, items, meta); } catch (e) { next(e); } };
const create = async (req, res, next) => { try { sendSuccess(res, await svc.createActivityLog(req.body, req.organizationId), 201); } catch (e) { next(e); } };

module.exports = { list, create };
