import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "SignBridge Privacy Policy - Learn how we collect, use, and protect your personal data in compliance with Malaysian law.",
};

export default function PrivacyPolicyPage() {
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
            <Shield className="h-8 w-8 text-signlang-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-signlang-dark">Privacy Policy</h1>
          </div>
          
          <p className="text-gray-500 mb-8">
            Last updated: {new Date().toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div className="prose prose-lg max-w-none text-gray-700">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">1. Introduction</h2>
              <p>
                SignBridge (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, store, and safeguard your information when you use our 
                platform at <Link href="/" className="text-signlang-primary hover:underline">SignBridge</Link>.
              </p>
              <p>
                This policy is governed by the laws of Malaysia, including the Personal Data Protection Act 2010 
                (&ldquo;PDPA&rdquo;). By using SignBridge, you consent to the practices described in this policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">2. Information We Collect</h2>
              <p>We collect the following types of information to provide and improve our services:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Account Information:</strong> Name, email address, password, role (deaf/non-deaf/admin), 
                  profile picture, and preferred language.
                </li>
                <li>
                  <strong>Learning Data:</strong> Tutorial progress, quiz scores, proficiency test results, 
                  learning path history, and daily challenge activity.
                </li>
                <li>
                  <strong>Gesture Recognition Data:</strong> Images or video frames uploaded or captured via your 
                  camera for the purpose of sign language recognition. These are processed in real-time and are not 
                  used to build advertising profiles.
                </li>
                <li>
                  <strong>Contributions:</strong> Gesture images, 3D avatar recordings, word submissions, descriptions, 
                  and related metadata you submit to the community dictionary.
                </li>
                <li>
                  <strong>Community Content:</strong> Forum posts, comments, chat messages, and file attachments you 
                  share with other users.
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type, device information, and cookies used for 
                  authentication, security, and platform analytics.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Provide, maintain, and secure your account and the platform.</li>
                <li>Deliver personalized learning paths, tutorials, quizzes, and progress tracking.</li>
                <li>Process gesture recognition requests and generate 3D avatar demonstrations.</li>
                <li>Review, approve, and publish community contributions to the gesture dictionary.</li>
                <li>Enable forum discussions, chat, and other community features.</li>
                <li>Send important service notifications, such as password resets and contribution status updates.</li>
                <li>Improve platform performance, fix issues, and understand how users interact with SignBridge.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">4. Data Sharing and Third Parties</h2>
              <p>
                We do not sell your personal data. We may share data only with trusted service providers necessary 
                to operate the platform, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Supabase:</strong> Our database, authentication, file storage, and real-time service provider.
                </li>
                <li>
                  <strong>YouTube:</strong> We may fetch publicly available metadata when tutorial videos are linked 
                  from YouTube. We do not share your personal data with YouTube.
                </li>
                <li>
                  <strong>Email services:</strong> Used to send account verification, password reset, and notification emails.
                </li>
              </ul>
              <p className="mt-3">
                We may disclose information if required by Malaysian law, court order, or to protect the rights, 
                property, or safety of SignBridge, our users, or the public.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">5. Cookies and Similar Technologies</h2>
              <p>
                SignBridge uses cookies and similar technologies to keep you signed in, remember your preferences, 
                and analyze platform usage. You can manage cookie settings through your browser, but disabling cookies 
                may affect your ability to use certain features.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">6. Data Security</h2>
              <p>
                We implement reasonable technical and organizational measures to protect your data, including encryption 
                in transit, access controls, and Row Level Security (RLS) policies in our database. However, no online 
                platform can guarantee absolute security.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">7. Data Retention</h2>
              <p>
                We retain your personal data for as long as your account is active or as needed to provide services, 
                comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion 
                of your account and associated data by contacting us.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">8. Your Rights Under Malaysian Law</h2>
              <p>Under the PDPA, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Request access to your personal data.</li>
                <li>Request correction or updating of inaccurate or incomplete data.</li>
                <li>Request deletion of your personal data, subject to legal or operational retention requirements.</li>
                <li>Withdraw consent for optional data processing activities.</li>
                <li>Limit the processing of your personal data in certain circumstances.</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us using the details below. We will respond within the 
                timeframe required by applicable Malaysian law.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">9. Children&apos;s Privacy</h2>
              <p>
                SignBridge is intended for users aged 13 and older. We do not knowingly collect personal data from 
                children under 13 without verifiable parental consent. If you believe we have collected data from a 
                child under 13, please contact us so we can delete it.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an 
                updated effective date. Continued use of SignBridge after changes constitutes acceptance of the revised policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-signlang-dark mb-4">11. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, 
                please contact us:
              </p>
              <div className="mt-4 p-4 bg-signlang-accent/50 rounded-xl border border-signlang-primary/10">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-signlang-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-signlang-dark">SignBridge Privacy Team</p>
                    <p className="text-gray-600">Email: privacy@signbridge.my</p>
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
