// ─── Authentication Middleware ─────────────────────────────────────────────────
// Verifies that a valid JWT token is present on the request.
// When this middleware passes, req.user is populated with the full user record
// from the database, so any controller that runs after it can trust req.user.
//
// How it works:
//   1. Read the Authorization header (must be "Bearer <token>")
//   2. Verify the JWT signature and expiry — rejects forged or expired tokens
//   3. Load the user from the database to confirm they still exist and are active
//   4. Attach the user to the request object and call next()
// ──────────────────────────────────────────────────────────────────────────────

const { verifyJwt } = require('../utils/tokens');
const { sendError } = require('../utils/response');
const prisma = require('../config/prisma');

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;

  // Reject requests that don't provide a Bearer token
  if (!header || !header.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required.', 401, 'UNAUTHORIZED');
  }

  // Strip the "Bearer " prefix to get the raw token string
  const token = header.slice(7);

  let payload;
  try {
    // verifyJwt checks the signature (using JWT_SECRET) and that the token hasn't expired.
    // If it fails, the token was tampered with or is expired.
    payload = verifyJwt(token);
  } catch {
    return sendError(res, 'Invalid or expired token.', 401, 'INVALID_TOKEN');
  }

  // Even if the token is valid, check that the user still exists and is not suspended.
  // This handles cases like: admin disables an account after the user already logged in.
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || !user.isActive) return sendError(res, 'Account not found or disabled.', 401, 'UNAUTHORIZED');

  // Attach the user to the request so downstream middleware and controllers can use it
  req.user = user;
  next();
};

module.exports = { authenticate };
