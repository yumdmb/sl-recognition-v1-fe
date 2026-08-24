'use client'

import { MessageCircle, Building, Award } from "lucide-react";
import { useRef, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navigation from "@/components/landing/Navigation";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import SignLanguageInfoSection from "@/components/landing/SignLanguageInfoSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const featuresRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const howItWorksRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const faqRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const aslRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const mslRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Close about dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-about-dropdown]')) {
        setIsAboutOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setIsAboutOpen(false);
    }
  };

  const aslFeatures = [
    {
      icon: <Building />,
      title: "Rich history",
      description: "ASL has its own grammar and structure, distinct from spoken English."
    },
    {
      icon: <MessageCircle />,
      title: "Visual communication",
      description: "Built from hand shapes, movement, facial expressions and body language."
    },
    {
      icon: <Award />,
      title: "Cultural significance",
      description: "Central to Deaf culture and community across North America."
    }
  ];

  const mslFeatures = [
    {
      icon: <Building />,
      title: "Locally grown",
      description: "Evolved to serve Malaysia's diverse Deaf and hearing communities."
    },
    {
      icon: <MessageCircle />,
      title: "Unique features",
      description: "Incorporates elements of Malaysian culture and languages, including manual bahasa Malaysia."
    },
    {
      icon: <Award />,
      title: "Growing recognition",
      description: "Increasingly recognised and supported across Malaysian society."
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navigation
        isAboutOpen={isAboutOpen}
        setIsAboutOpen={setIsAboutOpen}
        scrollToSection={scrollToSection}
        featuresRef={featuresRef}
        howItWorksRef={howItWorksRef}
        aslRef={aslRef}
        mslRef={mslRef}
        faqRef={faqRef}
      />

      <main className="flex-grow">
        <HeroSection scrollToFeatures={scrollToFeatures} isAuthenticated={isAuthenticated} />

        <FeaturesSection featuresRef={featuresRef} />

        <HowItWorksSection howItWorksRef={howItWorksRef} />

        <TestimonialsSection />

        <SignLanguageInfoSection
          sectionRef={aslRef}
          title="About American Sign Language (ASL)"
          subtitle="What is ASL?"
          description="American Sign Language is a complete, natural language with the same linguistic properties as spoken languages. It is expressed through movements of the hands and face, and is the primary language of many deaf and hard-of-hearing North Americans."
          imageSrc="/family-talking.png"
          imageAlt="A family signing together"
          features={aslFeatures}
        />

        <SignLanguageInfoSection
          sectionRef={mslRef}
          title="About Malaysian Sign Language (BIM)"
          subtitle="What is BIM?"
          description="Bahasa Isyarat Malaysia (BIM) is the primary sign language of the Malaysian Deaf community. A fully-fledged visual language, it weaves together local culture and linguistic features — and it's the heart of what SignBridge was built to teach."
          imageSrc="/group-of-people.png"
          imageAlt="A group of people learning sign language"
          features={mslFeatures}
          reverse={true}
        />

        <FAQSection sectionRef={faqRef} />
      </main>

      <Footer />
    </div>
  );
}
