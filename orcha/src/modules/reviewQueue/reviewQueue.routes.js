const { Router } = require('express');
const ctrl = require('./reviewQueue.controller');
const { authenticate } = require('../../middleware/auth');
const { resolveOrg } = require('../../middleware/authorize');

const router = Router();
router.use(authenticate, resolveOrg);

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.patch('/:id/approve', ctrl.approve);
router.patch('/:id/reject', ctrl.reject);
router.patch('/:id/edit', ctrl.editItem);
router.patch('/:id/mark-sent', ctrl.markSent);

module.exports = router;
