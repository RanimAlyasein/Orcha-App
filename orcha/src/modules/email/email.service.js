const nodemailer = require('nodemailer');
const env = require('../../config/env');

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;
  if (env.smtp.user && env.smtp.pass) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host, port: env.smtp.port,
      auth: { user: env.smtp.user, pass: env.smtp.pass },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    console.log('\n📧 Ethereal test account:');
    console.log(`   User: ${testAccount.user}`);
    console.log(`   Pass: ${testAccount.pass}`);
    console.log('   Preview at: https://ethereal.email/messages\n');
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email', port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }
  return transporter;
}

async function sendEmail({ to, subject, html }) {
  const t = await getTransporter();
  const info = await t.sendMail({ from: env.smtp.from, to, subject, html });
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) console.log(`📧 Preview: ${preview}`);
  return info;
}

const sendVerificationEmail = (email, token) =>
  sendEmail({
    to: email, subject: 'Verify your Orcha account',
    html: `<p>Verify your email: <a href="${env.frontendUrl}/verify-email?token=${token}">${env.frontendUrl}/verify-email?token=${token}</a></p><p>Expires in 24 hours.</p>`,
  });

const sendPasswordResetEmail = (email, token) =>
  sendEmail({
    to: email, subject: 'Reset your Orcha password',
    html: `<p>Reset your password: <a href="${env.frontendUrl}/reset-password?token=${token}">${env.frontendUrl}/reset-password?token=${token}</a></p><p>Expires in 1 hour.</p>`,
  });

const sendInvitationEmail = (email, orgName, token) =>
  sendEmail({
    to: email, subject: `You've been invited to join ${orgName} on Orcha`,
    html: `<p>You've been invited to join <strong>${orgName}</strong>.</p><p><a href="${env.frontendUrl}/accept-invitation?token=${token}">Accept Invitation</a></p><p>Expires in 7 days.</p>`,
  });

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail, sendInvitationEmail };
