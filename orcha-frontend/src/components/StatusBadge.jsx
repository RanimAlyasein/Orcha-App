// Displays a colored label badge for any status, role, or priority value across the app
const MAP = {
  // Agent operational status
  ACTIVE:          ['badge-active', 'Active'],
  IDLE:            ['badge-idle', 'Idle'],
  OFFLINE:         ['badge-offline', 'Offline'],
  MAINTENANCE:     ['badge-maintenance', 'Maintenance'],
  // Connection status
  CONNECTED:       ['badge-active', 'Connected'],
  DISCONNECTED:    ['badge-offline', 'Disconnected'],
  ERROR:           ['badge-urgent', 'Error'],
  PAUSED:          ['badge-maintenance', 'Paused'],
  PENDING_SETUP:   ['badge-todo', 'Pending Setup'],
  // Task status
  TODO:            ['badge-todo', 'Todo'],
  IN_PROGRESS:     ['badge-in_progress', 'In Progress'],
  DONE:            ['badge-done', 'Done'],
  CANCELLED:       ['badge-cancelled', 'Cancelled'],
  PENDING_REVIEW:  ['badge-pending', 'Pending Review'],
  FAILED:          ['badge-offline', 'Failed'],
  // Review status
  PENDING:         ['badge-pending', 'Pending'],
  APPROVED:        ['badge-active', 'Approved'],
  REJECTED:        ['badge-offline', 'Rejected'],
  EDITED:          ['badge-in_progress', 'Edited'],
  SENT:            ['badge-done', 'Sent'],
  // Event status
  RECEIVED:        ['badge-in_progress', 'Received'],
  PROCESSED:       ['badge-done', 'Processed'],
  // Priority
  HIGH:            ['badge-high', 'High'],
  URGENT:          ['badge-urgent', 'Urgent'],
  MEDIUM:          ['badge-medium', 'Medium'],
  LOW:             ['badge-low', 'Low'],
  // Org
  ACTIVE_ORG:      ['badge-active', 'Active'],
  SUSPENDED:       ['badge-offline', 'Suspended'],
  // Roles
  COMPANY_ADMIN:   ['badge-role-admin', 'Admin'],
  MANAGER:         ['badge-role-manager', 'Manager'],
  MEMBER:          ['badge-role-member', 'Member'],
  SYSTEM_ADMIN:    ['badge-role-sysadmin', 'System Admin'],
  // Customer
  PROSPECT:        ['badge-todo', 'Prospect'],
  LEAD:            ['badge-idle', 'Lead'],
  INACTIVE:        ['badge-maintenance', 'Inactive'],
  CHURNED:         ['badge-offline', 'Churned'],
};

export default function StatusBadge({ value }) {
  const [cls, label] = MAP[value] || ['badge-offline', value || '—'];
  return <span className={`badge ${cls}`}>{label}</span>;
}
