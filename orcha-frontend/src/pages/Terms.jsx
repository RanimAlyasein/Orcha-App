import { Link } from 'react-router-dom';
import '../landing.css';

export default function Terms() {
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
          <h1 className="lp-legal-title">Terms of Service</h1>
          <p className="lp-legal-meta">
            Effective date: May 25, 2026 &nbsp;·&nbsp; Last updated: May 25, 2026
          </p>
        </div>

        <div className="lp-legal-body">

          <p>
            These Terms of Service (<strong>"Terms"</strong>) govern your access to and use of
            the Orcha platform, including the web application, API, and all related services
            (collectively, the <strong>"Service"</strong>). Please read them carefully.
          </p>
          <p>
            By creating an account or accessing the Service, you agree to these Terms on behalf
            of yourself and, if applicable, the organisation you represent. If you do not agree,
            do not use the Service.
          </p>

          <h2>1. Definitions</h2>
          <ul>
            <li><strong>"Orcha"</strong> means the company operating this platform.</li>
            <li><strong>"Customer"</strong> means the individual or organisation that has registered for an account.</li>
            <li><strong>"User"</strong> means any individual who accesses the Service under a Customer's workspace.</li>
            <li><strong>"Agent"</strong> means an external AI system registered in Orcha that sends events via the API.</li>
            <li><strong>"Content"</strong> means all data, text, and information submitted to the Service by Agents or Users.</li>
            <li><strong>"Subscription"</strong> means the paid or free plan under which the Customer accesses the Service.</li>
          </ul>

          <h2>2. Eligibility and Account Registration</h2>
          <ul>
            <li>You must be at least 18 years old and have legal capacity to enter into a binding contract.</li>
            <li>If registering on behalf of an organisation, you represent that you have the authority to bind that organisation to these Terms.</li>
            <li>You must provide accurate, current, and complete information during registration and keep it updated.</li>
            <li>You are responsible for maintaining the confidentiality of your login credentials and API keys. You must not share them with anyone outside your organisation.</li>
            <li>You are responsible for all activity that occurs under your account, whether or not you authorised it. Notify us immediately at <a href="mailto:support@orcha.io">support@orcha.io</a> if you suspect unauthorised access.</li>
            <li>Accounts are not transferable. You may not sell, assign, or transfer your account to another party.</li>
          </ul>

          <h2>3. The Service</h2>

          <h3>3.1 What Orcha Provides</h3>
          <p>
            Orcha is an AI Agent Management and Monitoring Platform that allows Customers to:
            connect external AI agents via webhook API; receive, store, and display structured
            event streams from those agents; apply a human-in-the-loop review layer to agent
            outputs before they reach end customers; manage tasks, contacts, and team members;
            and maintain a complete, immutable audit trail of agent activity.
          </p>

          <h3>3.2 Service Availability</h3>
          <p>
            We aim to maintain high availability but do not guarantee uninterrupted service.
            We may perform scheduled maintenance (with advance notice where possible) or
            experience unplanned downtime. We are not liable for losses arising from service
            interruptions unless caused by our gross negligence.
          </p>

          <h3>3.3 Modifications to the Service</h3>
          <p>
            We reserve the right to modify, add, or remove features at any time. For material
            changes that reduce functionality on a paid plan, we will provide at least 30 days'
            notice. Minor changes, bug fixes, and security updates may be deployed without notice.
          </p>

          <h2>4. Subscriptions and Payment</h2>

          <h3>4.1 Plans</h3>
          <p>
            Orcha offers Free, Growth, and Enterprise plans. The features and limitations of
            each plan are described on our pricing page. We reserve the right to change pricing
            with 30 days' notice. Changes do not apply to your current billing period.
          </p>

          <h3>4.2 Billing</h3>
          <ul>
            <li>Paid subscriptions are billed monthly or annually in advance.</li>
            <li>Payments are processed by our third-party payment provider. We do not store your full card details.</li>
            <li>All fees are exclusive of applicable taxes, which are your responsibility.</li>
            <li>Failed payments will result in a grace period of 7 days, after which access may be suspended until payment is resolved.</li>
          </ul>

          <h3>4.3 Refunds</h3>
          <p>
            If you are not satisfied within the first <strong>14 days</strong> of a new paid
            subscription, contact us at <a href="mailto:support@orcha.io">support@orcha.io</a>{' '}
            and we will issue a full refund, no questions asked. After 14 days, subscriptions
            are non-refundable, but you may cancel at any time and your access will continue
            until the end of your paid billing period. Refunds are not issued for partial months
            or unused time on annual plans, except within the 14-day window.
          </p>

          <h3>4.4 Cancellation</h3>
          <p>
            You may cancel your subscription at any time from your account settings. Cancellation
            takes effect at the end of your current billing period. Your workspace data will be
            retained for 30 days post-cancellation to allow for account recovery, after which
            it will be permanently deleted.
          </p>

          <h2>5. Acceptable Use Policy</h2>

          <h3>5.1 Permitted Use</h3>
          <p>
            You may use the Service solely for lawful business purposes and in accordance with
            these Terms.
          </p>

          <h3>5.2 Prohibited Conduct</h3>
          <p>You must not use the Service to:</p>
          <ul>
            <li>Violate any applicable law, regulation, or third-party rights</li>
            <li>Transmit or store content that is unlawful, harmful, defamatory, harassing, obscene, or fraudulent</li>
            <li>Send unsolicited communications or spam via agent outputs</li>
            <li>Attempt to gain unauthorised access to any part of the Service, its infrastructure, or other users' data</li>
            <li>Conduct denial-of-service attacks, port scanning, or network probing</li>
            <li>Introduce malware, ransomware, viruses, or other malicious code</li>
            <li>Reverse-engineer, decompile, disassemble, or create derivative works from the Service</li>
            <li>Scrape or extract data from the Service using automated tools beyond normal API usage</li>
            <li>Resell, sublicense, or white-label the Service without our written permission</li>
            <li>Circumvent, disable, or interfere with security features of the Service</li>
            <li>Use the Service to process data of children under 16 without appropriate consent</li>
          </ul>
          <p>
            Violation of this policy may result in immediate suspension or termination of your
            account without refund.
          </p>

          <h2>6. API Usage and Agent Keys</h2>
          <ul>
            <li>Access to the Orcha API is granted per agent via a unique API key generated by the platform.</li>
            <li>API keys are sensitive credentials. You must store them securely, never embed them in client-side code, and rotate them immediately if compromised.</li>
            <li>We reserve the right to rate-limit API requests to ensure platform stability. Current rate limits are documented in the API reference.</li>
            <li>You are solely responsible for the behaviour and outputs of your AI agents. We are not liable for any agent output, action, or communication with end customers.</li>
            <li>We may revoke API keys and suspend API access for accounts that violate these Terms or engage in abusive API patterns.</li>
          </ul>

          <h2>7. Your Content and Data Ownership</h2>
          <ul>
            <li>You retain full ownership of all Content you submit to the Service, including agent event data, customer records, and any other data in your workspace.</li>
            <li>By submitting Content, you grant Orcha a limited, non-exclusive, royalty-free licence to store, process, and transmit your Content solely as necessary to provide the Service.</li>
            <li>We do not access, analyse, or use your Content for any purpose other than operating and improving the Service, and then only in anonymised or aggregated form.</li>
            <li>You are responsible for ensuring you have all necessary rights, consents, and legal bases to submit Content to the Service, including any personal data about your customers.</li>
          </ul>

          <h2>8. Intellectual Property</h2>
          <ul>
            <li>The Service, including its software, code, design, trademarks, logos, documentation, and all related intellectual property, is owned exclusively by Orcha.</li>
            <li>These Terms grant you a limited, non-exclusive, non-transferable, revocable licence to use the Service for your internal business purposes.</li>
            <li>You may not use our name, logo, or branding without prior written consent.</li>
            <li>Feedback, suggestions, or ideas you provide about the Service may be used by us without restriction or compensation.</li>
          </ul>

          <h2>9. Privacy and Data Protection</h2>
          <p>
            Your use of the Service is subject to our <Link to="/privacy">Privacy Policy</Link>,
            which is incorporated into these Terms by reference. To the extent you submit
            personal data about your own customers or end users ("Third-Party Personal Data"),
            you act as the data controller and Orcha acts as a data processor. We will process
            such data only on your documented instructions and in accordance with applicable
            data protection law, including GDPR where applicable.
          </p>
          <p>
            Customers on Enterprise plans may request a Data Processing Agreement (DPA) by
            contacting <a href="mailto:privacy@orcha.io">privacy@orcha.io</a>.
          </p>

          <h2>10. Confidentiality</h2>
          <p>
            Each party may disclose Confidential Information to the other in connection with
            the Service. <strong>"Confidential Information"</strong> means any non-public
            information that a reasonable person would understand to be confidential given the
            nature of the information and circumstances of disclosure. Each party agrees to:
            (i) protect the other's Confidential Information using at least the same degree of
            care it uses for its own; (ii) use it only to exercise rights under these Terms;
            and (iii) not disclose it to third parties without prior written consent. This
            obligation does not apply to information that becomes public through no fault of
            the receiving party, or is required to be disclosed by law.
          </p>

          <h2>11. Disclaimers</h2>
          <p>
            THE SERVICE IS PROVIDED <strong>"AS IS"</strong> AND <strong>"AS AVAILABLE"</strong>{' '}
            WITHOUT WARRANTY OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, ORCHA
            EXPRESSLY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
          </p>
          <p>
            ORCHA DOES NOT WARRANT THAT: (I) THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE,
            OR SECURE; (II) ANY DEFECTS WILL BE CORRECTED; (III) THE SERVICE OR THE SERVERS
            THAT MAKE IT AVAILABLE ARE FREE OF VIRUSES OR HARMFUL COMPONENTS; OR (IV) THE
            SERVICE WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS.
          </p>

          <h2>12. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ORCHA AND ITS DIRECTORS,
            EMPLOYEES, AGENTS, PARTNERS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING
            BUT NOT LIMITED TO LOSS OF PROFITS, REVENUE, DATA, BUSINESS, GOODWILL, OR
            ANTICIPATED SAVINGS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p>
            IN NO EVENT SHALL ORCHA'S AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT
            OF OR RELATING TO THESE TERMS OR THE SERVICE EXCEED THE GREATER OF: (A) THE
            TOTAL FEES PAID BY YOU TO ORCHA IN THE 12 MONTHS PRECEDING THE CLAIM; OR
            (B) USD $100.
          </p>
          <p>
            SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR LIMITATION
            OF LIABILITY FOR CERTAIN DAMAGES. IN SUCH JURISDICTIONS, OUR LIABILITY IS LIMITED
            TO THE GREATEST EXTENT PERMITTED BY LAW.
          </p>

          <h2>13. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Orcha and its officers,
            directors, employees, and agents from any claims, damages, losses, costs, and
            expenses (including reasonable legal fees) arising out of: (i) your use of the
            Service; (ii) your Content; (iii) your violation of these Terms; (iv) your
            violation of any third-party rights; or (v) the behaviour or outputs of your
            AI agents.
          </p>

          <h2>14. Suspension and Termination</h2>

          <h3>14.1 By You</h3>
          <p>
            You may terminate your account at any time by cancelling your subscription and
            requesting account deletion through account settings or by contacting support.
          </p>

          <h3>14.2 By Orcha</h3>
          <p>
            We may suspend or terminate your access with immediate effect if: (i) you breach
            these Terms and fail to remedy the breach within 5 days of written notice;
            (ii) you engage in conduct that poses a security risk or legal liability to Orcha
            or other users; (iii) we are required to do so by law; or (iv) you fail to pay
            amounts due after the grace period.
          </p>

          <h3>14.3 Effect of Termination</h3>
          <p>
            Upon termination, your right to access the Service ceases immediately. We will
            retain your data for 30 days to allow you to request an export, after which it
            will be permanently deleted. Sections 7 (Content), 8 (IP), 11 (Disclaimers),
            12 (Liability), 13 (Indemnification), and 16 (Governing Law) survive termination.
          </p>

          <h2>15. Changes to These Terms</h2>
          <p>
            We may revise these Terms from time to time. For material changes, we will provide
            at least 30 days' notice via email and an in-app notification. Your continued use
            of the Service after the effective date of the revised Terms constitutes your
            acceptance. If you do not agree to the changes, you must stop using the Service
            and cancel your subscription before the changes take effect.
          </p>

          <h2>16. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms are governed by applicable law. Any dispute arising out of or in
            connection with these Terms that cannot be resolved informally shall be submitted
            to binding arbitration before a mutually agreed arbitrator. Nothing in this clause
            prevents either party from seeking injunctive or other equitable relief from a
            court of competent jurisdiction where necessary to protect confidential information
            or intellectual property rights.
          </p>

          <h2>17. General</h2>
          <ul>
            <li><strong>Entire Agreement.</strong> These Terms, together with the Privacy Policy and any Order Form, constitute the entire agreement between you and Orcha regarding the Service.</li>
            <li><strong>Severability.</strong> If any provision of these Terms is found unenforceable, it will be modified to the minimum extent necessary to make it enforceable, and the remaining provisions will remain in full force.</li>
            <li><strong>No Waiver.</strong> Failure to enforce any right under these Terms does not constitute a waiver of that right.</li>
            <li><strong>Force Majeure.</strong> Neither party is liable for failure to perform obligations due to events beyond reasonable control, including natural disasters, power failures, or internet outages.</li>
            <li><strong>Notices.</strong> Legal notices to Orcha must be sent to <a href="mailto:legal@orcha.io">legal@orcha.io</a>. We will send notices to the email address on your account.</li>
          </ul>

          <h2>18. Contact</h2>
          <ul>
            <li>General: <a href="mailto:support@orcha.io">support@orcha.io</a></li>
            <li>Legal: <a href="mailto:legal@orcha.io">legal@orcha.io</a></li>
            <li>Privacy: <a href="mailto:privacy@orcha.io">privacy@orcha.io</a></li>
          </ul>

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
