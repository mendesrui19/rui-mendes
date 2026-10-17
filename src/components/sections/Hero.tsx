"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";

const ease = [0.16, 1, 0.3, 1] as const;

function Word({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="hero-word" aria-hidden="true">
      {text.split("").map((char, i) => (
        <span key={i} className="hero-char-mask">
          <motion.span
            className="hero-char"
            initial={{ y: "110%", rotate: 8 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.045, ease }}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const facts = [
  { k: "Now", v: "MSc Data Science & Engineering", s: "FEUP · Porto" },
  { k: "Before", v: "BSc Information Systems", s: "UMinho · 150/200" },
  { k: "Based in", v: site.location, s: "Portugal" },
];

export default function Hero() {
  return (
    <section id="home" data-stage="home" className="hero page-shell">
      <motion.p
        className="kicker"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease }}
      >
        <span className="kicker-line" /> Data science · Software engineering
      </motion.p>

      <h1 className="hero-title" aria-label={site.name}>
        <Word text={site.firstName} delay={0.45} />
        <Word text={site.lastName} delay={0.65} />
      </h1>

      <motion.p
        className="hero-lede"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.1, ease }}
      >
        I build products people actually open — and I&apos;m learning to make the data behind them
        think.{" "}
        <span className="muted">
          Full-stack internships (Laravel, Node.js) and real clients behind every project below.
        </span>
      </motion.p>

      <motion.div
        className="hero-cta"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.25, ease }}
      >
        <a href="#work" className="btn btn-solid">
          See the work <ArrowDown size={16} />
        </a>
        <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          LinkedIn <ArrowUpRight size={16} />
        </a>
      </motion.div>

      <motion.dl
        className="hero-facts"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        {facts.map((f) => (
          <div key={f.k}>
            <dt>{f.k}</dt>
            <dd>
              {f.v}
              <span>{f.s}</span>
            </dd>
          </div>
        ))}
      </motion.dl>

      <div className="scroll-hint" aria-hidden="true">
        <span>Scroll — the data rearranges</span>
        <span className="scroll-bar" />
      </div>
    </section>
  );
}
