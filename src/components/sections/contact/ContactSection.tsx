"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MapPin, MessageSquare, NotebookPen } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import ContactForm from "./ContactForm";
import CommentsSection from "./CommentsSection";
import { site } from "@/data/site";

const modes = [
  { id: "message", label: "Message", icon: MessageSquare },
  { id: "guestbook", label: "Guestbook", icon: NotebookPen },
] as const;

type Mode = (typeof modes)[number]["id"];

const ease = [0.22, 1, 0.36, 1] as const;

const channels = [
  {
    href: site.social.linkedin,
    label: "LinkedIn",
    handle: "/in/ruimiguelmendes",
    note: "Fastest reply",
    icon: FaLinkedinIn,
    tone: "is-linkedin",
  },
  {
    href: site.social.github,
    label: "GitHub",
    handle: "@mendesrui19",
    note: "Code for every project",
    icon: FaGithub,
    tone: "is-github",
  },
];

export default function ContactSection() {
  const [mode, setMode] = useState<Mode>("message");

  return (
    <section id="contact" className="page-shell section text-[var(--ink)]">
      <div className="contact-stage grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="lg:sticky lg:top-28">
            <p className="mb-3 font-[family-name:var(--font-dm-mono)] text-[12px] tracking-[0.2em] text-[var(--accent)]">
              CONTACT
            </p>
            <h2 className="mb-4 text-[clamp(2.2rem,5vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.04em]">
              Let’s talk.
            </h2>
            <p className="mb-8 max-w-md text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Send a message here, or leave a public note in the guestbook. I usually reply on LinkedIn.
            </p>

            <div className="grid gap-3">
              {channels.map((channel, index) => (
                <motion.a
                  key={channel.label}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`channel ${channel.tone}`}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + index * 0.1, ease }}
                >
                  <span className="channel-icon">
                    <channel.icon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold">{channel.label}</span>
                    <span className="block truncate text-[12px] text-[var(--text-muted)]">
                      {channel.handle} · {channel.note}
                    </span>
                  </span>
                  <span className="channel-go">
                    <ArrowUpRight size={16} />
                  </span>
                </motion.a>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-2">
                <span className="live-dot" />
                {site.available}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} />
                {site.location}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="contact-card relative"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
        >
          <div className="mb-6 flex gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] p-1" role="tablist">
            {modes.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={mode === item.id}
                onClick={() => setMode(item.id)}
                className={`relative inline-flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm transition-colors duration-200 ${
                  mode === item.id ? "text-[var(--accent-ink)]" : "text-[var(--text-muted)] hover:text-[var(--ink)]"
                }`}
              >
                {mode === item.id && (
                  <motion.span
                    layoutId="contact-mode"
                    className="absolute inset-0 rounded-full bg-[var(--accent)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <item.icon size={15} className="relative" />
                <span className="relative font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === "message" ? -24 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "message" ? 24 : -24 }}
              transition={{ duration: 0.3, ease }}
            >
              {mode === "message" ? <ContactForm /> : <CommentsSection />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-6 text-xs text-[var(--text-muted)]">
        <span>© 2026 {site.name}</span>
        <a href="#home" className="no-underline hover:text-[var(--ink)]">
          Back to top ↑
        </a>
      </div>
    </section>
  );
}
