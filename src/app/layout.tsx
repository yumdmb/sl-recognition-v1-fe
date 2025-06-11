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
  title: "Sign Language Recognition",
  description: "Learn sign language with AI",
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
