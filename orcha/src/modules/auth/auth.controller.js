// ─── Auth Controller ───────────────────────────────────────────────────────────
// Controllers are the "thin layer" between routes and services.
// Their only job is to:
//   1. Extract what the service needs from the request (body, user, params)
//   2. Call the service function
//   3. Send the result back as an HTTP response
//   4. Forward any error to the global error handler via next(e)
//
// No business logic lives here — that belongs in auth.service.js.
// ──────────────────────────────────────────────────────────────────────────────

const svc = require('./auth.service');
const { sendSuccess } = require('../../utils/response');

// POST /api/v1/auth/register — create a new user + organization, return JWT
const register = async (req, res, next) => { try { sendSuccess(res, await svc.register(req.body), 201); } catch (e) { next(e); } };

// POST /api/v1/auth/login — verify credentials, return JWT
const login = async (req, res, next) => { try { sendSuccess(res, await svc.login(req.body)); } catch (e) { next(e); } };

// GET /api/v1/auth/me — return the current user's profile (from the JWT)
const me = async (req, res, next) => { try { sendSuccess(res, await svc.getMe(req.user.id)); } catch (e) { next(e); } };

// POST /api/v1/auth/logout — JWT is stateless, so logout is handled client-side.
// We return success so the frontend knows to clear its stored token.
const logout = (req, res) => sendSuccess(res, { message: 'Logged out.' });

// POST /api/v1/auth/forgot-password — send a password reset email
const forgotPassword = async (req, res, next) => {
  try {
    await svc.forgotPassword(req.body);
    // The response is intentionally vague ("if that email exists...") to prevent
    // user enumeration — an attacker shouldn't know if an email is registered
    sendSuccess(res, { message: 'If that email exists, a reset link has been sent.' });
  } catch (e) { next(e); }
};

// POST /api/v1/auth/reset-password — apply a new password using the reset token
const resetPassword = async (req, res, next) => { try { await svc.resetPassword(req.body); sendSuccess(res, { message: 'Password reset successfully.' }); } catch (e) { next(e); } };

// POST /api/v1/auth/verify-email — confirm email ownership via the token from the email link
const verifyEmail = async (req, res, next) => { try { await svc.verifyEmail(req.body); sendSuccess(res, { message: 'Email verified.' }); } catch (e) { next(e); } };

// POST /api/v1/auth/resend-verification — re-send the verification email
const resendVerification = async (req, res, next) => { try { await svc.resendVerification(req.user.id); sendSuccess(res, { message: 'Verification email resent.' }); } catch (e) { next(e); } };

// PATCH /api/v1/auth/me — update display name
const updateProfile = async (req, res, next) => { try { sendSuccess(res, await svc.updateProfile(req.user.id, req.body)); } catch (e) { next(e); } };

// PATCH /api/v1/auth/me/password — change password (requires current password)
const changePassword = async (req, res, next) => { try { await svc.changePassword(req.user.id, req.body); sendSuccess(res, { message: 'Password changed.' }); } catch (e) { next(e); } };

module.exports = { register, login, me, logout, forgotPassword, resetPassword, verifyEmail, resendVerification, updateProfile, changePassword };
