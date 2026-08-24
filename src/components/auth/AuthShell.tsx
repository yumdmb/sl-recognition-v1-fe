'use client';

import Link from "next/link";
import { Hand } from "lucide-react";

interface AuthShellProps {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const highlights = [
  "Real-time AI gesture recognition",
  "Guided BIM & ASL lessons with quizzes",
  "Community sign dictionary",
];

export default function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-ink p-10 text-mint-soft lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="bg-dots absolute inset-0 opacity-30" aria-hidden />
        <div className="absolute -bottom-40 -right-40 size-[520px] rounded-full bg-primary/15 blur-3xl" aria-hidden />

        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-ink">
            <Hand className="size-4.5" strokeWidth={2.2} />
          </span>
          <span className="font-display text-lg font-bold text-white">
            Sign<span className="text-primary">Bridge</span>
          </span>
        </Link>

        <div className="relative max-w-md">
          <p className="font-display text-3xl font-extrabold leading-snug text-white xl:text-4xl">
            Every sign you learn is a conversation opened.
          </p>
          <ul className="mt-8 space-y-3.5">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-sm text-mint-soft/80">
                <span className="grid size-6 place-items-center rounded-full bg-primary/15">
                  <svg viewBox="0 0 12 12" className="size-3 text-primary" fill="none" aria-hidden>
                    <path d="M2 6.5 4.8 9.2 10 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-mint-soft/40">
          Bahasa Isyarat Malaysia · Final Year Project
        </p>
      </aside>

      {/* Form panel */}
      <main className="relative flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)] lg:hidden" aria-hidden />
        <div className="relative w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-2.5 lg:hidden">
            <span className="grid size-9 place-items-center rounded-xl bg-ink text-mint">
              <Hand className="size-4.5" strokeWidth={2.2} />
            </span>
            <span className="font-display text-lg font-bold">
              Sign<span className="text-primary">Bridge</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>

          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
