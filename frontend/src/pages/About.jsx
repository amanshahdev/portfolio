/**
 * pages/About.jsx — Full about page with bio, experience timeline, and values.
 *
 * WHAT: Presents a detailed professional biography, work history timeline,
 *       personal values, and a downloadable resume CTA.
 *
 * HOW:  Scroll-triggered animations via react-intersection-observer.
 *       Timeline uses a vertical line with animated dot connectors.
 *
 * WHY:  A compelling About page builds trust and personality beyond a
 *       simple skills list.
 */
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Download,
  MapPin,
  Mail,
  Calendar,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";

const timeline = [
  {
    type: "work",
    icon: Briefcase,
    title: "Senior Full-Stack Engineer",
    org: "TechForward Inc.",
    period: "2022 – Present",
    description:
      "Leading a team of 4 engineers building a SaaS analytics platform serving 50,000+ users. Architected microservices migration from monolith reducing deployment time by 70%.",
    color: "#00ff88",
  },
  {
    type: "work",
    icon: Briefcase,
    title: "Full-Stack Developer",
    org: "Nexus Digital Agency",
    period: "2020 – 2022",
    description:
      "Delivered 15+ client projects across fintech, healthcare, and e-commerce verticals. Built real-time collaboration features using WebSockets serving 10,000+ concurrent users.",
    color: "#a855f7",
  },
  {
    type: "education",
    icon: GraduationCap,
    title: "B.Sc. Computer Science",
    org: "State University",
    period: "2016 – 2020",
    description:
      "Graduated with First Class Honours. Specialized in distributed systems and human-computer interaction. Thesis on WebAssembly performance optimization.",
    color: "#38bdf8",
  },
  {
    type: "award",
    icon: Award,
    title: "AWS Certified Developer",
    org: "Amazon Web Services",
    period: "2021",
    description:
      "Associate-level certification demonstrating proficiency in deploying, managing, and debugging cloud-based applications on AWS.",
    color: "#f59e0b",
  },
];

const values = [
  {
    emoji: "🎯",
    title: "Quality-First",
    desc: "I believe in doing things right the first time. Clean code, thoughtful architecture, and thorough testing.",
  },
  {
    emoji: "🚀",
    title: "Ship Often",
    desc: "Iterate quickly, get feedback early, and continuously improve. Perfect is the enemy of shipped.",
  },
  {
    emoji: "🤝",
    title: "Collaboration",
    desc: "The best products come from great teams. I thrive in collaborative environments with open communication.",
  },
  {
    emoji: "📚",
    title: "Always Learning",
    desc: "The tech landscape evolves fast. I dedicate time every week to learning new tools and deepening expertise.",
  },
];

function AnimatedSection({ children, delay = 0 }) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* ── Hero Bio ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32 items-center">
          <AnimatedSection>
            <span className="section-label">
              <span className="w-2 h-2 rounded-full bg-phosphor" />
              About Me
            </span>
            <h1 className="section-heading text-white mb-6">
              Building with
              <br />
              <span className="text-gradient-aurora">purpose & craft</span>
            </h1>
            <div className="space-y-4 text-white/55 leading-relaxed">
              <p>
                I'm Aman Shah, a full-stack software developer passionate about
                turning complex ideas into elegant, performant digital products.
                My journey started with a curiosity about how websites worked
                and evolved into a deep passion for the entire software stack.
              </p>
              <p>
                I specialise in the JavaScript ecosystem — React on the
                frontend, Node.js on the backend — but I'm comfortable reaching
                for Python, PHP, Java, or whatever tool best fits the problem. I
                care deeply about developer experience, application performance,
                and writing code that future developers will enjoy maintaining.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Download className="w-4 h-4" />
                Download CV
              </a>
              <Link to="/contact" className="btn-secondary">
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>

          {/* Profile card */}
          <AnimatedSection delay={0.2}>
            <div className="relative">
              {/* Decorative box */}
              <div className="absolute -inset-4 rounded-3xl border border-phosphor/10 opacity-50" />
              <div className="glass rounded-3xl p-8 space-y-6">
                {/* Avatar placeholder */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-phosphor/20 to-aurora/20 border border-phosphor/20 flex items-center justify-center">
                  <span className="text-4xl">👨‍💻</span>
                </div>

                <div>
                  <h2 className="font-display text-2xl font-semibold text-white mb-1">
                    Aman Shah
                  </h2>
                  <p className="text-sm text-phosphor font-mono">
                    Full-Stack Developer
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  {[
                    { icon: MapPin, text: "Kathmandu, Nepal" },
                    { icon: Mail, text: "amanshah.dev@gmail.com" },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-3 text-white/50"
                    >
                      <Icon className="w-4 h-4 text-phosphor/50 flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border-1">
                  <p className="text-xs font-mono text-white/25 uppercase tracking-widest mb-3">
                    Core Stack
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["React", "Node.js", "MongoDB", "Vercel", "Render"].map(
                      (t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* ── Values ───────────────────────────────────────────────── */}
        <AnimatedSection>
          <div className="mb-12">
            <span className="section-label">
              <span className="w-2 h-2 rounded-full bg-ice" />
              How I Work
            </span>
            <h2 className="section-heading text-white">Values & Approach</h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((value, i) => (
            <AnimatedSection key={value.title} delay={i * 0.1}>
              <div className="card hover:border-white/12 flex gap-4">
                <div className="text-3xl flex-shrink-0">{value.emoji}</div>
                <div>
                  <h3 className="font-display font-semibold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
