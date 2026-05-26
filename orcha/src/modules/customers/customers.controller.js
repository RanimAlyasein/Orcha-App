const svc = require('./customers.service');
const { sendSuccess, sendList } = require('../../utils/response');

const list = async (req, res, next) => { try { const { items, meta } = await svc.listCustomers(req.organizationId, req.query); sendList(res, items, meta); } catch (e) { next(e); } };
const getOne = async (req, res, next) => { try { sendSuccess(res, await svc.getCustomer(req.params.id, req.organizationId)); } catch (e) { next(e); } };
const create = async (req, res, next) => { try { sendSuccess(res, await svc.createCustomer(req.body, req.organizationId, req.user.id), 201); } catch (e) { next(e); } };
const update = async (req, res, next) => { try { sendSuccess(res, await svc.updateCustomer(req.params.id, req.body, req.organizationId, req.user.id)); } catch (e) { next(e); } };
const remove = async (req, res, next) => { try { await svc.deleteCustomer(req.params.id, req.organizationId, req.user.id); sendSuccess(res, { message: 'Customer deleted.' }); } catch (e) { next(e); } };

module.exports = { list, getOne, create, update, remove };
