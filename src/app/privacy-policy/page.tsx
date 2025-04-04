import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - TweeThreads Poster",
  description: "Privacy Policy for TweeThreads Poster",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="mb-4">
              When you use TweeThreads Poster, we collect and process the following information:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your Twitter authentication tokens (stored securely)</li>
              <li>Basic profile information from your Twitter account</li>
              <li>Content of posts you create through our platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>To authenticate you with Twitter</li>
              <li>To post content to Twitter on your behalf</li>
              <li>To display your profile information within the application</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>
              We take the security of your data seriously. All authentication tokens are stored securely
              using HTTP-only cookies and are never exposed to client-side JavaScript.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
} 