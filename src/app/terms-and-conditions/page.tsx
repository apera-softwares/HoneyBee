
import React from "react";

export default function Page() {
  return (
   <div className=" px-4 sm:px-6 py-12 bg-primary/10"
   >
      <div className="max-w-5xl mx-auto px-6 py-12 text-gray-800 p-4 lg:p-6 border rounded-2xl bg-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
        Terms and Conditions
      </h1>
      <p className="text-center mb-8">Last Updated August 18, 2025</p>


      <p className="mb-4">
        Welcome to <span className="font-semibold">Honeybee Harry Referral
        Club</span>. By registering an account or using our services, you agree
        to the following Terms and Conditions. Please read them carefully.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Account Registration & Verification</h2>
      <p className="mb-4">
        To join Honeybee Harry Referral Club, users must register with a valid
        email address. After registration, an email with a verification link
        will be sent to registed email. Only verified accounts will gain access to the platform.

      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Referral Program</h2>
      <p className="mb-4">
        Members may refer others to join the club. Rewards, benefits, or wallet
        credits earned from referrals are subject to the referral policy
        outlined within the platform. Misuse of referrals, including fraudulent
        signups, will result in suspension or termination of your account.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Teams & Clubs</h2>
      <p className="mb-4">
        Each user may be assigned to a team or club structure. Statistics,
        goals, and progress tracking are provided for informational purposes.
        Honeybee Harry reserves the right to modify team structures without
        prior notice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Member Wallet</h2>
      <p className="mb-4">
        The Member Wallet reflects referral earnings and other incentives. 
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Code of Conduct</h2>
      <p className="mb-4">
        Members agree to maintain respectful communication and not misuse the
        platform for spam, harassment, or illegal activities. Violations may
        lead to suspension or termination.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Limitation of Liability</h2>
      <p className="mb-4">
        Honeybee Harry Referral Club is provided “as is.” We do not guarantee
        uninterrupted access, and we are not liable for losses or damages
        arising from system errors, downtime, or third-party services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Termination</h2>
      <p className="mb-4">
        We reserve the right to suspend or permanently terminate accounts that
        violate these Terms & Conditions or engage in fraudulent activities.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Changes to Terms</h2>
      <p className="mb-4">
        Honeybee Harry may update these Terms at any time. Continued use of the
        platform after updates constitutes acceptance of the revised Terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Governing Law</h2>
      <p className="mb-4">
        These Terms & Conditions are governed by and construed under the laws of
        your jurisdiction. Any disputes will be handled exclusively in the
        competent courts of that jurisdiction.
      </p>
    
  <h2 className="text-xl font-semibold mb-4">10. Privacy Policy</h2>
  <p className="mb-3">
    Honeybee Harry Referral Club values your privacy. We are committed to protecting your
    personal information and ensuring that it is used only for the purposes of providing
    our services. We do not sell, trade, or rent your personal details to third parties.
  </p>
  {/* <p className="mb-3">
    By using our platform, you consent to the collection and use of your data in accordance
    with this policy. For further details about data storage and processing, please refer
    to our comprehensive Privacy Policy document.
  </p> */}



  <h2 className="text-xl font-semibold mb-4">11. Contact Us</h2>
  <p className="mb-3">
    If you have any questions about these Terms & Conditions, our Privacy Policy, or your
    dealings with Honeybee Harry Referral Club, please reach out to us:
  </p>
  <ul className="list-disc ml-6">
    <li>Email: <a href="mailto:support@honeybeeharry.com" className="text-blue-600 underline">support@honeybeeharry.com</a></li>
    <li>Phone: +91-123-456-7890</li>
    <li>Address: Honeybee Harry HQ, Mumbai, India</li>
  </ul>

        <p className="mt-8 ">
        By continuing to use Honeybee Harry Referral Club, you acknowledge that
        you have read, understood, and agreed to these Terms & Conditions.
      </p>

    </div>
   </div>
  );
}
