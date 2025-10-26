// app/privacy-policy/page.tsx (or pages/privacy-policy.tsx for older Next.js)

import React from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import Footer from '@/components/Footer';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <NavigationMenu />
      <div className="container mx-auto px-2 sm:px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Kaashyapi Ayurveda Gynaecologists and Obstetricians Foundation</p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: September 30, 2025</p>
        </div>

        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Kaashyapi Ayurveda Gynaecologists and Obstetricians Foundation ("we," "our," "us," or "the Foundation") is committed to protecting the privacy and confidentiality of our patients, members, and visitors. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal and health information when you visit our facilities, use our services, or interact with our website and digital platforms.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            By accessing our services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Privacy Policy. If you do not agree with our policies and practices, please do not use our services or provide us with your personal information.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Patient Health Information</h3>
          <p className="text-gray-700 mb-3">When you receive medical services from us, we collect:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Personal Identification:</strong> Full name, date of birth, age, gender, and photograph</li>
            <li><strong>Contact Information:</strong> Address, phone number, email address, and emergency contact details</li>
            <li><strong>Medical History:</strong> Past illnesses, surgeries, medications, allergies, family medical history</li>
            <li><strong>Clinical Data:</strong> Symptoms, diagnoses, test results, prescriptions, treatment plans, and progress notes</li>
            <li><strong>Reproductive Health Information:</strong> Menstrual history, pregnancy records, fertility treatments, and gynecological examinations</li>
            <li><strong>Ayurvedic Assessment:</strong> Prakriti (constitution), dosha imbalances, lifestyle, and dietary habits</li>
            <li><strong>Insurance Information:</strong> Health insurance provider, policy number, and coverage details</li>
            <li><strong>Payment Information:</strong> Billing records, payment methods, and transaction history</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Membership and Registration Information</h3>
          <p className="text-gray-700 mb-3">For members, healthcare professionals, and researchers:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Professional Details:</strong> Medical qualifications, registration numbers, specialization, and experience</li>
            <li><strong>Membership Information:</strong> Membership category, enrollment date, and payment records</li>
            <li><strong>Academic Information:</strong> Educational background, certifications, and continuing education records</li>
            <li><strong>Research Data:</strong> Publications, study participation, and research contributions</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Website and Digital Information</h3>
          <p className="text-gray-700 mb-3">When you visit our website or use our digital services:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Technical Data:</strong> IP address, browser type, device information, operating system</li>
            <li><strong>Usage Information:</strong> Pages visited, time spent, links clicked, and navigation patterns</li>
            <li><strong>Appointment Booking Data:</strong> Preferred dates, times, doctor selection, and reasons for visit</li>
            <li><strong>Communication Records:</strong> Emails, contact form submissions, chat messages, and phone inquiries</li>
            <li><strong>Cookies and Tracking:</strong> Information collected through cookies and similar technologies</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Medical Care and Treatment</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Provide comprehensive gynecological and obstetric care</li>
            <li>Deliver Ayurvedic treatments and wellness consultations</li>
            <li>Conduct medical examinations, diagnostic tests, and procedures</li>
            <li>Prescribe medications and create personalized treatment plans</li>
            <li>Monitor your health progress and coordinate follow-up care</li>
            <li>Maintain accurate medical records for continuity of care</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Healthcare Operations</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Schedule and manage appointments</li>
            <li>Process billing and insurance claims</li>
            <li>Conduct quality improvement initiatives</li>
            <li>Train medical staff and students</li>
            <li>Maintain facility operations and safety standards</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Communication</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Send appointment reminders and follow-up notifications</li>
            <li>Provide test results and health information</li>
            <li>Share educational materials about women's health and Ayurveda</li>
            <li>Respond to your inquiries and concerns</li>
            <li>Send newsletters and updates about our services (with your consent)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.4 Legal and Regulatory Compliance</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Comply with medical regulations and healthcare laws</li>
            <li>Maintain records as required by medical councils and authorities</li>
            <li>Respond to legal processes and governmental requests</li>
            <li>Report communicable diseases as mandated by public health laws</li>
            <li>Protect against fraud and ensure ethical medical practices</li>
          </ul>
        </section>

        {/* Information Sharing and Disclosure */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
          <p className="text-gray-700 mb-4">We respect your privacy and share your information only when necessary:</p>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Healthcare Providers</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Consulting specialists and referring physicians</li>
            <li>Diagnostic laboratories and imaging centers</li>
            <li>Pharmacies for prescription fulfillment</li>
            <li>Hospitals for admissions and procedures</li>
            <li>Emergency medical services when required</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Insurance and Payment Processors</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Health insurance companies for claims processing</li>
            <li>Third-party billing services</li>
            <li>Payment gateways for secure transactions</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Legal and Regulatory Authorities</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Medical councils and regulatory bodies</li>
            <li>Public health departments for disease reporting</li>
            <li>Law enforcement when required by law</li>
            <li>Courts in response to legal proceedings</li>
          </ul>

          <p className="text-gray-700 mt-4 italic">
            All third parties are bound by strict confidentiality agreements and data protection requirements.
          </p>
        </section>

        {/* Data Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security and Confidentiality</h2>
          <p className="text-gray-700 mb-4">We implement stringent security measures to protect your health information:</p>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Physical Security</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Secure facility access with controlled entry points</li>
            <li>Locked medical record storage areas</li>
            <li>Surveillance systems and security personnel</li>
            <li>Confidential disposal of paper records (shredding)</li>
            <li>Restricted access to sensitive areas</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Technical Security</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Encrypted electronic health records (EHR) systems</li>
            <li>Secure, password-protected computer networks</li>
            <li>Multi-factor authentication for staff access</li>
            <li>Regular data backups and disaster recovery systems</li>
            <li>Firewall protection and antivirus software</li>
            <li>Secure HTTPS protocols for website communications</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Administrative Security</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Staff training on patient confidentiality and compliance</li>
            <li>Confidentiality agreements with all employees and contractors</li>
            <li>Role-based access controls limiting information access</li>
            <li>Regular security audits and risk assessments</li>
            <li>Incident response procedures for data breaches</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">5.4 Medical Ethics</h3>
          <p className="text-gray-700">All our healthcare professionals adhere to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Hippocratic Oath and medical ethics guidelines</li>
            <li>Indian Medical Council (IMC) regulations</li>
            <li>Ayurvedic medical council standards</li>
            <li>Professional codes of conduct</li>
          </ul>
        </section>

        {/* Data Retention */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
          <p className="text-gray-700 mb-4">We retain your health information in accordance with:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Medical Records:</strong> Minimum 5 years after last treatment (or longer as per state laws)</li>
            <li><strong>Minors' Records:</strong> Until the patient reaches age of majority plus applicable retention period</li>
            <li><strong>Pregnancy and Childbirth Records:</strong> Minimum 25 years</li>
            <li><strong>Research Data:</strong> As specified in study protocols and regulatory requirements</li>
            <li><strong>Billing Records:</strong> 7 years for tax and accounting purposes</li>
            <li><strong>Membership Records:</strong> Duration of membership plus 3 years</li>
          </ul>
          <p className="text-gray-700 mt-4">
            After the retention period, we securely destroy records through shredding (paper) or secure digital deletion.
          </p>
        </section>

        {/* Patient Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Patient Rights</h2>
          <p className="text-gray-700 mb-4">You have the following rights regarding your health information:</p>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">7.1 Right to Access</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Request copies of your medical records</li>
            <li>Review your health information and treatment history</li>
            <li>Obtain records in electronic format when available</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">7.2 Right to Correction</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Request amendments to inaccurate or incomplete information</li>
            <li>Add supplementary statements to your medical records</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">7.3 Right to Confidentiality</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Expect that your health information will be kept confidential</li>
            <li>Request restrictions on certain disclosures (subject to legal requirements)</li>
            <li>Receive confidential communications through alternative means</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">7.4 Right to Object</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Opt-out of marketing communications</li>
            <li>Refuse participation in research studies</li>
            <li>Object to certain uses of your information (where legally permissible)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">7.5 How to Exercise Your Rights</h3>
          <p className="text-gray-700 mb-2">To exercise any of these rights:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Submit a written request to our Medical Records Department</li>
            <li>Complete the appropriate request form (available at our facility or website)</li>
            <li>Provide valid identification</li>
            <li>Allow up to 30 days for processing</li>
          </ul>
          <p className="text-gray-700 mt-4 italic">
            We may charge reasonable fees for copying and mailing records.
          </p>
        </section>

        {/* Special Considerations */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Special Considerations for Sensitive Health Information</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">8.1 Reproductive Health</h3>
          <p className="text-gray-700 mb-3">We treat all information regarding pregnancy, fertility treatments, contraception, and sexual health with heightened confidentiality and sensitivity.</p>

          <h3 className="text-xl font-semibold mb-3 mt-6">8.2 Minors</h3>
          <p className="text-gray-700 mb-3">For patients under 18 years:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Parents/guardians have access to medical records</li>
            <li>Certain sensitive services may have confidentiality protections under law</li>
            <li>We respect the evolving capacity of adolescents for healthcare decisions</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">8.3 Mental Health and Counseling</h3>
          <p className="text-gray-700">Information from psychological counseling and mental health services receives additional confidentiality protections.</p>
        </section>

        {/* Website and Digital Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Website and Digital Privacy</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">9.1 Cookies</h3>
          <p className="text-gray-700 mb-2">Our website uses cookies for:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Essential site functionality</li>
            <li>Analytics to improve user experience</li>
            <li>Appointment booking systems</li>
            <li>Security features</li>
          </ul>
          <p className="text-gray-700 mt-3">You can control cookies through your browser settings.</p>

          <h3 className="text-xl font-semibold mb-3 mt-6">9.2 Telemedicine Services</h3>
          <p className="text-gray-700 mb-2">For video consultations:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Secure, encrypted platforms</li>
            <li>Same confidentiality standards as in-person visits</li>
            <li>Recordings only with your explicit consent</li>
          </ul>
        </section>

        {/* Changes to Privacy Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 mb-3">We may update this Privacy Policy to reflect changes in healthcare regulations, new services, or legal requirements.</p>
          <p className="text-gray-700 mb-2">We will notify you of significant changes by:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Posting the updated policy on our website</li>
            <li>Displaying notices in our facility</li>
            <li>Email notifications to registered patients (for material changes)</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Continued use of our services constitutes acceptance of the revised policy.
          </p>
        </section>

        {/* Complaints */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Complaints and Concerns</h2>
          <p className="text-gray-700 mb-3">If you have concerns about our privacy practices:</p>
          <ol className="list-decimal pl-6 text-gray-700 space-y-2">
            <li><strong>Internal Resolution:</strong> Contact our Privacy Officer</li>
            <li><strong>Regulatory Complaints:</strong> File complaints with State Medical Council, National Medical Commission, or Ministry of AYUSH</li>
            <li><strong>Legal Remedies:</strong> Seek legal advice for violations of your rights</li>
          </ol>
          <p className="text-gray-700 mt-4">
            We take all complaints seriously and will investigate promptly.
          </p>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Kaashyapi Ayurveda Gynaecologists and Obstetricians Foundation</h3>
            {/* <p className="text-gray-700 mb-4"><strong>Privacy Officer / Medical Records Department:</strong></p> */}
            <div className="space-y-2 text-gray-700">
              {/* <p>📧 <strong>Email:</strong> <a href="mailto:privacy@kaashyapifoundation.org" className="text-teal-600 hover:text-teal-700">privacy@kaashyapifoundation.org</a></p>
              <p>📧 <strong>Medical Records:</strong> <a href="mailto:medicalrecords@kaashyapifoundation.org" className="text-teal-600 hover:text-teal-700">medicalrecords@kaashyapifoundation.org</a></p>
              <p>📞 <strong>Phone:</strong> [Insert Phone Number]</p>
              <p>📠 <strong>Fax:</strong> [Insert Fax Number]</p>
              <p className="mt-4"><strong>Address:</strong><br />
              [Insert Complete Address]<br />
              [City, State, PIN Code]</p> */}
              {/* <p className="mt-4"><strong>Office Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM</p> */}
              <p className="mt-4">
                Email:{' '}
                <a href="mailto:shrss02@gmail.com" className="text-teal-600 hover:text-teal-700">
                  shrss02@gmail.com
                </a>
              </p>
            </div>
            {/* <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-sm text-gray-700">
                <strong>For Medical Emergencies:</strong> Please call [Emergency Number] or visit the nearest emergency department. Do not use email for urgent medical matters.
              </p>
            </div> */}
          </div>
        </section>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>This Privacy Policy is effective as of September 30, 2025, and governs the collection, use, and protection of patient and visitor information at Kaashyapi Ayurveda Gynaecologists and Obstetricians Foundation.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;