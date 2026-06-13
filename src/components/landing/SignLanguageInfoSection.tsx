'use client'

import Image from "next/image";
import { motion } from "framer-motion";

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
    <section ref={sectionRef} className={`py-20 ${reverse ? 'bg-white' : 'bg-signlang-accent/30'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-signlang-dark text-center mb-12">
            {title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div 
            className={reverse ? 'order-2 lg:order-1' : ''}
            initial={{ opacity: 0, x: reverse ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-[350px] sm:h-[450px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div 
            className={reverse ? 'order-1 lg:order-2' : ''}
            initial={{ opacity: 0, x: reverse ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold text-signlang-dark mb-4">{subtitle}</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {description}
            </p>
            <div className="space-y-5">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="h-6 w-6 text-signlang-primary mr-4 mt-1 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-signlang-dark text-lg">{feature.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
