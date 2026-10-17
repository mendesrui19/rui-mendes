"use client";

import { motion } from "framer-motion";
import { skillDomains, skills } from "@/data/site";

const ease = [0.16, 1, 0.3, 1] as const;
const max = Math.max(...skills.map((s) => s.used.length));

export default function SkillsSection() {
  return (
    <section id="skills" data-stage="skills" className="section page-shell skills">
      <header className="section-head">
        <p className="kicker">
          <span className="kicker-line" /> 02 · Skills
        </p>
        <h2 className="section-title">Three clusters, one stack.</h2>
        <p className="section-lede">
          Each cloud above is a domain. Below, every skill and how many of my projects and roles
          actually used it — counted, not guessed.
        </p>
      </header>

      <div className="skills-gap" aria-hidden="true" />

      <div className="skills-grid">
        {skillDomains.map((domain, d) => (
          <motion.div
            key={domain.id}
            className="skill-col"
            style={{ "--dot": domain.color } as React.CSSProperties}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: d * 0.08, ease }}
          >
            <h3>
              <span className="skill-dot" />
              {domain.label}
            </h3>
            <ul>
              {skills
                .filter((s) => s.domain === domain.id)
                .map((skill) => (
                  <li key={skill.name}>
                    <span className="skill-row">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-n">×{skill.used.length}</span>
                    </span>
                    <span className="skill-bar">
                      <motion.span
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: skill.used.length / max }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + d * 0.08, ease }}
                      />
                    </span>
                    <span className="skill-used">{skill.used.join(" · ")}</span>
                  </li>
                ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
