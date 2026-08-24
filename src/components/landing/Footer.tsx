'use client'

import Link from "next/link";
import { Hand, Github } from "lucide-react";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Gesture recognition", href: "/gesture-recognition/upload" },
      { label: "3D Avatar Generation", href: "/avatar/generate" },
      { label: "Tutorials", href: "/learning/tutorials" },
      { label: "Quizzes", href: "/learning/quizzes" },
      { label: "Materials", href: "/learning/materials" },
      { label: "Proficiency Tests", href: "/proficiency-test/select" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Browse gestures", href: "/gesture/browse" },
      { label: "Submit a gesture", href: "/gesture/submit" },
      { label: "Forum", href: "/interaction/forum" },
      { label: "Chat assistant", href: "/interaction/chat" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/auth/login" },
      { label: "Create account", href: "/auth/register" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Profile", href: "/profile" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-mint-soft">
      <div className="bg-grid absolute inset-0 opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" aria-hidden />
      <div className="absolute -top-32 left-1/2 size-[480px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_2fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-ink">
                <Hand className="size-4.5" strokeWidth={2.2} />
              </span>
              <span className="font-display text-lg font-bold text-white">
                Sign<span className="text-primary">Bridge</span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-mint-soft/60">
              Empowering communication through sign-language learning and AI gesture
              recognition — built for the Malaysian Deaf community and beyond.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-mint-soft/70">
              <Github className="size-3.5" />
              Final Year Project · Open source
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-mint-soft/50">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-mint-soft/75 transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 text-xs text-mint-soft/50 sm:flex-row">
          <p>© {new Date().getFullYear()} SignBridge · MyBIM. All rights reserved.</p>
          <p>
            Made with care for the Deaf community <span className="text-primary">·</span> Bahasa Isyarat Malaysia
          </p>
        </div>
      </div>
    </footer>
  );
}
