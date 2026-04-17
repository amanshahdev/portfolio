/**
 * SkillsSection.jsx — Animated skills showcase with visual bars and cards.
 *
 * WHAT: Displays technical skills grouped by category with animated progress
 *       bars and icon-labelled tech cards.
 *
 * HOW:  Uses Intersection Observer (react-intersection-observer) to trigger
 *       the bar fill animation only when visible. Framer Motion staggers
 *       the card entrance.
 *
 * WHY:  Visual skill representation is more engaging than a plain list
 *       and quickly communicates depth of expertise.
 */
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const skillCategories = [
  {
    title: "Frontend",
    color: "#34d399",
    softColor: "rgba(52,211,153,0.55)",
    skills: [
      { name: "React.js", level: 95 },
      { name: "HTML/CSS", level: 90 },
      { name: "Vercel", level: 85 },
    ],
  },
  {
    title: "Backend",
    color: "#a855f7",
    softColor: "rgba(168,85,247,0.55)",
    skills: [
      { name: "Node.js/Express.js", level: 93 },
      { name: "Python", level: 85 },
      { name: "PHP", level: 88 },
      { name: "Java/JavaFX", level: 80 },
      { name: "MongoDB", level: 90 },
    ],
  },
  {
    title: "Tools & Deployment",
    color: "#38bdf8",
    softColor: "rgba(56,189,248,0.55)",
    skills: [
      { name: "Git", level: 90 },
      { name: "MySQL", level: 88 },
      { name: "Render", level: 85 },
      { name: "Linux", level: 85 },
    ],
  },
];

const techStack = [
  "React.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Vercel",
  "Render",
  "MySQL",
  "HTML/CSS",
  "Python",
  "PHP",
  "Java",
  "JavaFX",
  "Git",
  "Linux",
];

function SkillBar({ name, level, color, softColor, index }) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm text-white/70 font-medium">{name}</span>
        <span className="text-xs font-mono text-white/30">{level}%</span>
      </div>
      <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${softColor}, ${color})`,
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{
            delay: 0.3 + index * 0.08,
            duration: 1,
            ease: "easeOut",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={ref} className="py-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="section-label">
            <span className="w-2 h-2 rounded-full bg-phosphor" />
            Technical Skills
          </span>
          <h2 className="section-heading text-white">
            Tools I work
            <br />
            <span className="text-gradient-aurora">with every day</span>
          </h2>
        </motion.div>

        {/* Skill bars grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {skillCategories.map((category, catIdx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: catIdx * 0.15, duration: 0.6 }}
              className="card relative overflow-hidden"
            >
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{
                  background: `linear-gradient(90deg, ${category.softColor}, ${category.color})`,
                }}
              />
              <div className="flex items-center gap-2 mb-6">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: category.color,
                    boxShadow: `0 0 8px ${category.color}`,
                  }}
                />
                <h3 className="font-display font-semibold text-white">
                  {category.title}
                </h3>
              </div>
              <div className="space-y-5">
                {category.skills.map((skill, idx) => (
                  <SkillBar
                    key={skill.name}
                    {...skill}
                    color={category.color}
                    softColor={category.softColor}
                    index={idx}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="text-xs font-mono text-white/25 uppercase tracking-widest mb-6 text-center">
            Full technology stack
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {techStack.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.03, duration: 0.3 }}
                whileHover={{ scale: 1.08, y: -2 }}
                className="tag cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
