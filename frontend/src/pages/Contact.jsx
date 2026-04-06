/**
 * pages/Contact.jsx — Contact page with form and contact info.
 *
 * WHAT: Renders a contact form (name, email, subject, message) that
 *       submits to POST /api/contact, plus social links and availability info.
 *
 * HOW:  Controlled form with local validation. Axios submits to the API.
 *       React Hot Toast shows success/error feedback. Framer Motion
 *       animates the layout sections.
 *
 * WHY:  A polished contact page with immediate feedback encourages
 *       potential clients and collaborators to reach out.
 */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";
import {
  Mail,
  MapPin,
  Clock,
  Github,
  Linkedin,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { contactAPI } from "../utils/api";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "amanshah.dev@gmail.com",
    href: "mailto:amanshah.dev@gmail.com",
  },
  { icon: MapPin, label: "Location", value: "Kathmandu, Nepal" },
  { icon: Clock, label: "Response Time", value: "Within 24 hours" },
];

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/amanshahdev" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/amanshah-dev/" },
];

const initialForm = { name: "", email: "", subject: "", message: "" };

function AnimatedSection({ children, delay = 0 }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Please enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setLoading(true);
    try {
      await contactAPI.submit(form);
      setSent(true);
      setForm(initialForm);
      toast.success("Message sent! I'll get back to you soon. 🚀");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to send message. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection>
          <span className="section-label">
            <span className="w-2 h-2 rounded-full bg-phosphor" />
            Get In Touch
          </span>
          <h1 className="section-heading text-white mb-4">
            Let's build something
            <br />
            <span className="text-gradient-phosphor">amazing together</span>
          </h1>
          <p className="text-lg text-white/45 max-w-xl mb-16">
            Whether you have a project in mind, want to collaborate, or just
            want to say hi — I'd love to hear from you.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ── Contact Info ───────────────────────────────────────── */}
          <div className="space-y-6">
            <AnimatedSection delay={0.1}>
              <div className="card space-y-6">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-phosphor/10 border border-phosphor/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-phosphor" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm text-white/70 hover:text-phosphor transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm text-white/70">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="card">
                <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">
                  Socials
                </p>
                <div className="flex gap-3">
                  {socials.map(({ icon: Icon, label, href }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      whileHover={{ y: -2, scale: 1.1 }}
                      className="w-10 h-10 rounded-xl glass border-border-1 flex items-center justify-center text-white/40 hover:text-phosphor hover:border-phosphor/30 transition-colors duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div
                className="rounded-2xl p-6"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(124,58,237,0.08) 100%)",
                  border: "1px solid rgba(0,255,136,0.15)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-phosphor animate-pulse" />
                  <span className="text-xs font-mono text-phosphor uppercase tracking-widest">
                    Available
                  </span>
                </div>
                <p className="text-sm text-white/60">
                  Currently open to new freelance projects and full-time
                  opportunities. Let's talk about what we can build together.
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* ── Contact Form ───────────────────────────────────────── */}
          <AnimatedSection delay={0.15}>
            <div className="card w-full">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 rounded-full bg-phosphor/10 border border-phosphor/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-phosphor" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-white mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-white/45 mb-6">
                    Thanks for reaching out. I'll get back to you within 24
                    hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="btn-secondary"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-white mb-1">
                      Send a message
                    </h2>
                    <p className="text-sm text-white/35">
                      All fields marked are required.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
                        Name *
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={`input-field ${errors.name ? "ring-1 ring-red-500/50 border-red-500/30" : ""}`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
                        Email *
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`input-field ${errors.email ? "ring-1 ring-red-500/50 border-red-500/30" : ""}`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
                      Subject
                    </label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className="input-field"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={12}
                      placeholder="Tell me about your project, idea, or just say hello..."
                      className={`input-field resize-none ${errors.message ? "ring-1 ring-red-500/50 border-red-500/30" : ""}`}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.message ? (
                        <p className="text-xs text-red-400">{errors.message}</p>
                      ) : (
                        <span />
                      )}
                      <span className="text-xs font-mono text-white/20">
                        {form.message.length}/2000
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
