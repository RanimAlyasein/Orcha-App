// ─── Auth Routes ──────────────────────────────────────────────────────────────
// Defines all HTTP routes related to authentication and user account management.
// Each route is wired through one or more middleware layers before reaching the
// controller:
//
//   authLimiter  — rate limiting: blocks brute-force login/register attempts
//   validate     — input validation: rejects requests with missing/invalid fields
//   authenticate — JWT check: ensures the user is logged in (for protected routes)
//
// Pattern: POST /route → [optional middleware] → controller function
// ──────────────────────────────────────────────────────────────────────────────

const { Router } = require('express');
const ctrl = require('./auth.controller');
const { authenticate } = require('../../middleware/auth');
const { authLimiter } = require('../../middleware/rateLimiter');
const { validate } = require('../../middleware/validate');

const router = Router();

// Public routes — no JWT required
// authLimiter limits these to prevent bots from spamming register/login
router.post('/register',
  authLimiter,
  validate({ name: { required: true, minLength: 2 }, email: { required: true, isEmail: true }, password: { required: true, minLength: 6 }, organizationName: { required: true, minLength: 2 } }),
  ctrl.register
);

router.post('/login',
  authLimiter,
  validate({ email: { required: true, isEmail: true }, password: { required: true } }),
  ctrl.login
);

// Protected routes — require a valid JWT (authenticate middleware runs first)
router.get('/me',           authenticate, ctrl.me);                                                                                                             // Get current user profile
router.patch('/me',         authenticate, validate({ name: { required: true, minLength: 2 } }), ctrl.updateProfile);                                            // Update display name
router.patch('/me/password',authenticate, validate({ currentPassword: { required: true }, newPassword: { required: true, minLength: 6 } }), ctrl.changePassword); // Change password
router.post('/logout',      authenticate, ctrl.logout);                                                                                                         // Invalidate session (client-side)

// Password reset flow (public — user is not logged in when resetting)
router.post('/forgot-password',    authLimiter, validate({ email: { required: true, isEmail: true } }), ctrl.forgotPassword);   // Send reset email
router.post('/reset-password',     validate({ token: { required: true }, password: { required: true, minLength: 6 } }), ctrl.resetPassword); // Apply new password

// Email verification flow
router.post('/verify-email',       validate({ token: { required: true } }), ctrl.verifyEmail);  // Confirm email via link
router.post('/resend-verification',authenticate, ctrl.resendVerification);                       // Re-send verification email

module.exports = router;
