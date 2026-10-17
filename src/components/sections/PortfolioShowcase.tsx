"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/site";
import { SectionHead, ease } from "@/components/ui/Panel";
import Tilt from "@/components/ui/Tilt";

const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

export default function PortfolioShowcase() {
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="dash-section">
      <SectionHead kicker="Projects" title="Shipped work">
        Each card opens a full report: screenshots, how it was built and demo access.
      </SectionHead>

      <div className="filter-bar" role="tablist" aria-label="Filter projects">
        {categories.map((cat) => {
          const count = cat === "All" ? projects.length : projects.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={filter === cat}
              onClick={() => setFilter(cat)}
              className="filter-btn"
            >
              {filter === cat && (
                <motion.span layoutId="filter-pill" className="filter-pill" transition={{ duration: 0.35, ease }} />
              )}
              <span className="relative">{cat}</span>
              <span className="filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="project-grid">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.05, ease }}
            >
              <Tilt className="pcard-tilt">
                <Link href={`/portfolio/${project.id}`} className="pcard">
                  <span className="pcard-media" data-fit={project.imageFit ?? "cover"}>
                    <img src={project.image_url} alt="" loading="lazy" />
                  </span>
                  <span className="pcard-body">
                    <span className="pcard-top">
                      <span className="pcard-cat">{project.category}</span>
                      <span className="pcard-status" data-live={Boolean(project.live_url)}>
                        {project.live_url ? "Live" : "Code"}
                      </span>
                    </span>
                    <span className="pcard-title">{project.title}</span>
                    <span className="pcard-desc">{project.description}</span>
                    <span className="pcard-tags">
                      {project.technologies.split(",").map((t) => (
                        <span key={t}>{t.trim()}</span>
                      ))}
                    </span>
                    <span className="pcard-go">
                      Open report <ArrowUpRight size={15} />
                    </span>
                  </span>
                </Link>
              </Tilt>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
