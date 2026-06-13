import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "SignBridge Terms of Service - Rules and guidelines for using our sign language learning platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-signlang-dark text-white py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              SignBridge
            </Link>
            <Button variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 hover:text-white">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-8 w-8 text-signlang-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-signlang-dark">Terms of Service</h1>
          </div>
          
          <p className="text-gray-500 mb-8">
            Last updated: {new Date().toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div className="prose prose-lg max-w-none text-gray-700">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">1. Agreement to Terms</h2>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the SignBridge platform 
                (&ldquo;Platform&rdquo;), operated by the SignBridge team. By creating an account, accessing, or using 
                the Platform, you agree to be bound by these Terms and our Privacy Policy.
              </p>
              <p>
                If you do not agree to these Terms, please do not use the Platform.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">2. Description of Service</h2>
              <p>
                SignBridge is an educational platform designed to help users learn and practice sign language, 
                including American Sign Language (ASL) and Malaysian Sign Language (MSL). The Platform provides 
                features such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>AI-powered gesture recognition through image upload or camera capture.</li>
                <li>3D avatar generation from sign language gestures.</li>
                <li>Learning materials, tutorials, quizzes, and proficiency assessments.</li>
                <li>AI-generated personalized learning paths.</li>
                <li>Community dictionary with user-contributed signs.</li>
                <li>Forum discussions and direct messaging between users.</li>
                <li>Administrative tools for moderators and administrators.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">3. User Accounts and Eligibility</h2>
              <p>To use most features of the Platform, you must register an account and provide accurate information.</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>You must be at least 13 years old to create an account.</li>
                <li>You are responsible for maintaining the confidentiality of your password.</li>
                <li>You agree to notify us immediately of any unauthorized use of your account.</li>
                <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">4. Acceptable Use</h2>
              <p>When using SignBridge, you agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Use the Platform for any unlawful, harmful, fraudulent, or abusive purpose.</li>
                <li>Harass, bully, discriminate against, or impersonate other users.</li>
                <li>Upload, post, or share content that is offensive, defamatory, obscene, or infringing.</li>
                <li>Attempt to gain unauthorized access to the Platform, other users&apos; accounts, or our systems.</li>
                <li>Use automated tools or scrapers to extract data without permission.</li>
                <li>Upload malware, viruses, or other harmful code.</li>
                <li>Misrepresent your identity, credentials, or sign language expertise.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">5. User Contributions and Content</h2>
              <p>
                SignBridge allows users to submit content, including gesture images, 3D avatar recordings, word 
                submissions, forum posts, comments, and chat messages (&ldquo;User Content&rdquo;).
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>You retain ownership of your original User Content.</li>
                <li>
                  By submitting User Content, you grant SignBridge a non-exclusive, royalty-free, worldwide license 
                  to use, display, reproduce, modify, and distribute your content solely for the purpose of operating 
                  and improving the Platform.
                </li>
                <li>
                  You represent that you have the right to submit the content and that it does not violate any 
                  third-party rights or applicable laws.
                </li>
                <li>
                  All community contributions to the gesture dictionary or avatar library are subject to review and 
                  approval by moderators before publication.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">6. Avatar Generation</h2>
              <p>
                The 3D avatar feature allows you to generate visual representations of sign language gestures. 
                You agree to use this feature responsibly and only submit recordings or images that you have the 
                right to share. Generated avatars may be reviewed by moderators before being made available to the 
                community.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">7. Moderation and Termination</h2>
              <p>
                SignBridge reserves the right, but not the obligation, to monitor, review, edit, or remove User 
                Content that violates these Terms or is otherwise objectionable. We may suspend or terminate your 
                account at any time for violations of these Terms, misuse of the Platform, or at our sole discretion.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">8. Intellectual Property</h2>
              <p>
                The SignBridge name, logo, software, design, and original content on the Platform are the property 
                of SignBridge and its licensors. You may not copy, modify, distribute, or create derivative works 
                from our materials without prior written permission, except as permitted by these Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">9. Disclaimer of Warranties</h2>
              <p>
                SignBridge is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. While we strive 
                for accuracy, we do not guarantee that gesture recognition results, learning content, or community 
                contributions are always correct, complete, or suitable for your specific needs.
              </p>
              <p className="mt-3">
                We disclaim all warranties, express or implied, including but not limited to warranties of 
                merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">10. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by Malaysian law, SignBridge and its team members shall not be liable 
                for any indirect, incidental, special, consequential, or punitive damages arising out of or related to 
                your use of the Platform.
              </p>
              <p className="mt-3">
                Our total liability to you for any claim arising from these Terms or your use of the Platform shall 
                not exceed the amount you have paid us for the use of the Platform in the twelve (12) months preceding 
                the claim, or Malaysian Ringgit One Hundred (RM100), whichever is higher.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">11. Governing Law and Disputes</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of Malaysia. Any dispute 
                arising out of or relating to these Terms or the Platform shall first be attempted to be resolved 
                through good-faith negotiation. If unresolved, the dispute shall be submitted to the exclusive 
                jurisdiction of the courts of Malaysia.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">12. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. Changes will be posted on this page with an updated 
                effective date. Continued use of the Platform after changes constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">13. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="mt-4 p-4 bg-signlang-accent/50 rounded-xl border border-signlang-primary/10">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-signlang-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-signlang-dark">SignBridge Support</p>
                    <p className="text-gray-600">Email: support@signbridge.my</p>
                    <p className="text-gray-600">Jurisdiction: Malaysia</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} SignBridge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
