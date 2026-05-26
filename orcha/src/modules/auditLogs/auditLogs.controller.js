const svc = require('./auditLogs.service');
const { sendList } = require('../../utils/response');

const list = async (req, res, next) => { try { const { items, meta } = await svc.listAuditLogs(req.user, req.organizationId, req.query); sendList(res, items, meta); } catch (e) { next(e); } };

module.exports = { list };
