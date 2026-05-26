const prisma = require('../config/prisma');

const logAudit = async ({ action, actorId = null, organizationId = null, metadata = null }) => {
  try {
    await prisma.auditLog.create({
      data: { action, actorId, organizationId, metadata: metadata ? JSON.stringify(metadata) : null },
    });
  } catch { /* audit failure must never crash main flow */ }
};

module.exports = { logAudit };
