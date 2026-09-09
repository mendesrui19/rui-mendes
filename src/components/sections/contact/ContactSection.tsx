"use client";

import ContactForm from "./ContactForm";
import CommentsSection from "./CommentsSection";
import { site } from "@/data/site";

export default function ContactSection() {
  return (
    <section id="contact" className="page-shell section text-white">
      <div className="contact-stage">
      <div className="relative mb-14 text-center">
        <p className="contact-kicker">SAY HELLO</p>
        <h2 className="mb-4 text-3xl font-bold tracking-[-0.03em] md:text-5xl">Contact</h2>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
          Have a project in mind? Send a message and we’ll talk.
        </p>
      </div>

      <div className="relative grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-8">
        <ContactForm />
        <CommentsSection />
      </div>

      <div className="relative mt-16 text-center text-xs text-[var(--text-muted)]">
        © 2026 {site.name}
      </div>
      </div>
    </section>
  );
}
