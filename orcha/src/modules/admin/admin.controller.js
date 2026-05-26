const svc = require('./admin.service');
const { sendSuccess, sendList } = require('../../utils/response');

const listUsers = async (req, res, next) => {
  try {
    const { items, meta } = await svc.listUsers(req.query);
    const mapped = items.map(u => ({ ...u, status: u.isActive ? 'ACTIVE' : 'SUSPENDED' }));
    sendList(res, mapped, meta);
  } catch (e) { next(e); }
};

const setUserStatus = async (req, res, next) => {
  try {
    const isActive = req.body.status === 'ACTIVE';
    const user = await svc.setUserStatus(req.params.id, isActive, req.user.id);
    sendSuccess(res, { ...user, status: user.isActive ? 'ACTIVE' : 'SUSPENDED' });
  } catch (e) { next(e); }
};

module.exports = { listUsers, setUserStatus };
