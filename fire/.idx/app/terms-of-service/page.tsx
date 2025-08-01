
export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1>Terms of Service</h1>
        <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

        <h2>1. Agreement to Terms</h2>
        <p>
          By using our application, KALA, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the application.
        </p>

        <h2>2. User Accounts</h2>
        <p>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </p>
        
        <h2>3. Intellectual Property</h2>
        <p>
          The Service and its original content, features, and functionality are and will remain the exclusive property of KALA and its licensors.
        </p>

        <h2>4. Links To Other Web Sites</h2>
        <p>
          Our Service may contain links to third-party web sites or services that are not owned or controlled by KALA. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.
        </p>

        <h2>5. Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>

        <h2>6. Limitation Of Liability</h2>
        <p>
           In no event shall KALA, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>
        
        <h2>7. Changes</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.
        </p>
        
        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at: contact@kala.app
        </p>

      </div>
    </div>
  );
}
