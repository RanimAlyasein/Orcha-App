const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Orcha API',
    version: '2.0.0',
    description: 'Orcha — AI Agent Management & Monitoring Platform',
  },
  servers: [{ url: '/api/v1', description: 'Local dev' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Auth', description: 'Authentication & profile' },
    { name: 'Agents', description: 'AI agent management' },
    { name: 'Tasks', description: 'Task management' },
    { name: 'Customers', description: 'CRM contacts' },
    { name: 'Team', description: 'Team members & invitations' },
    { name: 'Review Queue', description: 'Human review of agent outputs' },
    { name: 'Dashboard', description: 'Stats & charts' },
    { name: 'Activity Logs', description: 'Activity & audit trail' },
    { name: 'Admin', description: 'System-wide admin (SYSTEM_ADMIN only)' },
    { name: 'Webhook', description: 'External agent event ingestion' },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'], summary: 'Register a new account',
        security: [],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name','email','password','organizationName'], properties: { name: { type: 'string', example: 'Jane Smith' }, email: { type: 'string', example: 'jane@company.com' }, password: { type: 'string', example: 'secret123' }, organizationName: { type: 'string', example: 'Acme Corp' } } } } } },
        responses: { 201: { description: 'Registered' }, 409: { description: 'Email already exists' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'], summary: 'Log in and get a JWT token',
        security: [],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email','password'], properties: { email: { type: 'string', example: 'manager@orcha.demo' }, password: { type: 'string', example: 'password123' } } } } } },
        responses: { 200: { description: 'Returns token + user' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/auth/me': {
      get: { tags: ['Auth'], summary: 'Get current user profile', responses: { 200: { description: 'User object' } } },
      patch: {
        tags: ['Auth'], summary: 'Update display name',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string', example: 'New Name' } } } } } },
        responses: { 200: { description: 'Updated user' } },
      },
    },
    '/auth/me/password': {
      patch: {
        tags: ['Auth'], summary: 'Change password',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { currentPassword: { type: 'string' }, newPassword: { type: 'string' } } } } } },
        responses: { 200: { description: 'Password changed' } },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'], summary: 'Request a password reset email',
        security: [],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string', example: 'manager@orcha.demo' } } } } } },
        responses: { 200: { description: 'Reset link sent (silent)' } },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'], summary: 'Reset password using token from email',
        security: [],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' }, password: { type: 'string' } } } } } },
        responses: { 200: { description: 'Password reset' }, 400: { description: 'Invalid/expired token' } },
      },
    },
    '/auth/logout': {
      post: { tags: ['Auth'], summary: 'Log out (client should discard token)', responses: { 200: { description: 'Logged out' } } },
    },
    '/agents': {
      get: {
        tags: ['Agents'], summary: 'List all agents for the organisation',
        parameters: [{ in: 'query', name: 'page', schema: { type: 'integer', default: 1 } }, { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } }, { in: 'query', name: 'status', schema: { type: 'string', enum: ['ACTIVE','IDLE','OFFLINE','MAINTENANCE'] } }],
        responses: { 200: { description: 'Paginated agent list' } },
      },
      post: {
        tags: ['Agents'], summary: 'Connect (register) a new agent',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string', example: 'Sara Sales Bot' }, type: { type: 'string', example: 'SALES' }, provider: { type: 'string', example: 'WHATSAPP_BOT' }, channel: { type: 'string', example: 'WhatsApp' }, reviewRequired: { type: 'boolean', example: true }, language: { type: 'string', example: 'English' }, description: { type: 'string' } } } } } },
        responses: { 201: { description: 'Agent created with apiKey' } },
      },
    },
    '/agents/{id}': {
      get: { tags: ['Agents'], summary: 'Get a single agent', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Agent object' }, 404: { description: 'Not found' } } },
      put: { tags: ['Agents'], summary: 'Update an agent', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 200: { description: 'Updated agent' } } },
      delete: { tags: ['Agents'], summary: 'Deactivate an agent', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/agents/{id}/tasks': {
      get: { tags: ['Agents'], summary: 'List tasks for an agent', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Task list' } } },
    },
    '/agents/{id}/events': {
      get: { tags: ['Agents'], summary: 'List events received by an agent', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Event list' } } },
    },
    '/agents/{id}/integration': {
      get: { tags: ['Agents'], summary: 'Get webhook integration details & API key', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Integration info' } } },
    },
    '/tasks': {
      get: { tags: ['Tasks'], summary: 'List all tasks', parameters: [{ in: 'query', name: 'page', schema: { type: 'integer' } }, { in: 'query', name: 'status', schema: { type: 'string' } }, { in: 'query', name: 'priority', schema: { type: 'string' } }], responses: { 200: { description: 'Task list' } } },
      post: { tags: ['Tasks'], summary: 'Create a task', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['title'], properties: { title: { type: 'string', example: 'Follow up with leads' }, description: { type: 'string' }, status: { type: 'string', example: 'TODO' }, priority: { type: 'string', example: 'HIGH' }, agentId: { type: 'string' } } } } } }, responses: { 201: { description: 'Task created' } } },
    },
    '/tasks/{id}': {
      get: { tags: ['Tasks'], summary: 'Get a task', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Task' } } },
      put: { tags: ['Tasks'], summary: 'Update a task', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Tasks'], summary: 'Delete a task', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/tasks/{id}/status': {
      patch: { tags: ['Tasks'], summary: 'Update task status only', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', example: 'IN_PROGRESS' } } } } } }, responses: { 200: { description: 'Updated' } } },
    },
    '/customers': {
      get: { tags: ['Customers'], summary: 'List customers / CRM contacts', parameters: [{ in: 'query', name: 'page', schema: { type: 'integer' } }, { in: 'query', name: 'status', schema: { type: 'string' } }, { in: 'query', name: 'search', schema: { type: 'string' } }], responses: { 200: { description: 'Customer list' } } },
      post: { tags: ['Customers'], summary: 'Add a customer', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string', example: 'Alice Nguyen' }, email: { type: 'string' }, phone: { type: 'string' }, company: { type: 'string' }, status: { type: 'string', example: 'LEAD' }, notes: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
    },
    '/customers/{id}': {
      get: { tags: ['Customers'], summary: 'Get a customer', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Customer' } } },
      put: { tags: ['Customers'], summary: 'Update a customer', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Customers'], summary: 'Delete a customer', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/team': {
      get: { tags: ['Team'], summary: 'List team members in your organisation', responses: { 200: { description: 'Member list' } } },
    },
    '/invitations': {
      post: { tags: ['Team'], summary: 'Invite a new member by email', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string', example: 'colleague@company.com' }, role: { type: 'string', example: 'MEMBER' } } } } } }, responses: { 201: { description: 'Invitation sent' } } },
    },
    '/invitations/{token}': {
      get: { tags: ['Team'], summary: 'Look up an invitation by token', security: [], parameters: [{ in: 'path', name: 'token', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Invitation details' } } },
    },
    '/invitations/accept': {
      post: { tags: ['Team'], summary: 'Accept an invitation', security: [], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' }, name: { type: 'string' }, password: { type: 'string' } } } } } }, responses: { 200: { description: 'Joined & JWT returned' } } },
    },
    '/review-queue': {
      get: { tags: ['Review Queue'], summary: 'List review items', parameters: [{ in: 'query', name: 'status', schema: { type: 'string', enum: ['PENDING','APPROVED','REJECTED','EDITED','SENT'] } }, { in: 'query', name: 'page', schema: { type: 'integer' } }], responses: { 200: { description: 'Review item list' } } },
    },
    '/review-queue/{id}/approve': {
      patch: { tags: ['Review Queue'], summary: 'Approve a review item', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Approved' } } },
    },
    '/review-queue/{id}/reject': {
      patch: { tags: ['Review Queue'], summary: 'Reject a review item', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { reviewNote: { type: 'string' } } } } } }, responses: { 200: { description: 'Rejected' } } },
    },
    '/review-queue/{id}/edit': {
      patch: { tags: ['Review Queue'], summary: 'Edit agent output and approve', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { editedOutput: { type: 'string' } } } } } }, responses: { 200: { description: 'Edited' } } },
    },
    '/review-queue/{id}/mark-sent': {
      patch: { tags: ['Review Queue'], summary: 'Mark a reviewed item as sent', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Marked sent' } } },
    },
    '/dashboard/summary': {
      get: { tags: ['Dashboard'], summary: 'Get KPI summary (agents, events, reviews, customers, members)', responses: { 200: { description: 'Summary stats' } } },
    },
    '/dashboard/tasks-by-status': {
      get: { tags: ['Dashboard'], summary: 'Task counts grouped by status', responses: { 200: { description: 'Status counts' } } },
    },
    '/dashboard/events-by-type': {
      get: { tags: ['Dashboard'], summary: 'Event counts grouped by type', responses: { 200: { description: 'Type counts' } } },
    },
    '/dashboard/recent-activity': {
      get: { tags: ['Dashboard'], summary: 'Last 20 activity log entries', responses: { 200: { description: 'Activity list' } } },
    },
    '/activity-logs': {
      get: { tags: ['Activity Logs'], summary: 'List activity logs', parameters: [{ in: 'query', name: 'page', schema: { type: 'integer' } }], responses: { 200: { description: 'Log list' } } },
    },
    '/audit-logs': {
      get: { tags: ['Activity Logs'], summary: 'List audit logs', parameters: [{ in: 'query', name: 'page', schema: { type: 'integer' } }], responses: { 200: { description: 'Audit list' } } },
    },
    '/admin/users': {
      get: { tags: ['Admin'], summary: 'List all platform users (SYSTEM_ADMIN only)', responses: { 200: { description: 'User list' } } },
    },
    '/admin/users/{id}/status': {
      patch: { tags: ['Admin'], summary: 'Activate or suspend a user', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['ACTIVE','SUSPENDED'] } } } } } }, responses: { 200: { description: 'Updated' } } },
    },
    '/external/agent-events': {
      post: {
        tags: ['Webhook'], summary: 'Receive an event from an external agent',
        security: [],
        parameters: [{ in: 'header', name: 'X-Agent-Id', required: true, schema: { type: 'string' } }, { in: 'header', name: 'X-Api-Key', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { eventType: { type: 'string', example: 'OUTPUT_GENERATED' }, channel: { type: 'string', example: 'WhatsApp' }, customerName: { type: 'string' }, customerContact: { type: 'string' }, message: { type: 'string' }, output: { type: 'string' }, requiresReview: { type: 'boolean' } } } } } },
        responses: { 200: { description: 'Event received' }, 401: { description: 'Invalid API key' } },
      },
    },
    '/demo/simulate-event': {
      post: {
        tags: ['Webhook'], summary: 'Simulate an agent event (requires JWT)',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { agentId: { type: 'string' }, eventType: { type: 'string', example: 'OUTPUT_GENERATED' }, output: { type: 'string', example: 'Your booking is confirmed.' }, requiresReview: { type: 'boolean' } } } } } },
        responses: { 201: { description: 'Event simulated' } },
      },
    },
  },
};

module.exports = swaggerSpec;
