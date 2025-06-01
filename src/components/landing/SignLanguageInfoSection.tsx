'use client'

import Image from "next/image";
import { MessageCircle, Building, Award } from "lucide-react";

interface SignLanguageInfoSectionProps {
  sectionRef: React.RefObject<HTMLDivElement>;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  features: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  reverse?: boolean;
}

export default function SignLanguageInfoSection({
  sectionRef,
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt,
  features,
  reverse = false
}: SignLanguageInfoSectionProps) {
  return (
    <section ref={sectionRef} className={`py-16 ${reverse ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={reverse ? 'order-2 md:order-1' : ''}>
            <div className={reverse ? 'order-2 md:order-1 relative h-[400px]' : 'relative h-[400px]'}>
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
          <div className={reverse ? 'order-1 md:order-2' : ''}>
            <h3 className="text-xl font-semibold mb-4">{subtitle}</h3>
            <p className="text-gray-600 mb-4">
              {description}
            </p>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="h-6 w-6 text-signlang-primary mr-3 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{feature.title}</h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
