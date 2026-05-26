import { Link } from 'react-router-dom';
import '../landing.css';

export default function Privacy() {
  return (
    <div className="lp">
      <nav className="lp-nav lp-nav-on">
        <div className="lp-nav-inner">
          <Link to="/" className="lp-brand">
            <span className="lp-brand-name">Orcha</span>
            <span className="lp-brand-tag">AI Agent Management</span>
          </Link>
          <div className="lp-nav-btns">
            <Link to="/login"    className="lp-btn lp-btn-ghost">Sign In</Link>
            <Link to="/register" className="lp-btn lp-btn-accent">Try Orcha free</Link>
          </div>
        </div>
      </nav>

      <div className="lp-legal-wrap">
        <div className="lp-legal-header">
          <Link to="/" className="lp-legal-back">← Back to home</Link>
          <h1 className="lp-legal-title">Privacy Policy</h1>
          <p className="lp-legal-meta">
            Effective date: May 25, 2026 &nbsp;·&nbsp; Last updated: May 25, 2026
          </p>
        </div>

        <div className="lp-legal-body">

          <p>
            This Privacy Policy describes how Orcha collects, uses, stores, and shares
            information when you use our AI Agent Management Platform, including our website,
            web application, and API (collectively, the <strong>"Service"</strong>).
          </p>
          <p>
            By accessing or using the Service, you acknowledge that you have read and
            understood this policy. If you are using Orcha on behalf of an organisation,
            you represent that you have authority to bind that organisation to this policy.
          </p>

          <h2>1. Information We Collect</h2>

          <h3>1.1 Account and Organisation Data</h3>
          <p>When you register for Orcha, we collect:</p>
          <ul>
            <li>Full name and work email address</li>
            <li>Password (stored as a one-way bcrypt hash — we never store your plain-text password)</li>
            <li>Organisation name and your role within it</li>
            <li>Profile information you voluntarily provide</li>
            <li>Billing contact details for paid plans</li>
          </ul>

          <h3>1.2 Agent and Event Data</h3>
          <p>
            The core function of Orcha is to receive, store, and display event payloads sent by
            your AI agents via our webhook API. This data is entirely under your control and may
            include:
          </p>
          <ul>
            <li>Event types, timestamps, and status fields</li>
            <li>Customer names, contact details, and conversation content sent by your agents</li>
            <li>Agent output text and metadata</li>
            <li>Channel identifiers (e.g. WhatsApp, email, website chat)</li>
            <li>Any custom fields your agents include in their payloads</li>
          </ul>
          <p>
            You are the data controller for this content. We process it solely on your behalf
            as a data processor under your instruction.
          </p>

          <h3>1.3 Usage and Technical Data</h3>
          <p>We automatically collect the following when you use the Service:</p>
          <ul>
            <li>IP address, browser type and version, operating system</li>
            <li>Pages visited, features used, and time spent on each</li>
            <li>API request logs including endpoint, method, response code, and latency</li>
            <li>Error logs and crash reports</li>
            <li>Referring URLs</li>
          </ul>

          <h3>1.4 Cookies and Local Storage</h3>
          <p>
            Orcha stores your JWT authentication token in browser <code>localStorage</code> to
            keep you signed in. We use session cookies for CSRF protection. We do not use
            advertising cookies, third-party tracking pixels, or behavioural analytics tools
            that share your data with third parties.
          </p>

          <h2>2. How We Use Your Information</h2>

          <h3>2.1 To Provide and Operate the Service</h3>
          <ul>
            <li>Create and authenticate your account and workspace</li>
            <li>Process and display agent events, tasks, review items, and activity logs</li>
            <li>Enforce role-based access control within your organisation</li>
            <li>Generate and validate API keys for agent authentication</li>
            <li>Process payments and manage your subscription</li>
          </ul>

          <h3>2.2 To Communicate with You</h3>
          <ul>
            <li>Send transactional emails: account verification, password reset, team invitations</li>
            <li>Notify you of important changes to the Service or this policy</li>
            <li>Respond to your support requests and enquiries</li>
            <li>Send product updates and service announcements (you may opt out at any time)</li>
          </ul>

          <h3>2.3 To Improve and Protect the Service</h3>
          <ul>
            <li>Monitor platform performance, uptime, and error rates</li>
            <li>Detect, investigate, and prevent fraud, abuse, and security incidents</li>
            <li>Conduct internal analytics to improve product features</li>
            <li>Comply with our legal obligations</li>
          </ul>

          <p>
            We do not sell, rent, or license your personal data or agent event data to any
            third party for advertising, marketing, or any other commercial purpose.
          </p>

          <h2>3. Legal Basis for Processing (GDPR)</h2>
          <p>
            If you are located in the European Economic Area (EEA), United Kingdom, or
            Switzerland, we process your personal data under the following legal bases:
          </p>
          <ul>
            <li>
              <strong>Contract performance</strong> — processing necessary to provide the
              Service you have subscribed to (Art. 6(1)(b) GDPR)
            </li>
            <li>
              <strong>Legitimate interests</strong> — security monitoring, fraud prevention,
              service improvement, and direct marketing to existing customers (Art. 6(1)(f) GDPR)
            </li>
            <li>
              <strong>Legal obligation</strong> — where required by applicable law
              (Art. 6(1)(c) GDPR)
            </li>
            <li>
              <strong>Consent</strong> — for optional marketing communications; you may
              withdraw consent at any time
            </li>
          </ul>

          <h2>4. Data Sharing and Disclosure</h2>

          <h3>4.1 Within Your Organisation</h3>
          <p>
            Team members you invite to your Orcha workspace can access data according to their
            assigned role. Admins see all workspace data; Managers can access the review queue
            and team features; Members have read access to agent data. Data is strictly scoped
            to your organisation — no cross-workspace access is possible.
          </p>

          <h3>4.2 Service Providers (Sub-processors)</h3>
          <p>
            We engage trusted third-party companies to operate the Service on our behalf. These
            sub-processors may only process your data according to our instructions and are
            bound by data processing agreements. Key sub-processors include:
          </p>
          <ul>
            <li><strong>Cloud hosting and database infrastructure</strong> — to store and serve application data</li>
            <li><strong>Transactional email provider</strong> — to deliver account and notification emails</li>
            <li><strong>Payment processor</strong> — to handle subscription billing (they never store your full card details on our servers)</li>
          </ul>
          <p>
            A current list of sub-processors is available upon request at{' '}
            <a href="mailto:privacy@orcha.io">privacy@orcha.io</a>.
          </p>

          <h3>4.3 Legal Requirements</h3>
          <p>
            We may disclose your information if required to do so by law, court order, or
            governmental authority, or if we believe disclosure is necessary to protect the
            rights, property, or safety of Orcha, our users, or the public. Where legally
            permissible, we will notify you before complying.
          </p>

          <h3>4.4 Business Transfers</h3>
          <p>
            In the event of a merger, acquisition, asset sale, or bankruptcy, your information
            may be transferred as part of that transaction. We will provide notice before your
            data is transferred and becomes subject to a different privacy policy.
          </p>

          <h2>5. Data Retention</h2>
          <p>We retain your data for the following periods:</p>
          <ul>
            <li>
              <strong>Account and profile data</strong> — retained for the duration of your
              account plus 30 days after deletion to allow for recovery
            </li>
            <li>
              <strong>Agent event data and activity logs</strong> — retained indefinitely on
              paid plans to support audit trail requirements; on free plans, retained for 90 days
            </li>
            <li>
              <strong>Billing records</strong> — retained for 7 years to comply with financial
              regulations
            </li>
            <li>
              <strong>Server and access logs</strong> — retained for 90 days for security and
              debugging purposes
            </li>
          </ul>
          <p>
            You may request early deletion of your data at any time. See Section 7 for your
            rights.
          </p>

          <h2>6. Data Security</h2>
          <p>We implement the following technical and organisational security measures:</p>
          <ul>
            <li>All data in transit is encrypted using TLS 1.2 or higher</li>
            <li>Passwords are hashed using bcrypt with a cost factor of 12</li>
            <li>Authentication uses short-lived JWT tokens with secure signing secrets</li>
            <li>Each AI agent receives a cryptographically random, unique API key scoped to that agent only</li>
            <li>Role-based access control prevents unauthorised access within workspaces</li>
            <li>Production database access is restricted to authorised systems only</li>
            <li>Security headers (Content-Security-Policy, X-Frame-Options, HSTS) are enforced on all responses</li>
          </ul>
          <p>
            No method of transmission over the internet or electronic storage is 100% secure.
            We cannot guarantee absolute security, but we maintain industry-standard practices
            and promptly address identified vulnerabilities.
          </p>
          <p>
            In the event of a data breach that affects your rights and freedoms, we will notify
            affected users and relevant supervisory authorities within 72 hours of becoming
            aware, as required by GDPR.
          </p>

          <h2>7. Your Rights</h2>
          <p>
            Depending on your location, you may have the following rights regarding your
            personal data:
          </p>
          <ul>
            <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
            <li><strong>Rectification</strong> — correct inaccurate or incomplete personal data</li>
            <li><strong>Erasure ("right to be forgotten")</strong> — request deletion of your personal data where no overriding legal basis exists</li>
            <li><strong>Restriction</strong> — request that we limit processing of your data in certain circumstances</li>
            <li><strong>Portability</strong> — receive your data in a structured, machine-readable format</li>
            <li><strong>Objection</strong> — object to processing based on legitimate interests or for direct marketing</li>
            <li><strong>Withdraw consent</strong> — where processing is based on consent, withdraw it at any time without affecting prior processing</li>
          </ul>
          <p>
            California residents may have additional rights under the CCPA, including the right
            to know, delete, and opt out of the sale of personal information. Orcha does not
            sell personal information.
          </p>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:privacy@orcha.io">privacy@orcha.io</a>. We will respond within
            30 days. We may need to verify your identity before fulfilling your request.
          </p>

          <h2>8. International Data Transfers</h2>
          <p>
            Orcha is operated from servers in the European Union. If you are accessing the
            Service from outside the EU, your data may be transferred to and processed in a
            country with different data protection laws. We ensure appropriate safeguards are
            in place, including Standard Contractual Clauses (SCCs) approved by the European
            Commission where required.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            Orcha is a business-to-business platform intended for professional use by
            individuals aged 18 and over. We do not knowingly collect personal data from
            anyone under the age of 16. If you believe a minor has provided us with personal
            data, please contact us immediately and we will delete it.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our
            practices, technology, or legal requirements. When we make material changes, we
            will notify you by email (to the address on your account) and by displaying a
            prominent notice in the application at least 14 days before the changes take effect.
            The updated policy will show a revised "Last updated" date at the top. Your
            continued use of the Service after changes take effect constitutes acceptance.
          </p>

          <h2>11. Contact and Complaints</h2>
          <p>For privacy-related questions, requests, or concerns:</p>
          <ul>
            <li>Email: <a href="mailto:privacy@orcha.io">privacy@orcha.io</a></li>
            <li>Support: <a href="mailto:support@orcha.io">support@orcha.io</a></li>
          </ul>
          <p>
            If you are located in the EEA or UK and believe we have not adequately addressed
            your concern, you have the right to lodge a complaint with your local data
            protection authority (e.g., the ICO in the UK, or your national DPA in the EU).
          </p>

        </div>
      </div>

      <footer className="lp-footer">
        <div className="lp-wrap">
          <div className="lp-footer-btm" style={{ paddingTop: 0, borderTop: 'none' }}>
            <div className="lp-footer-copy">© {new Date().getFullYear()} Orcha. All rights reserved.</div>
            <div className="lp-footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
