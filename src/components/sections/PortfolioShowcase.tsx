"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { education, experience, projects } from "@/data/site";
import ProjectStage from "./ProjectStage";

const tabs = [
  ["projects", "Projects"],
  ["path", "Path"],
] as const;

type Tab = (typeof tabs)[number][0];

const ease = [0.22, 1, 0.36, 1] as const;

export default function PortfolioShowcase() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const project = projects[active];

  const focusItem = (index: number) => {
    const next = (index + projects.length) % projects.length;
    setActive(next);
    listRef.current?.querySelectorAll<HTMLButtonElement>("[data-project]")[next]?.focus();
  };

  return (
    <section id="portfolio" className="page-shell section text-white">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 font-[family-name:var(--font-dm-mono)] text-[12px] tracking-[0.2em] text-[var(--text-muted)]">
            WORK
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-[-0.03em] md:text-5xl">Real projects</h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
            Repos, live sites and access notes. Nothing invented — everything here exists on GitHub or in production.
          </p>
        </div>

        <div className="surface relative flex w-full max-w-[260px] gap-1 rounded-full p-1.5" role="tablist">
          {tabs.map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 rounded-full py-2.5 text-sm transition-colors duration-200 ${
                activeTab === tab ? "text-[var(--accent-ink)]" : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="work-tab"
                  className="absolute inset-0 rounded-full bg-[var(--accent)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "projects" && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-10">
          <div
            ref={listRef}
            className="project-list"
            role="listbox"
            aria-label="Projects"
            aria-activedescendant={`project-${project.id}`}
          >
            {projects.map((item, index) => {
              const selected = index === active;
              return (
                <div key={item.id} className="project-item" data-active={selected}>
                  <button
                    id={`project-${item.id}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    data-project
                    onClick={() => setActive(index)}
                    onMouseEnter={() => setActive(index)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                        event.preventDefault();
                        focusItem(index + 1);
                      }
                      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                        event.preventDefault();
                        focusItem(index - 1);
                      }
                    }}
                    className="project-row"
                  >
                    {selected && (
                      <motion.span
                        layoutId="project-marker"
                        className="project-marker"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="project-title">{item.title}</span>
                      <span className="project-meta">
                        {item.category} · {item.technologies.split(",").slice(0, 2).join(" ·")}
                      </span>
                    </span>
                    <span className="project-arrow" aria-hidden="true">
                      →
                    </span>
                  </button>

                  {selected && (
                    <motion.div
                      className="pb-5 lg:hidden"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.4, ease }}
                    >
                      <ProjectStage project={item} compact />
                    </motion.div>
                  )}
                </div>
              );
            })}
            <p className="mt-5 hidden font-[family-name:var(--font-dm-mono)] text-[11px] text-[var(--text-muted)] lg:block">
              Hover or use ↑ ↓ to browse
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <ProjectStage project={project} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "path" && (
        <div className="grid gap-10 lg:grid-cols-2">
          {[
            { label: "EDUCATION", items: education.map((e) => ({ id: e.id, period: e.period, title: e.title, org: e.school, note: e.detail })) },
            { label: "EXPERIENCE", items: experience.map((e) => ({ id: e.id, period: e.period, title: e.title, org: e.org, note: e.place })) },
          ].map((column) => (
            <div key={column.label}>
              <h3 className="mb-5 font-[family-name:var(--font-dm-mono)] text-[12px] tracking-[0.16em] text-[var(--text-muted)]">
                {column.label}
              </h3>
              <ol className="timeline">
                {column.items.map((item, index) => (
                  <motion.li
                    key={item.id}
                    className="timeline-item"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08, ease }}
                  >
                    <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[var(--text-muted)]">
                      {item.period}
                    </p>
                    <p className="mt-1 text-lg font-semibold leading-snug">{item.title}</p>
                    <p className="text-sm text-[var(--accent)]">{item.org}</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">{item.note}</p>
                  </motion.li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
