// app/medical-disclaimer/page.tsx (or pages/medical-disclaimer.tsx for older Next.js)

import React from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import Footer from '@/components/Footer';

const MedicalDisclaimerPage: React.FC = () => {
  return (
    <>
      <NavigationMenu />
      <div className="container mx-auto px-2 sm:px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-red-700">Medical Disclaimer</h1>
          <p className="text-gray-600">Kaashyapi Ayurveda Gynaecologists and Obstetricians Foundation</p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: September 30, 2025</p>
        </div>

        {/* Important Notice */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
          <h2 className="text-xl font-bold text-red-800 mb-3">⚠️ IMPORTANT NOTICE</h2>
          <p className="text-red-800 font-semibold">
            This website provides general health and medical information for educational purposes only. The information on this website is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified healthcare provider with any questions you may have regarding a medical condition.
          </p>
        </div>

        {/* General Disclaimer */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. General Medical Disclaimer</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The content provided on the Kaashyapi Ayurveda Gynaecologists and Obstetricians Foundation website, including but not limited to text, graphics, images, videos, articles, and other materials (collectively "Content"), is for informational and educational purposes only. The Content is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Always seek the advice of your physician, gynecologist, obstetrician, or other qualified healthcare provider</strong> with any questions you may have regarding a medical condition, treatment options, medication, or health concerns. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you think you may have a medical emergency, call your doctor, go to the emergency department, or call emergency services immediately. Relying on information provided on this website is solely at your own risk.
          </p>
        </section>

        {/* No Doctor-Patient Relationship */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. No Doctor-Patient Relationship</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The use of this website and the Content does not establish a doctor-patient relationship between you and Kaashyapi Ayurveda Gynaecologists and Obstetricians Foundation, its physicians, or healthcare providers. 
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Information provided through this website, including email communications, contact forms, chat features, or any other interactive tools, should not be considered as medical consultation or advice. A doctor-patient relationship is established only through an in-person examination or formal telemedicine consultation with proper consent and documentation.
          </p>
          <p className="text-gray-700 leading-relaxed">
            For personalized medical advice, diagnosis, or treatment, you must schedule an appointment and meet with our healthcare professionals in person or through our official telemedicine platform.
          </p>
        </section>

        {/* Content Accuracy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Accuracy and Currency of Information</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            While we strive to provide accurate, current, and reliable medical information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the Content on this website.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Medical information and healthcare practices are constantly evolving. The information on this website may not reflect the most current research, medical developments, treatment protocols, or clinical guidelines. We make reasonable efforts to update the Content periodically, but we cannot guarantee that all information is current or error-free.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Any reliance you place on such information is strictly at your own risk. We disclaim all liability and responsibility arising from any reliance placed on such materials by you or any other visitor to the website, or by anyone who may be informed of its contents.
          </p>
        </section>

        {/* Ayurvedic Treatment Disclaimer */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Ayurvedic Treatment and Integrative Medicine Disclaimer</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Kaashyapi Foundation integrates traditional Ayurvedic medicine with modern gynecological and obstetric practices. While Ayurveda is a time-honored system of medicine recognized by the Ministry of AYUSH, Government of India, individual results may vary significantly.
          </p>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Treatment Outcomes</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Ayurvedic treatments and herbal formulations may have different effects on different individuals based on their prakriti (constitution), age, medical history, and other factors</li>
            <li>Results mentioned on this website, including testimonials or case studies, represent individual experiences and are not guarantees of similar outcomes</li>
            <li>Response to treatment varies from person to person, and we cannot guarantee specific results or timeframes</li>
            <li>Some conditions may require conventional medical treatment in addition to or instead of Ayurvedic approaches</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Herbal Medicines and Supplements</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Ayurvedic herbs and formulations should only be taken under the guidance of qualified Ayurvedic practitioners</li>
            <li>Inform your healthcare provider about all medications, supplements, and herbs you are taking to avoid potential interactions</li>
            <li>Pregnant women, nursing mothers, children, and individuals with chronic conditions should exercise special caution and consult healthcare professionals before using any herbal preparations</li>
            <li>Some Ayurvedic medicines may contain heavy metals or other substances that require careful monitoring and quality control</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Dietary and Lifestyle Recommendations</h3>
          <p className="text-gray-700 leading-relaxed">
            Dietary advice, yoga practices, lifestyle modifications, and other Ayurvedic recommendations provided are general in nature. Individual dietary needs and restrictions may differ. Always consult with qualified healthcare professionals before making significant changes to your diet, exercise routine, or lifestyle, especially if you have existing health conditions or are pregnant.
          </p>
        </section>

        {/* Women's Health Specific Disclaimer */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Women's Health and Reproductive Medicine Disclaimer</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Pregnancy and Prenatal Care</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Information about pregnancy, prenatal care, childbirth, and postpartum recovery is provided for educational purposes. Every pregnancy is unique and may involve different risks, complications, and considerations.
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Always attend regular prenatal checkups with qualified obstetricians</li>
            <li>Seek immediate medical attention for any pregnancy complications, unusual symptoms, or concerns</li>
            <li>Do not stop or modify any prescribed medications without consulting your doctor</li>
            <li>Emergency symptoms (severe bleeding, severe abdominal pain, severe headaches, vision changes, decreased fetal movement) require immediate medical attention</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Fertility and Reproductive Health</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Information about fertility treatments, assisted reproductive technologies, hormonal therapies, and reproductive health conditions is general in nature. Fertility treatments are complex and highly individualized.
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Success rates for fertility treatments vary based on multiple factors including age, diagnosis, and individual health status</li>
            <li>Fertility treatments carry potential risks and side effects that should be discussed with reproductive specialists</li>
            <li>Statistics and success rates mentioned are general estimates and may not reflect your individual chances</li>
            <li>Comprehensive evaluation and personalized treatment plans are essential for fertility care</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Gynecological Conditions</h3>
          <p className="text-gray-700 leading-relaxed">
            Information about PCOS, endometriosis, fibroids, menstrual disorders, menopause, and other gynecological conditions is for educational purposes. These conditions require proper diagnosis and individualized treatment plans. Do not self-diagnose or self-treat based on information found on this website.
          </p>
        </section>

        {/* External Links */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Third-Party Content and External Links</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This website may contain links to external websites, resources, research papers, or third-party content for your convenience and information. We do not control, endorse, or assume responsibility for the content, privacy policies, or practices of any third-party websites or services.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            The inclusion of any links does not necessarily imply a recommendation or endorsement of the views, products, or services expressed or offered by those websites. We are not responsible for the accuracy, legality, or content of external sites or subsequent links.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We encourage you to review the terms of service and privacy policies of any third-party websites you visit.
          </p>
        </section>

        {/* Testimonials and Case Studies */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Testimonials and Patient Experiences</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Testimonials, reviews, case studies, success stories, and patient experiences presented on this website are authentic but represent individual experiences and outcomes. These should not be considered as guarantees, warranties, or predictions of outcomes for other patients.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Individual results vary significantly based on numerous factors including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Age, overall health status, and medical history</li>
            <li>Specific diagnosis and severity of condition</li>
            <li>Adherence to treatment protocols and lifestyle recommendations</li>
            <li>Individual biological responses to treatment</li>
            <li>Timing of intervention and duration of condition</li>
            <li>Presence of other health conditions or complications</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Testimonials should not be viewed as representative of all patient experiences or as guarantees of similar results.
          </p>
        </section>

        {/* Professional Consultation */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Importance of Professional Medical Consultation</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We strongly encourage all individuals to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Schedule regular health checkups and screenings appropriate for your age and risk factors</li>
            <li>Consult qualified healthcare professionals for personalized medical advice</li>
            <li>Disclose your complete medical history, current medications, and health concerns to your healthcare providers</li>
            <li>Follow prescribed treatment plans and attend follow-up appointments</li>
            <li>Seek second opinions when facing major medical decisions</li>
            <li>Report any adverse reactions or unexpected symptoms to your healthcare provider immediately</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Your healthcare provider can assess your individual situation, perform necessary examinations and tests, and provide evidence-based recommendations tailored to your specific needs.
          </p>
        </section>

        {/* Emergency Situations */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Medical Emergencies</h2>
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-4">
            <p className="text-red-800 font-semibold mb-3">
              IF YOU ARE EXPERIENCING A MEDICAL EMERGENCY, DO NOT USE THIS WEBSITE. CALL EMERGENCY SERVICES (108 or your local emergency number) OR GO TO THE NEAREST EMERGENCY DEPARTMENT IMMEDIATELY.
            </p>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Medical emergencies that require immediate attention include but are not limited to:
          </p>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">General Emergencies:</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Chest pain or pressure, difficulty breathing, or signs of heart attack</li>
            <li>Severe allergic reactions (difficulty breathing, swelling, hives)</li>
            <li>Loss of consciousness or altered mental state</li>
            <li>Severe injuries, trauma, or uncontrolled bleeding</li>
            <li>Stroke symptoms (sudden numbness, confusion, trouble speaking or seeing)</li>
            <li>Severe, sudden headache or seizures</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Pregnancy-Related Emergencies:</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Heavy vaginal bleeding during pregnancy</li>
            <li>Severe abdominal or pelvic pain</li>
            <li>Severe headaches with vision changes or swelling (possible preeclampsia)</li>
            <li>Sudden decrease or absence of fetal movement after 28 weeks</li>
            <li>Gush of fluid from the vagina (possible rupture of membranes)</li>
            <li>Signs of preterm labor before 37 weeks</li>
            <li>Signs of ectopic pregnancy (severe one-sided pain, dizziness, shoulder pain)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Gynecological Emergencies:</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Severe pelvic pain with fever (possible infection)</li>
            <li>Heavy, uncontrolled vaginal bleeding</li>
            <li>Sudden severe abdominal pain</li>
            <li>Signs of ectopic pregnancy or ovarian torsion</li>
          </ul>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            To the fullest extent permitted by applicable law, Kaashyapi Ayurveda Gynaecologists and Obstetricians Foundation, its directors, officers, employees, healthcare providers, agents, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or relating to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Your access to, use of, or inability to use this website or its content</li>
            <li>Any reliance on information provided on this website</li>
            <li>Any errors, omissions, or inaccuracies in the content</li>
            <li>Any actions taken or decisions made based on information from this website</li>
            <li>Any unauthorized access to or use of our servers or any personal information stored therein</li>
            <li>Any interruption or cessation of transmission to or from the website</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            This limitation applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis, even if we have been advised of the possibility of such damage.
          </p>
        </section>

        {/* Changes and Updates */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Changes to Medical Disclaimer</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We reserve the right to modify, update, or change this Medical Disclaimer at any time without prior notice. Changes will be effective immediately upon posting on this website. Your continued use of the website after any changes constitutes acceptance of the revised disclaimer.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We encourage you to review this Medical Disclaimer periodically to stay informed about how we are providing information and the limitations thereof.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Governing Law and Jurisdiction</h2>
          <p className="text-gray-700 leading-relaxed">
            This Medical Disclaimer shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from or relating to this disclaimer shall be subject to the exclusive jurisdiction of the courts in [City/State], India.
          </p>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Questions and Concerns</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about this Medical Disclaimer or need clarification about any medical information on our website, please contact us. However, please note that we cannot provide specific medical advice through email, phone, or website communications.
          </p>
          {/* <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Contact Information:</h3>
            <div className="space-y-2 text-gray-700">
              <p>📧 <strong>Email:</strong> <a href="mailto:info@kaashyapifoundation.org" className="text-teal-600 hover:text-teal-700">info@kaashyapifoundation.org</a></p>
              <p>📞 <strong>Phone:</strong> [Insert Phone Number]</p>
              <p className="mt-4"><strong>Address:</strong><br />
              [Insert Complete Address]<br />
              [City, State, PIN Code]</p>
            </div>
          </div> */}
        </section>

        {/* Acknowledgment
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Acknowledgment and Acceptance</h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
            <p className="text-blue-900 font-semibold mb-3">
              BY USING THIS WEBSITE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THIS MEDICAL DISCLAIMER.
            </p>
            <p className="text-blue-900">
              You acknowledge that the information provided on this website is not medical advice and should not be treated as such. You agree that you are solely responsible for any decisions or actions you take based on information obtained from this website, and you will consult with appropriate healthcare professionals for medical advice, diagnosis, or treatment.
            </p>
          </div>
        </section> */}

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          {/* <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
            <p className="text-sm text-gray-800">
              <strong>Remember:</strong> This website is designed to support, not replace, the relationship between you and your healthcare provider. The most important step you can take for your health is to consult with qualified medical professionals who can provide personalized care based on your individual circumstances.
            </p>
          </div> */}
          <p className="text-center text-sm text-gray-600">
            This Medical Disclaimer is effective as of September 30, 2025, and applies to all content and services provided by Kaashyapi Ayurveda Gynaecologists and Obstetricians Foundation through this website.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MedicalDisclaimerPage;