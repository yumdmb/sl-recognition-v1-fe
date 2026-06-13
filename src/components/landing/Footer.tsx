'use client'

import Link from "next/link";
import Image from "next/image";
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <Image
                src="/signbridge-logo-no-word.PNG"
                alt="SignBridge Logo"
                width={40}
                height={30}
                className="object-contain brightness-0 invert"
              />
              <span className="text-xl font-bold">SignBridge</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Empowering communication through AI-powered sign language learning, 
              gesture recognition, and community-driven resources.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/gesture-recognition/upload" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Gesture Recognition
                </Link>
              </li>
              <li>
                <Link href="/avatar/generate" className="text-gray-400 hover:text-white transition-colors duration-200">
                  3D Avatar Generation
                </Link>
              </li>
              <li>
                <Link href="/learning/materials" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Learning Materials
                </Link>
              </li>
              <li>
                <Link href="/proficiency-test/select" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Proficiency Tests
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Community</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/interaction/forum" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/interaction/chat" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Chat
                </Link>
              </li>
              <li>
                <Link href="/gesture/submit" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Contribute a Sign
                </Link>
              </li>
              <li>
                <Link href={isAuthenticated ? "/dashboard" : "/auth/register"} className="text-gray-400 hover:text-white transition-colors duration-200">
                  {isAuthenticated ? "Dashboard" : "Get Started"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} SignBridge. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm text-center md:text-right">
            Developed in collaboration with MyBIM — Malaysian Sign Language and Deaf Studies National Organisation.
          </p>
        </div>
      </div>
    </footer>
  );
}
