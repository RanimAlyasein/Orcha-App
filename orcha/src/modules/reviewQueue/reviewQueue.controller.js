const svc = require('./reviewQueue.service');
const { sendSuccess, sendList } = require('../../utils/response');

const list = async (req, res, next) => { try { const { items, meta } = await svc.listReviewItems(req.organizationId, req.query); sendList(res, items, meta); } catch (e) { next(e); } };
const getOne = async (req, res, next) => { try { sendSuccess(res, await svc.getReviewItem(req.params.id, req.organizationId)); } catch (e) { next(e); } };
const approve = async (req, res, next) => { try { sendSuccess(res, await svc.approve(req.params.id, req.organizationId, req.user.id)); } catch (e) { next(e); } };
const reject = async (req, res, next) => { try { sendSuccess(res, await svc.reject(req.params.id, req.organizationId, req.user.id, req.body.reviewNote)); } catch (e) { next(e); } };
const editItem = async (req, res, next) => { try { sendSuccess(res, await svc.edit(req.params.id, req.organizationId, req.user.id, req.body.editedOutput)); } catch (e) { next(e); } };
const markSent = async (req, res, next) => { try { sendSuccess(res, await svc.markSent(req.params.id, req.organizationId, req.user.id)); } catch (e) { next(e); } };

module.exports = { list, getOne, approve, reject, editItem, markSent };
