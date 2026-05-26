const svc = require('./organizations.service');
const { sendSuccess, sendList } = require('../../utils/response');

const list = async (req, res, next) => { try { const { items, meta } = await svc.listOrganizations(req.query); sendList(res, items, meta); } catch (e) { next(e); } };
const getOne = async (req, res, next) => { try { sendSuccess(res, await svc.getOrganization(req.params.id)); } catch (e) { next(e); } };
const getMine = async (req, res, next) => { try { sendSuccess(res, await svc.getMyOrganization(req.organizationId)); } catch (e) { next(e); } };
const update = async (req, res, next) => { try { sendSuccess(res, await svc.updateOrganization(req.organizationId, req.body, req.user.id)); } catch (e) { next(e); } };
const setStatus = async (req, res, next) => { try { sendSuccess(res, await svc.setOrganizationStatus(req.params.id, req.body.isActive, req.user.id)); } catch (e) { next(e); } };

module.exports = { list, getOne, getMine, update, setStatus };
