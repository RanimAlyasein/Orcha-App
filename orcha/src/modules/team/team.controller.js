const svc = require('./team.service');
const { sendSuccess } = require('../../utils/response');

const listMembers = async (req, res, next) => { try { sendSuccess(res, await svc.listMembers(req.organizationId)); } catch (e) { next(e); } };
const invite = async (req, res, next) => { try { sendSuccess(res, await svc.inviteMember({ email: req.body.email, role: req.body.role || 'MEMBER', organizationId: req.organizationId, invitedById: req.user.id }), 201); } catch (e) { next(e); } };
const getInvitation = async (req, res, next) => { try { sendSuccess(res, await svc.getInvitation(req.params.token)); } catch (e) { next(e); } };
const acceptInvitation = async (req, res, next) => { try { sendSuccess(res, await svc.acceptInvitation(req.body)); } catch (e) { next(e); } };
const updateRole = async (req, res, next) => { try { sendSuccess(res, await svc.updateMemberRole({ memberId: req.params.memberId, role: req.body.role, organizationId: req.organizationId, actorId: req.user.id })); } catch (e) { next(e); } };
const removeMember = async (req, res, next) => { try { await svc.removeMember({ memberId: req.params.memberId, organizationId: req.organizationId, actorId: req.user.id }); sendSuccess(res, { message: 'Member removed.' }); } catch (e) { next(e); } };

module.exports = { listMembers, invite, getInvitation, acceptInvitation, updateRole, removeMember };
