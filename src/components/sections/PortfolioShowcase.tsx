"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/site";

const ease = [0.16, 1, 0.3, 1] as const;

export default function PortfolioShowcase() {
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });

  const onMove = (e: React.PointerEvent) => {
    x.set(e.clientX);
    y.set(e.clientY);
  };

  return (
    <section id="work" data-stage="work" className="section page-shell">
      <header className="section-head">
        <p className="kicker">
          <span className="kicker-line" /> 01 · Selected work
        </p>
        <h2 className="section-title">
          Things I shipped<span className="count">({String(projects.length).padStart(2, "0")})</span>
        </h2>
        <p className="section-lede">
          Restaurants running service on them, a festival floor, a streamer&apos;s community, a triage
          bot. Hover to preview, open for the full story.
        </p>
      </header>

      <ol className="work-list" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        {projects.map((project, i) => (
          <motion.li
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.06, ease }}
          >
            <Link
              href={`/portfolio/${project.id}`}
              className="work-row"
              data-dim={hover !== null && hover !== i}
              onPointerEnter={() => setHover(i)}
            >
              <span className="work-idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="work-main">
                <span className="work-title">{project.title}</span>
                <span className="work-desc">{project.description}</span>
                <img className="work-thumb" src={project.image_url} alt="" loading="lazy" />
              </span>
              <span className="work-meta">
                <span className="work-cat">{project.category}</span>
                <span className="work-tech">{project.technologies}</span>
              </span>
              <span className="work-go">
                <ArrowUpRight size={22} />
              </span>
            </Link>
          </motion.li>
        ))}
      </ol>

      <motion.div className="work-preview" style={{ x: sx, y: sy }} aria-hidden="true">
        <AnimatePresence>
          {hover !== null && (
            <motion.div
              key={projects[hover].id}
              className="work-preview-card"
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease }}
            >
              <img
                src={projects[hover].image_url}
                alt=""
                style={{ objectFit: projects[hover].imageFit ?? "cover" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
