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
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setIsAboutOpen(false);
    }
  };

  const aslFeatures = [
    {
      icon: <Building className="h-6 w-6" />,
      title: "Rich History",
      description: "ASL has its own grammar and structure, distinct from English, with deep roots in North American Deaf culture."
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Visual Communication",
      description: "Uses hand shapes, movements, facial expressions, and body language to convey meaning fully."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Cultural Significance",
      description: "Central to Deaf culture and community identity across the United States and Canada."
    }
  ];

  const mslFeatures = [
    {
      icon: <Building className="h-6 w-6" />,
      title: "Local Development",
      description: "MSL evolved to meet the communication needs of Malaysia's diverse deaf communities."
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Unique Features",
      description: "Incorporates elements from Malaysian culture, local signs, and regional expressions."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Growing Recognition",
      description: "Increasingly recognized and supported by Malaysian educators, advocates, and organisations like MyBIM."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-foreground">
      <Navigation 
        isAboutOpen={isAboutOpen}
        setIsAboutOpen={setIsAboutOpen}
        scrollToSection={scrollToSection}
        featuresRef={featuresRef}
        howItWorksRef={howItWorksRef}
        aslRef={aslRef}
        mslRef={mslRef}
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
          description="American Sign Language (ASL) is a complete, natural language with the same linguistic properties as spoken languages. It is expressed by movements of the hands and face, and is the primary language of many North Americans who are deaf and hard of hearing."
          imageSrc="/family-talking.png"
          imageAlt="Two people communicating using American Sign Language"
          features={aslFeatures}
        />

        <SignLanguageInfoSection
          sectionRef={mslRef}
          title="About Malaysian Sign Language (MSL)"
          subtitle="What is MSL?"
          description="Malaysian Sign Language (MSL), or Bahasa Isyarat Malaysia (BIM), is the primary sign language used by the deaf community in Malaysia. It is a visual language that incorporates elements of Malaysian culture and local linguistic features."
          imageSrc="/group-of-people.png"
          imageAlt="Group of people learning Malaysian Sign Language together"
          features={mslFeatures}
          reverse={true}
        />

        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
