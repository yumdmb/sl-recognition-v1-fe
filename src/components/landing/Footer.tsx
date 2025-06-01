'use client'

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SignBridge</h3>
            <p className="text-gray-400">
              Empowering communication through sign language learning and recognition.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
              <li><Link href="/features" className="text-gray-400 hover:text-white">Features</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/learn" className="text-gray-400 hover:text-white">Learn</Link></li>
              <li><Link href="/practice" className="text-gray-400 hover:text-white">Practice</Link></li>
              <li><Link href="/community" className="text-gray-400 hover:text-white">Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><Link href="/auth/login" className="text-gray-400 hover:text-white">Login</Link></li>
              <li><Link href="/auth/register" className="text-gray-400 hover:text-white">Sign Up</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white">Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SignBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
