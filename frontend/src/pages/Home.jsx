/**
 * pages/Home.jsx — Landing page combining Hero, Skills, and Featured Projects.
 *
 * WHAT: Assembles the hero, a brief about teaser, skills overview,
 *       and featured projects into the main landing page.
 *
 * WHY:  A single composable page keeps each section independently
 *       testable and reusable elsewhere.
 */
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Code2, Layers, Zap } from "lucide-react";
import HeroSection from "../components/sections/HeroSection";
import SkillsSection from "../components/sections/SkillsSection";
import FeaturedProjects from "../components/sections/FeaturedProjects";

const services = [
  {
    icon: Code2,
    title: "Full-Stack Development",
    description:
      "End-to-end web applications with React frontends and Node.js backends, designed to scale.",
    color: "var(--phosphor)",
  },
];

function ServicesSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={ref} className="py-32 border-y border-border-1 bg-surface-1">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="p-8 rounded-2xl group hover:bg-surface-2 border border-border-1
                         hover:border-white/10 transition-all duration-500"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300"
                style={{
                  background: `${service.color}15`,
                  border: `1px solid ${service.color}30`,
                }}
              >
                <service.icon
                  className="w-5 h-5"
                  style={{ color: service.color }}
                />
              </div>
              <h3 className="font-display font-semibold text-lg text-white mb-3">
                {service.title}
              </h3>
              <p className="text-sm text-white/45 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section ref={ref} className="py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(var(--phosphor-rgb),0.05) 0%, rgba(124,58,237,0.08) 50%, rgba(56,189,248,0.05) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px bg-gradient-to-r from-transparent via-phosphor/30 to-transparent" />

          <span className="section-label mx-auto">
            <span className="w-2 h-2 rounded-full bg-phosphor animate-pulse" />
            Let's work together
          </span>

          <h2 className="section-heading text-white mb-6 mt-4">
            Have a project in mind?
          </h2>

          <p className="text-lg text-white/45 max-w-xl mx-auto mb-10 leading-relaxed">
            I'm currently available for freelance projects and full-time
            opportunities. Let's build something remarkable together.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact" className="btn-primary group">
              Start a Conversation
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/about" className="btn-ghost">
              Learn more about me
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <SkillsSection />
      <FeaturedProjects />
      <CTASection />
    </>
  );
}
