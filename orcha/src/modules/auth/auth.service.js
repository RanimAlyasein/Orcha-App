// ─── Auth Service ──────────────────────────────────────────────────────────────
// Contains all business logic for authentication and account management.
// Services talk directly to the database (via Prisma) and to other services
// (e.g. the email service for sending verification/reset emails).
//
// This layer is isolated from HTTP — it knows nothing about req/res objects.
// That separation makes it easy to test and reuse.
// ──────────────────────────────────────────────────────────────────────────────

const prisma = require('../../config/prisma');
const { hashPassword, comparePassword } = require('../../utils/hash');   // bcrypt wrappers
const { signJwt, generateToken } = require('../../utils/tokens');        // JWT + random token generation
const { slugify } = require('../../utils/slug');                          // turns "Acme Corp" → "acme-corp"
const { logAudit } = require('../../utils/audit');                        // writes to the audit log table
const email = require('../email/email.service');                          // sends transactional emails

// Helper: creates an Error with a custom HTTP status code attached
const err = (msg, status) => Object.assign(new Error(msg), { status });

// Remove sensitive fields before returning a user object to the client.
// Passwords, verification tokens, and reset tokens must never leave the server.
const sanitize = (user) => {
  const { password, verificationToken, verificationExpiry, resetToken, resetTokenExpiry, ...safe } = user;
  return safe;
};

// ── Register ──────────────────────────────────────────────────────────────────
// Creates a new user AND a new organization in a single Prisma nested write.
// The user automatically becomes the COMPANY_ADMIN of the new organization.
async function register({ name, email: emailAddr, password, organizationName }) {
  // Prevent duplicate accounts
  const existing = await prisma.user.findUnique({ where: { email: emailAddr.toLowerCase() } });
  if (existing) throw err('An account with this email already exists.', 409);

  // Hash the password with bcrypt before storing — never store plaintext passwords
  const hashed = await hashPassword(password);

  // Generate a time-limited email verification token (expires in 24 hours)
  const verificationToken = generateToken();
  const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Generate a URL-safe slug for the org (e.g. "Acme Corp" → "acme-corp")
  let slug = slugify(organizationName);
  const slugExists = await prisma.organization.findUnique({ where: { slug } });
  if (slugExists) slug = `${slug}-${Date.now()}`; // append timestamp to avoid collisions

  // Single Prisma write: create user + organization + membership in one transaction
  const user = await prisma.user.create({
    data: {
      name, email: emailAddr.toLowerCase(), password: hashed, verificationToken, verificationExpiry,
      memberships: {
        create: {
          role: 'COMPANY_ADMIN',
          organization: { create: { name: organizationName, slug } },
        },
      },
    },
    include: { memberships: { include: { organization: true } } },
  });

  // Send verification email in the background — .catch(() => {}) means a failed
  // email does not prevent the user from registering
  email.sendVerificationEmail(user.email, verificationToken).catch(() => {});
  logAudit({ action: 'USER_REGISTERED', actorId: user.id, organizationId: user.memberships[0]?.organizationId });

  // Return a JWT so the user is immediately logged in after registering
  return { token: signJwt({ userId: user.id }), user: sanitize(user) };
}

// ── Login ─────────────────────────────────────────────────────────────────────
// Verifies email + password, returns a JWT token if correct.
// The same generic error message is used for both "email not found" and "wrong
// password" — this prevents an attacker from discovering which emails are registered.
async function login({ email: emailAddr, password }) {
  const user = await prisma.user.findUnique({ where: { email: emailAddr.toLowerCase() } });
  if (!user || !user.isActive) throw err('Invalid email or password.', 401);

  // comparePassword uses bcrypt.compare to check the plaintext against the stored hash
  if (!await comparePassword(password, user.password)) throw err('Invalid email or password.', 401);

  logAudit({ action: 'USER_LOGIN', actorId: user.id });

  // Reload the user with their org memberships so the frontend knows their role
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { memberships: { where: { isActive: true }, include: { organization: true }, orderBy: { createdAt: 'asc' } } },
  });
  return { token: signJwt({ userId: user.id }), user: sanitize(fullUser) };
}

// ── Get Current User ──────────────────────────────────────────────────────────
// Returns the full profile of the currently authenticated user, including their
// organization membership and role.
async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { memberships: { where: { isActive: true }, include: { organization: true }, orderBy: { createdAt: 'asc' } } },
  });
  if (!user) throw err('User not found.', 404);
  return sanitize(user);
}

// ── Forgot Password ───────────────────────────────────────────────────────────
// Generates a time-limited reset token and emails it to the user.
// Returns silently if the email is not found — no enumeration.
async function forgotPassword({ email: emailAddr }) {
  const user = await prisma.user.findUnique({ where: { email: emailAddr.toLowerCase() } });
  if (!user || !user.isActive) return; // silent — don't reveal if email exists
  const resetToken = generateToken();
  // Token expires in 1 hour
  await prisma.user.update({ where: { id: user.id }, data: { resetToken, resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000) } });
  email.sendPasswordResetEmail(user.email, resetToken).catch(() => {});
  logAudit({ action: 'PASSWORD_RESET_REQUESTED', actorId: user.id });
}

// ── Reset Password ────────────────────────────────────────────────────────────
// Finds the user by their reset token (checking expiry), then applies the new password.
// Clears the reset token so it can only be used once.
async function resetPassword({ token, password }) {
  // gt: new Date() ensures expired tokens are rejected
  const user = await prisma.user.findFirst({ where: { resetToken: token, resetTokenExpiry: { gt: new Date() } } });
  if (!user) throw err('Invalid or expired reset token.', 400);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(password), resetToken: null, resetTokenExpiry: null },
  });
  logAudit({ action: 'PASSWORD_RESET', actorId: user.id });
}

// ── Verify Email ──────────────────────────────────────────────────────────────
// Marks the user's email as verified after they click the link in their inbox.
async function verifyEmail({ token }) {
  const user = await prisma.user.findFirst({ where: { verificationToken: token, verificationExpiry: { gt: new Date() } } });
  if (!user) throw err('Invalid or expired verification token.', 400);
  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, verificationToken: null, verificationExpiry: null },
  });
}

// ── Resend Verification ───────────────────────────────────────────────────────
// Generates a fresh token and re-sends the verification email.
// No-ops silently if the user is already verified.
async function resendVerification(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isVerified) return;
  const verificationToken = generateToken();
  await prisma.user.update({ where: { id: user.id }, data: { verificationToken, verificationExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) } });
  email.sendVerificationEmail(user.email, verificationToken).catch(() => {});
}

// ── Update Profile ────────────────────────────────────────────────────────────
// Allows a user to change their display name.
async function updateProfile(userId, { name }) {
  if (!name || name.trim().length < 2) throw err('Name must be at least 2 characters.', 400);
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { name: name.trim() },
    include: { memberships: { where: { isActive: true }, include: { organization: true }, orderBy: { createdAt: 'asc' } } },
  });
  logAudit({ action: 'PROFILE_UPDATED', actorId: userId });
  return sanitize(updated);
}

// ── Change Password ───────────────────────────────────────────────────────────
// Requires the current password before allowing a change — prevents account
// takeover if someone leaves their browser session open.
async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw err('User not found.', 404);
  if (!await comparePassword(currentPassword, user.password)) throw err('Current password is incorrect.', 400);
  if (newPassword.length < 6) throw err('New password must be at least 6 characters.', 400);
  await prisma.user.update({ where: { id: userId }, data: { password: await hashPassword(newPassword) } });
  logAudit({ action: 'PASSWORD_CHANGED', actorId: userId });
}

module.exports = { register, login, getMe, forgotPassword, resetPassword, verifyEmail, resendVerification, updateProfile, changePassword };
