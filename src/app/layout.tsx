import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { LearningProvider } from "@/context/LearningContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "SignBridge - Learn ASL & MSL with AI-Powered Recognition",
    template: "%s | SignBridge"
  },
  description: "Master American Sign Language (ASL) and Malaysian Sign Language (MSL) through AI-powered gesture recognition, interactive tutorials, and community-driven learning. Developed in collaboration with MyBIM.",
  keywords: ["sign language", "ASL", "MSL", "gesture recognition", "AI learning", "deaf education", "MyBIM", "sign language learning", "accessibility"],
  authors: [{ name: "SignBridge Team" }],
  creator: "SignBridge",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SignBridge",
    title: "SignBridge - Learn ASL & MSL with AI-Powered Recognition",
    description: "Master American Sign Language (ASL) and Malaysian Sign Language (MSL) through AI-powered gesture recognition and interactive learning.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SignBridge - Sign Language Learning Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SignBridge - Learn ASL & MSL with AI",
    description: "Master sign language with AI-powered gesture recognition and interactive tutorials.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Client-side Providers component

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LearningProvider>
        <SidebarProvider>
          <div className="min-h-screen">
            {children}
            <Toaster position="bottom-right" />
          </div>
        </SidebarProvider>
      </LearningProvider>
    </AuthProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
