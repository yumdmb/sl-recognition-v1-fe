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
  reverse = false,
}: SignLanguageInfoSectionProps) {
  return (
    <section ref={sectionRef} className="relative overflow-hidden py-20 sm:py-24">
      {reverse && <div className="absolute inset-0 bg-secondary/60" aria-hidden />}
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`relative ${reverse ? "lg:order-2" : ""}`}
        >
          <div
            className={`absolute -inset-3 rounded-[2.2rem] border-2 border-dashed border-primary/25 ${
              reverse ? "rotate-2" : "-rotate-2"
            }`}
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-[1.75rem] shadow-lift">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={960}
              height={720}
              className="h-auto w-full object-cover"
            />
          </div>
          <span className="glass absolute -bottom-4 left-6 rounded-full border border-border px-4 py-2 text-xs font-semibold shadow-soft">
            {subtitle}
          </span>
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={reverse ? "lg:order-1" : ""}
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{subtitle}</p>
          <h2 className="font-display mt-3 text-balance text-3xl font-extrabold sm:text-4xl">
            {title}
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">{description}</p>

          <ul className="mt-8 space-y-5">
            {features.map((feature, i) => (
              <motion.li
                key={feature.title}
                initial={{ opacity: 0, x: reverse ? 16 : -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary [&_svg]:size-4.5">
                  {feature.icon}
                </span>
                <div>
                  <h4 className="font-semibold">{feature.title}</h4>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
