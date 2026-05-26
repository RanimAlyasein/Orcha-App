require('dotenv').config();

const INSECURE_SECRETS = ['orcha-dev-secret', 'orcha-docker-jwt-secret-change-in-production', 'change-me'];
const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET || 'orcha-dev-secret';

if (nodeEnv === 'production' && INSECURE_SECRETS.includes(jwtSecret)) {
  console.error('[FATAL] JWT_SECRET is set to an insecure default value in production. Set a strong random secret and restart.');
  process.exit(1);
}

module.exports = {
  port: parseInt(process.env.PORT || '3010', 10),
  nodeEnv,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map(s => s.trim()),
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@orcha.local',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
