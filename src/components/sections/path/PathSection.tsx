"use client";

import { motion } from "framer-motion";
import { education, experience } from "@/data/site";

const ease = [0.16, 1, 0.3, 1] as const;

const steps = [
  ...education.map((e) => ({ id: e.id, kind: "Study", title: e.title, org: e.school, period: e.period, start: e.start, note: e.detail })),
  ...experience.map((e) => ({ id: e.id, kind: "Work", title: e.title, org: e.org, period: e.period, start: e.start, note: e.place })),
].sort((a, b) => b.start.localeCompare(a.start));

export default function PathSection() {
  return (
    <section id="path" data-stage="path" className="section page-shell">
      <header className="section-head">
        <p className="kicker">
          <span className="kicker-line" /> 03 · Path
        </p>
        <h2 className="section-title">Two strands: study and work.</h2>
        <p className="section-lede">From full-stack internships to a Master&apos;s in data — newest first.</p>
      </header>

      <ol className="path-list">
        {steps.map((step, i) => (
          <motion.li
            key={step.id}
            className="path-row"
            data-kind={step.kind}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: i * 0.04, ease }}
          >
            <span className="path-period">{step.period}</span>
            <span className="path-main">
              <span className="path-title">{step.title}</span>
              <span className="path-org">
                {step.org} <span className="muted">· {step.note}</span>
              </span>
            </span>
            <span className="path-kind">{step.kind}</span>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
