const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = new PrismaClient();

const genKey = () => 'orcha_' + crypto.randomBytes(24).toString('hex');

// ─── Demo credentials ─────────────────────────────────────────────────────────
const SYSTEM_ADMIN_EMAIL = 'admin@orcha.demo';
const SYSTEM_ADMIN_PASS  = 'password123';

const COMPANY_ADMIN_EMAIL = 'manager@orcha.demo';
const COMPANY_ADMIN_PASS  = 'password123';

async function main() {
  console.log('🌱 Seeding Orcha V2 — Al Noor Medical Clinic...\n');

  // ── 1. System Admin ────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where:  { email: SYSTEM_ADMIN_EMAIL },
    update: { name: 'System Admin', role: 'SYSTEM_ADMIN' },
    create: {
      name: 'System Admin', email: SYSTEM_ADMIN_EMAIL,
      password: await bcrypt.hash(SYSTEM_ADMIN_PASS, 12),
      role: 'SYSTEM_ADMIN', isVerified: true,
    },
  });
  console.log(`  ✓ System Admin   : ${SYSTEM_ADMIN_EMAIL} / ${SYSTEM_ADMIN_PASS}`);

  // ── 2. Clinic Organization ─────────────────────────────────────────────────
  let org = await prisma.organization.findUnique({ where: { slug: 'alnoor-clinic' } });
  if (!org) {
    org = await prisma.organization.create({
      data: { name: 'Al Noor Medical Clinic', slug: 'alnoor-clinic', plan: 'professional' },
    });
  }

  // ── 3. Clinic Manager (Company Admin) ──────────────────────────────────────
  const companyAdmin = await prisma.user.upsert({
    where:  { email: COMPANY_ADMIN_EMAIL },
    update: { name: 'Dr. Sara Al-Rashidi' },
    create: {
      name: 'Dr. Sara Al-Rashidi', email: COMPANY_ADMIN_EMAIL,
      password: await bcrypt.hash(COMPANY_ADMIN_PASS, 12),
      isVerified: true,
    },
  });
  await prisma.membership.upsert({
    where:  { userId_organizationId: { userId: companyAdmin.id, organizationId: org.id } },
    update: { role: 'COMPANY_ADMIN' },
    create: { userId: companyAdmin.id, organizationId: org.id, role: 'COMPANY_ADMIN' },
  });
  console.log(`  ✓ Clinic Manager : ${COMPANY_ADMIN_EMAIL} / ${COMPANY_ADMIN_PASS}`);
  console.log(`  ✓ Organization   : ${org.name}\n`);

  // ── 4. AI Agents ───────────────────────────────────────────────────────────
  const agentDefs = [
    {
      id: 'agent-appt-bot',
      name: 'Appointment Assistant',
      type: 'BOOKING',
      provider: 'WHATSAPP_BOT',
      channel: 'WhatsApp',
      connectionStatus: 'CONNECTED',
      status: 'ACTIVE',
      reviewRequired: false,
      language: 'Arabic & English',
      description: 'Handles appointment booking, confirmations, reminders, and cancellations via WhatsApp.',
      apiKey: genKey(),
    },
    {
      id: 'agent-patient-support',
      name: 'Patient Support Bot',
      type: 'SUPPORT',
      provider: 'WEBSITE_CHATBOT',
      channel: 'Website Chat',
      connectionStatus: 'CONNECTED',
      status: 'ACTIVE',
      reviewRequired: false,
      language: 'English',
      description: 'Answers patient questions about services, insurance coverage, and clinic hours on the website.',
      apiKey: genKey(),
    },
    {
      id: 'agent-followup-call',
      name: 'Follow-Up Call Agent',
      type: 'CALL_CENTER',
      provider: 'VOICE_AGENT',
      channel: 'Voice',
      connectionStatus: 'CONNECTED',
      status: 'ACTIVE',
      reviewRequired: true,
      language: 'Arabic',
      description: 'Makes outbound follow-up calls to patients after procedures and lab results.',
      apiKey: genKey(),
    },
    {
      id: 'agent-rx-reminder',
      name: 'Prescription Reminder Bot',
      type: 'CUSTOM',
      provider: 'CUSTOM_API',
      channel: 'SMS',
      connectionStatus: 'CONNECTED',
      status: 'ACTIVE',
      reviewRequired: false,
      language: 'Arabic & English',
      description: 'Sends automated medication refill reminders and dosage instructions via SMS.',
      apiKey: genKey(),
    },
  ];

  const agents = [];
  for (const def of agentDefs) {
    agents.push(await prisma.agent.upsert({
      where:  { id: def.id },
      update: {},
      create: { ...def, organizationId: org.id, createdById: companyAdmin.id },
    }));
  }
  console.log(`  ✓ ${agents.length} agents seeded`);

  // ── 5. Tasks ───────────────────────────────────────────────────────────────
  const taskDefs = [
    { title: 'Confirm tomorrow\'s 34 appointments via WhatsApp',  status: 'DONE',        priority: 'HIGH',   agentId: agents[0].id },
    { title: 'Reschedule cancelled appointments — 6 patients',    status: 'IN_PROGRESS', priority: 'HIGH',   agentId: agents[0].id },
    { title: 'Send 48-hour reminders for weekend appointments',   status: 'TODO',        priority: 'MEDIUM', agentId: agents[0].id },
    { title: 'Resolve 12 insurance coverage inquiries',           status: 'DONE',        priority: 'HIGH',   agentId: agents[1].id },
    { title: 'Update post-op care FAQ on patient portal',         status: 'IN_PROGRESS', priority: 'MEDIUM', agentId: agents[1].id },
    { title: 'Answer new patient onboarding questions',           status: 'TODO',        priority: 'LOW',    agentId: agents[1].id },
    { title: 'Follow-up calls — post-procedure patients (Day 3)', status: 'DONE',        priority: 'URGENT', agentId: agents[2].id },
    { title: 'Call patients with pending lab results',            status: 'IN_PROGRESS', priority: 'URGENT', agentId: agents[2].id },
    { title: 'Send monthly prescription refill reminders',        status: 'DONE',        priority: 'HIGH',   agentId: agents[3].id },
    { title: 'Notify diabetic patients — insulin refill due',     status: 'IN_PROGRESS', priority: 'HIGH',   agentId: agents[3].id },
    { title: 'Schedule chronic care check-in messages',           status: 'TODO',        priority: 'MEDIUM', agentId: agents[3].id },
  ];
  for (const def of taskDefs) {
    await prisma.task.create({ data: { ...def, organizationId: org.id, createdById: companyAdmin.id } });
  }
  console.log(`  ✓ ${taskDefs.length} tasks seeded`);

  // ── 6. Patients (Customers) ────────────────────────────────────────────────
  const customerDefs = [
    { name: 'Layla Al-Mansouri',  email: 'layla.m@email.com',    phone: '+971-50-123-4567', company: 'Regular Patient',  status: 'ACTIVE',   notes: 'Diabetic patient — monthly check-ins. Prefers Arabic communication.' },
    { name: 'Omar Khalid',        email: 'omar.k@email.com',     phone: '+971-55-234-5678', company: 'Regular Patient',  status: 'ACTIVE',   notes: 'Post-cardiac surgery follow-up. Next appointment: echocardiogram.' },
    { name: 'Fatima Hassan',      email: 'fatima.h@email.com',   phone: '+971-52-345-6789', company: 'New Patient',      status: 'PROSPECT', notes: 'Inquired about general check-up packages. Awaiting insurance approval.' },
    { name: 'Ahmed Al-Zahra',     email: 'ahmed.z@email.com',    phone: '+971-56-456-7890', company: 'Regular Patient',  status: 'ACTIVE',   notes: 'Hypertension management. Monthly prescription refills.' },
    { name: 'Mariam Saeed',       email: 'mariam.s@email.com',   phone: '+971-50-567-8901', company: 'Regular Patient',  status: 'ACTIVE',   notes: 'Prenatal care — 28 weeks. Weekly check-up schedule.' },
    { name: 'Khalid Al-Hamdan',   email: 'khalid.h@email.com',   phone: '+971-55-678-9012', company: 'New Patient',      status: 'LEAD',     notes: 'Referred by Dr. Ahmed. Interested in specialist consultation.' },
    { name: 'Noor Al-Rashid',     email: 'noor.r@email.com',     phone: '+971-52-789-0123', company: 'Regular Patient',  status: 'ACTIVE',   notes: 'Pediatric patient (age 8). Mother coordinates all appointments.' },
    { name: 'Sara Al-Farsi',      email: 'sara.f@email.com',     phone: '+971-56-890-1234', company: 'Regular Patient',  status: 'CHURNED',  notes: 'Transferred to another clinic. Discharge summary sent.' },
  ];
  for (const def of customerDefs) {
    await prisma.customer.create({ data: { ...def, organizationId: org.id, createdById: companyAdmin.id } });
  }
  console.log(`  ✓ ${customerDefs.length} patients seeded`);

  // ── 7. Agent Events ────────────────────────────────────────────────────────
  const now = new Date();
  const mins = (n) => new Date(now.getTime() - n * 60 * 1000);

  const eventDefs = [
    // Appointment Bot — WhatsApp
    {
      agentId: agents[0].id, eventType: 'MESSAGE_RECEIVED', channel: 'WhatsApp',
      customerName: 'Layla Al-Mansouri', customerContact: '+971-50-123-4567',
      message: 'مرحبا، أريد حجز موعد مع الدكتور يوم الثلاثاء', // "Hello, I want to book an appointment with the doctor on Tuesday"
      requiresReview: false, createdAt: mins(180),
    },
    {
      agentId: agents[0].id, eventType: 'OUTPUT_GENERATED', channel: 'WhatsApp',
      customerName: 'Layla Al-Mansouri', customerContact: '+971-50-123-4567',
      output: 'أهلاً ليلى! تم حجز موعدك يوم الثلاثاء 28 مايو الساعة 10:30 صباحاً مع الدكتور محمد. سيصلك تأكيد قريباً. / Hello Layla! Your appointment is confirmed for Tuesday 28 May at 10:30 AM with Dr. Mohammed. A confirmation will follow.',
      requiresReview: false, createdAt: mins(179),
    },
    {
      agentId: agents[0].id, eventType: 'MESSAGE_SENT', channel: 'WhatsApp',
      customerName: 'Omar Khalid', customerContact: '+971-55-234-5678',
      output: 'Reminder: Your follow-up echocardiogram appointment is tomorrow, Tuesday 27 May at 9:00 AM. Please fast for 4 hours before. Reply CONFIRM or call 800-ALNOOR to reschedule.',
      requiresReview: false, createdAt: mins(120),
    },
    {
      agentId: agents[0].id, eventType: 'MESSAGE_RECEIVED', channel: 'WhatsApp',
      customerName: 'Fatima Hassan', customerContact: '+971-52-345-6789',
      message: 'Hi, I need to cancel my appointment tomorrow, something came up.',
      requiresReview: false, createdAt: mins(95),
    },
    {
      agentId: agents[0].id, eventType: 'OUTPUT_GENERATED', channel: 'WhatsApp',
      customerName: 'Fatima Hassan', customerContact: '+971-52-345-6789',
      output: 'No problem Fatima! Your appointment on 27 May has been cancelled. Would you like to reschedule? We have availability on Thursday 29 May at 11:00 AM or Friday 30 May at 2:30 PM.',
      requiresReview: false, createdAt: mins(94),
    },
    {
      agentId: agents[0].id, eventType: 'TASK_COMPLETED', channel: 'WhatsApp',
      customerName: 'All Patients', customerContact: 'bulk',
      output: 'Batch reminder sent: 34 appointment confirmations delivered. 31 confirmed, 2 rescheduled, 1 cancelled.',
      requiresReview: false, createdAt: mins(60),
    },

    // Patient Support Bot — Website Chat
    {
      agentId: agents[1].id, eventType: 'MESSAGE_RECEIVED', channel: 'Website Chat',
      customerName: 'Khalid Al-Hamdan', customerContact: 'khalid.h@email.com',
      message: 'Does the clinic accept Daman insurance for specialist consultations?',
      requiresReview: false, createdAt: mins(150),
    },
    {
      agentId: agents[1].id, eventType: 'OUTPUT_GENERATED', channel: 'Website Chat',
      customerName: 'Khalid Al-Hamdan', customerContact: 'khalid.h@email.com',
      output: 'Yes! Al Noor Medical Clinic is a Daman-approved provider. We accept Daman Classic, Enhanced, and Thiqa plans for all specialist consultations. Please bring your insurance card and Emirates ID to your appointment. Would you like to book a consultation now?',
      requiresReview: false, createdAt: mins(149),
    },
    {
      agentId: agents[1].id, eventType: 'TASK_COMPLETED', channel: 'Website Chat',
      customerName: 'Mariam Saeed', customerContact: 'mariam.s@email.com',
      output: 'Patient inquiry resolved: Prenatal vitamin recommendations and next scan schedule sent. Ticket #2047 closed.',
      requiresReview: false, createdAt: mins(80),
    },
    {
      agentId: agents[1].id, eventType: 'MESSAGE_RECEIVED', channel: 'Website Chat',
      customerName: 'Noor Al-Rashid', customerContact: '+971-52-789-0123',
      message: 'What vaccines does my 8-year-old need for school enrollment?',
      requiresReview: false, createdAt: mins(40),
    },
    {
      agentId: agents[1].id, eventType: 'OUTPUT_GENERATED', channel: 'Website Chat',
      customerName: 'Noor Al-Rashid', customerContact: '+971-52-789-0123',
      output: 'For school enrollment in the UAE, children aged 8 typically need: MMR booster, Varicella (chickenpox), and Hepatitis B confirmation. Dr. Ahmed can review Noor\'s vaccination history and administer any missing doses. Shall I book a pediatric appointment?',
      requiresReview: false, createdAt: mins(38),
    },

    // Follow-Up Call Agent — Voice
    {
      agentId: agents[2].id, eventType: 'TASK_STARTED', channel: 'Voice',
      customerName: 'Omar Khalid', customerContact: '+971-55-234-5678',
      message: 'Outbound call initiated — Day 3 post-cardiac procedure follow-up.',
      requiresReview: false, createdAt: mins(200),
    },
    {
      agentId: agents[2].id, eventType: 'OUTPUT_GENERATED', channel: 'Voice',
      customerName: 'Omar Khalid', customerContact: '+971-55-234-5678',
      output: 'Call summary — Omar Khalid (Post-cardiac Day 3): Patient reports mild fatigue, no chest pain. Wound site healing normally. Advised to continue current medications. Follow-up echocardiogram confirmed for tomorrow. Patient satisfied with recovery progress. Call duration: 4m 32s.',
      requiresReview: true, createdAt: mins(190),
    },
    {
      agentId: agents[2].id, eventType: 'TASK_COMPLETED', channel: 'Voice',
      customerName: 'Ahmed Al-Zahra', customerContact: '+971-56-456-7890',
      output: 'Follow-up call completed — Ahmed Al-Zahra: Lab results reviewed. Blood pressure controlled at 128/82. Continuing current antihypertensive dosage. Next appointment in 30 days. Call duration: 3m 15s.',
      requiresReview: false, createdAt: mins(100),
    },

    // Prescription Reminder Bot — SMS
    {
      agentId: agents[3].id, eventType: 'MESSAGE_SENT', channel: 'SMS',
      customerName: 'Layla Al-Mansouri', customerContact: '+971-50-123-4567',
      output: 'SMS sent: "Dear Layla, your Metformin 500mg prescription is due for renewal in 3 days. Visit Al Noor Clinic or call 800-ALNOOR to arrange your refill. — Al Noor Medical Clinic"',
      requiresReview: false, createdAt: mins(300),
    },
    {
      agentId: agents[3].id, eventType: 'MESSAGE_SENT', channel: 'SMS',
      customerName: 'Ahmed Al-Zahra', customerContact: '+971-56-456-7890',
      output: 'SMS sent: "Dear Ahmed, reminder to take your evening Amlodipine 5mg dose. Consistent timing improves effectiveness. Your next check-up is in 28 days. — Al Noor Medical Clinic"',
      requiresReview: false, createdAt: mins(240),
    },
    {
      agentId: agents[3].id, eventType: 'TASK_COMPLETED', channel: 'SMS',
      customerName: 'All Diabetic Patients', customerContact: 'bulk',
      output: 'Monthly insulin refill campaign complete: 18 reminders sent, 15 patients confirmed refill scheduled, 2 required callback, 1 no response — escalated to nursing team.',
      requiresReview: false, createdAt: mins(20),
    },
  ];

  for (const def of eventDefs) {
    await prisma.agentEvent.create({ data: { ...def, organizationId: org.id, status: 'RECEIVED' } });
  }
  console.log(`  ✓ ${eventDefs.length} agent events seeded`);

  // ── 8. Review Items ────────────────────────────────────────────────────────
  const reviewableEvents = await prisma.agentEvent.findMany({
    where: { organizationId: org.id, requiresReview: true },
  });
  for (const ev of reviewableEvents) {
    await prisma.reviewItem.create({
      data: {
        agentId: ev.agentId, organizationId: org.id,
        agentEventId: ev.id, status: 'PENDING', originalOutput: ev.output,
      },
    });
  }
  console.log(`  ✓ ${reviewableEvents.length} review items seeded`);

  // ── 9. Activity Logs ───────────────────────────────────────────────────────
  const logDefs = [
    { eventType: 'AGENT_CREATED',        message: 'Agent "Appointment Assistant" connected and active.',                          agentId: agents[0].id, createdAt: mins(2880) },
    { eventType: 'AGENT_CREATED',        message: 'Agent "Patient Support Bot" connected and active.',                            agentId: agents[1].id, createdAt: mins(2870) },
    { eventType: 'AGENT_CREATED',        message: 'Agent "Follow-Up Call Agent" connected and active.',                           agentId: agents[2].id, createdAt: mins(2860) },
    { eventType: 'AGENT_CREATED',        message: 'Agent "Prescription Reminder Bot" connected and active.',                      agentId: agents[3].id, createdAt: mins(2850) },
    { eventType: 'AGENT_EVENT_RECEIVED', message: 'Appointment Assistant: Layla Al-Mansouri booked appointment via WhatsApp.',    agentId: agents[0].id, createdAt: mins(180) },
    { eventType: 'AGENT_EVENT_RECEIVED', message: 'Appointment Assistant: Batch — 34 appointment reminders sent, 31 confirmed.',  agentId: agents[0].id, createdAt: mins(60)  },
    { eventType: 'AGENT_EVENT_RECEIVED', message: 'Patient Support Bot: Insurance inquiry resolved for Khalid Al-Hamdan.',        agentId: agents[1].id, createdAt: mins(149) },
    { eventType: 'AGENT_EVENT_RECEIVED', message: 'Patient Support Bot: Prenatal care inquiry closed — Ticket #2047.',            agentId: agents[1].id, createdAt: mins(80)  },
    { eventType: 'AGENT_EVENT_RECEIVED', message: 'Follow-Up Call Agent: Post-cardiac follow-up call completed — Omar Khalid.',   agentId: agents[2].id, createdAt: mins(190) },
    { eventType: 'AGENT_EVENT_RECEIVED', message: 'Prescription Reminder Bot: Monthly insulin refill campaign — 18 SMS sent.',   agentId: agents[3].id, createdAt: mins(20)  },
    { eventType: 'TASK_STATUS_CHANGED',  message: 'Task "Follow-up calls — post-procedure patients (Day 3)" marked DONE.',        agentId: agents[2].id, createdAt: mins(185) },
    { eventType: 'TASK_STATUS_CHANGED',  message: 'Task "Confirm tomorrow\'s 34 appointments via WhatsApp" marked DONE.',         agentId: agents[0].id, createdAt: mins(55)  },
    { eventType: 'TASK_STATUS_CHANGED',  message: 'Task "Send monthly prescription refill reminders" marked DONE.',               agentId: agents[3].id, createdAt: mins(15)  },
  ];
  for (const def of logDefs) {
    await prisma.activityLog.create({ data: { ...def, organizationId: org.id } });
  }
  console.log(`  ✓ ${logDefs.length} activity logs seeded`);

  console.log('\n✅ Seed complete.\n');
  console.log('  Demo credentials:');
  console.log(`    System Admin    : ${SYSTEM_ADMIN_EMAIL} / ${SYSTEM_ADMIN_PASS}  → /admin`);
  console.log(`    Clinic Manager  : ${COMPANY_ADMIN_EMAIL} / ${COMPANY_ADMIN_PASS}  → /dashboard\n`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
