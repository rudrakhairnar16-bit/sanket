"use client";

import { useRef } from "react";
import Link from "next/link";

export default function PolicyPage() {
  const ref = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const content = ref.current?.innerHTML || "";
    printWindow.document.write(`
      <html>
        <head>
          <title>Sanket — Policy Whitepaper</title>
          <style>
            @page { margin: 2cm; }
            body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.7; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 2rem; }
            h1 { font-size: 24pt; margin-bottom: 0.5cm; }
            h2 { font-size: 18pt; margin-top: 1cm; border-bottom: 1px solid #ccc; padding-bottom: 0.3cm; }
            h3 { font-size: 14pt; margin-top: 0.7cm; }
            p { margin-bottom: 0.3cm; text-align: justify; }
            ul { margin-bottom: 0.3cm; }
            li { margin-bottom: 0.15cm; }
            .header { text-align: center; margin-bottom: 1cm; }
            .footer { margin-top: 1.5cm; font-size: 10pt; color: #666; border-top: 1px solid #ccc; padding-top: 0.5cm; text-align: center; }
            .highlight { background: #f0f7ff; padding: 0.5cm; border-left: 4px solid #2563eb; margin: 0.5cm 0; }
            table { width: 100%; border-collapse: collapse; margin: 0.5cm 0; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 11pt; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          ${content}
          <div class="footer">
            <p>Sanket v2.0 — Policy Whitepaper for Municipal Adoption</p>
            <p>Prepared for the Accessible India Campaign (Sugamya Bharat Abhiyan)</p>
          </div>
          <script>window.print();window.onafterprint=()=>window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/learn"
            className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex items-center gap-1 transition-all"
          >
            ← Back to ISL Quest
          </Link>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all flex items-center gap-2"
          >
            🖨️ Download / Print
          </button>
        </div>

        <div
          ref={ref}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 sm:p-12 print:shadow-none print:border-0"
        >
          <div className="text-center mb-10">
            <span className="text-5xl block mb-4">🇮🇳</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Sanket: Policy Whitepaper
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              A Digital Platform for Indian Sign Language (ISL) Training of
              Municipal Public Servants
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
              Prepared for Municipal Commissioners • Aligned with RPwD Act 2016 • July 2026
            </p>
            <div className="mt-6 inline-block bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-5 py-2 rounded-full text-sm font-medium">
              📄 Version 2.0 — For Municipal Adoption
            </div>
          </div>

          <h2>Executive Summary</h2>
          <p>
            India has approximately 18 million deaf and hard-of-hearing citizens, yet
            fewer than 5% of government frontline staff possess even basic Indian Sign
            Language (ISL) proficiency. This communication gap violates the Rights of
            Persons with Disabilities (RPwD) Act 2016, which mandates accessible
            governance.
          </p>
          <p>
            <strong>Sanket</strong> is a digital platform that enables municipal
            corporations to train their public-facing clerks in basic ISL through a
            gamified mobile-first learning experience. The platform tracks daily
            progress, provides admin oversight, and collects citizen feedback via QR
            codes — creating a measurable compliance loop between training and
            on-ground accessibility.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-5 my-6 rounded-r-2xl">
            <p className="font-medium text-blue-800 dark:text-blue-200">
              Key Impact Target: Train 100% of public-facing municipal clerks in
              basic ISL within 12 months of adoption, achieving measurable improvement
              in citizen satisfaction scores.
            </p>
          </div>

          <h2>1. The Problem</h2>
          <h3>1.1 Communication Barrier in Public Services</h3>
          <p>
            Deaf and hard-of-hearing citizens face systemic exclusion when accessing
            essential public services. A visit to a municipal office involves
            complex interactions — applying for certificates, paying taxes, filing
            grievances — that require two-way communication. Without ISL-proficient
            staff, these citizens must rely on written notes (often impractical due
            to literacy barriers) or bring their own interpreter (imposing a private
            cost on the citizen).
          </p>

          <h3>1.2 Legal Non-Compliance</h3>
          <p>
            The Rights of Persons with Disabilities Act 2016 (RPwD Act) establishes
            the following obligations for public authorities:
          </p>
          <ul>
            <li>
              <strong>Section 40:</strong> All government and public sector
              institutions shall provide reasonable accommodation to ensure persons
              with disabilities can access services on an equal basis with others.
            </li>
            <li>
              <strong>Section 42:</strong> The appropriate government shall take
              measures to promote, protect, and ensure full participation of persons
              with disabilities, including accessible communication.
            </li>
            <li>
              <strong>Section 44:</strong> Accessible India Campaign (Sugamya Bharat
              Abhiyan) shall be implemented to achieve universal accessibility across
              the built environment, transport, and <em>information &amp; communication
              ecosystem</em>.
            </li>
          </ul>
          <p>
            Despite this legal framework, most municipalities lack a systematic
            mechanism to train staff in ISL or measure accessibility compliance.
          </p>

          <h2>2. The Solution: Sanket</h2>
          <p>
            Sanket is an end-to-end digital platform that transforms ISL training
            from a one-time workshop into an ongoing, measurable, and gamified
            organizational practice.
          </p>

          <h3>2.1 Platform Architecture</h3>
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Daily Lessons</td>
                <td>12-week structured curriculum covering 500+ essential ISL signs for municipal contexts</td>
              </tr>
              <tr>
                <td>Gamification</td>
                <td>Streaks, XP, levels, and badges to drive daily engagement</td>
              </tr>
              <tr>
                <td>ISL Quest</td>
                <td>Interactive practice with gesture-based learning</td>
              </tr>
              <tr>
                <td>Admin Dashboard</td>
                <td>Real-time compliance metrics, department-wise tracking, nudges for low performers</td>
              </tr>
              <tr>
                <td>QR Feedback</td>
                <td>Citizens scan clerk QR codes to rate ISL communication quality</td>
              </tr>
              <tr>
                <td>WhatsApp Nudges</td>
                <td>Automated reminders for clerks who miss daily lessons</td>
              </tr>
              <tr>
                <td>Certificates</td>
                <td>Automated milestone certificates for streak and curriculum completion</td>
              </tr>
              <tr>
                <td>Multilingual</td>
                <td>Available in English, Hindi, and Marathi; more languages in pipeline</td>
              </tr>
            </tbody>
          </table>

          <h3>2.2 Key Innovations</h3>
          <ul>
            <li>
              <strong>Citizen Feedback Loop:</strong> Each clerk gets a unique QR
              code at their service desk. Citizens scan and rate the interaction,
              creating a direct link between training compliance and real-world
              accessibility.
            </li>
            <li>
              <strong>ISL Champion Program:</strong> Top-performing clerks are
              designated as ISL Champions, serving as peer trainers and role models
              within their departments.
            </li>
            <li>
              <strong>Offline-First PWA:</strong> The platform works on low-end
              smartphones and in areas with unreliable internet connectivity.
            </li>
            <li>
              <strong>Department-Level Leaderboards:</strong> Healthy competition
              between municipal departments drives collective improvement.
            </li>
          </ul>

          <h2>3. Implementation Roadmap</h2>
          <table>
            <thead>
              <tr>
                <th>Phase</th>
                <th>Timeline</th>
                <th>Scope</th>
                <th>Target</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Pilot</td>
                <td>Months 1-3</td>
                <td>1 municipality, 3 depts, 50-100 clerks</td>
                <td>70% daily completion rate</td>
              </tr>
              <tr>
                <td>City-Wide</td>
                <td>Months 4-6</td>
                <td>All depts, 500+ clerks, 5-10 offices</td>
                <td>50% reach 30-day streak</td>
              </tr>
              <tr>
                <td>Regional</td>
                <td>Months 7-12</td>
                <td>5+ Tier 2/3 cities</td>
                <td>5,000+ learners</td>
              </tr>
              <tr>
                <td>State</td>
                <td>Year 2</td>
                <td>State MoU, integration with SRC</td>
                <td>25,000+ certified</td>
              </tr>
              <tr>
                <td>National</td>
                <td>Years 3-5</td>
                <td>DEPwD adoption, all 36 states/UTs</td>
                <td>500,000+ trained</td>
              </tr>
            </tbody>
          </table>

          <h2>4. Budget Estimate (Per Municipality)</h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Annual Cost (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Platform License (up to 500 clerks)</td>
                <td>₹2,50,000</td>
              </tr>
              <tr>
                <td>Cloud Infrastructure</td>
                <td>₹60,000</td>
              </tr>
              <tr>
                <td>Onboarding &amp; Training (2 workshops)</td>
                <td>₹50,000</td>
              </tr>
              <tr>
                <td>QR Card Printing &amp; Distribution</td>
                <td>₹15,000</td>
              </tr>
              <tr>
                <td>WhatsApp API &amp; Communication Costs</td>
                <td>₹25,000</td>
              </tr>
              <tr>
                <td>Technical Support &amp; Maintenance</td>
                <td>₹1,00,000</td>
              </tr>
              <tr className="font-bold border-t-2">
                <td>Total (First Year)</td>
                <td>₹5,00,000</td>
              </tr>
              <tr>
                <td>Renewal (Year 2+)</td>
                <td>₹3,50,000</td>
              </tr>
            </tbody>
          </table>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            * Costs scale proportionally for larger deployments. State-level
            licenses attract 30% volume discount.
          </p>

          <h2>5. Measurement &amp; KPIs</h2>
          <ul>
            <li>
              <strong>Daily Active Learners (DAL):</strong> % of enrolled clerks
              completing daily lesson (target: &gt;70%)
            </li>
            <li>
              <strong>Streak Achievement Rate:</strong> % of clerks reaching 30-day
              streak milestone (target: &gt;50%)
            </li>
            <li>
              <strong>Curriculum Completion:</strong> % of clerks completing all 12
              weeks (target: &gt;40%)
            </li>
            <li>
              <strong>Citizen Satisfaction Score:</strong> Average QR feedback rating
              (target: &gt;4.0/5.0)
            </li>
            <li>
              <strong>QR Scan Volume:</strong> Number of citizen feedback submissions
              per quarter (target: 1 scan per clerk per week)
            </li>
            <li>
              <strong>ISL Champions:</strong> % of clerks achieving champion status
              (target: 10% of enrolled)
            </li>
          </ul>

          <h2>6. Alignment with National Policies</h2>
          <ul>
            <li>
              <strong>RPwD Act 2016:</strong> Directly fulfills Sections 40, 42,
              and 44 by creating an accessible communication ecosystem in municipal
              services.
            </li>
            <li>
              <strong>Accessible India Campaign (2015):</strong> Contributes to the
              "Information and Communication Ecosystem" pillar by embedding ISL
              into daily governance.
            </li>
            <li>
              <strong>National Education Policy 2020:</strong> Promotes ISL as a
              subject and recognizes the need for sign language proficiency in
              public services.
            </li>
            <li>
              <strong>ISLRTC Standards:</strong> All lessons follow Indian Sign
              Language Research &amp; Training Centre (ISLRTC) certified vocabulary.
            </li>
            <li>
              <strong>SDG 10 (Reduced Inequalities):</strong> Ensures equal access to
              public services for persons with disabilities.
            </li>
          </ul>

          <h2>7. Recommendation</h2>
          <p>
            Municipal corporations seeking to fulfill their RPwD Act obligations
            should adopt Sanket as a turnkey solution for ISL training and
            compliance monitoring. The platform offers:
          </p>
          <ul>
            <li>Zero infrastructure setup (cloud-based SaaS)</li>
            <li>Instant onboarding (30-minute clerk registration process)</li>
            <li>Real-time compliance dashboards for municipal commissioners</li>
            <li>Measurable ROI through citizen feedback analytics</li>
            <li>Proven scalability from pilot (50 clerks) to state level (25,000+ clerks)</li>
          </ul>
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-5 my-6 rounded-r-2xl">
            <p className="font-medium text-green-800 dark:text-green-200">
              A pilot investment of ₹5,00,000 can transform a municipality into a
              model of accessible governance, directly benefiting ~50,000 deaf and
              hard-of-hearing citizens per city.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-center">Contact</h2>
            <p className="text-center text-gray-500 dark:text-gray-400">
              For pilot partnership inquiries, please reach out to the Sanket team.
            </p>
            <div className="flex justify-center gap-8 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span>📧 sanket@accessible.gov.in</span>
              <span>🌐 sanket-platform.vercel.app</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
