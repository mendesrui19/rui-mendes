"use client";

import { useMemo, useState } from "react";
import { education, experience, projects, techStacks } from "@/data/site";
import PortfolioCard from "./PortfolioCard";

const filters = ["All", "Web", "Community", "Data"] as const;

export default function PortfolioShowcase() {
  const [activeTab, setActiveTab] = useState("projects");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const visible = useMemo(() => {
    const list = filter === "All" ? projects : projects.filter((item) => item.category === filter);
    const featured = list.find((item) => item.featured);
    const rest = featured ? list.filter((item) => item.id !== featured.id) : list;
    return { featured, rest };
  }, [filter]);

  return (
    <section id="portfolio" className="page-shell section text-white">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 font-[family-name:var(--font-dm-mono)] text-[12px] tracking-[0.2em] text-white/40">
          WORK
        </p>
        <h2 className="mb-4 text-3xl font-bold tracking-[-0.03em] md:text-5xl">Real projects</h2>
        <p className="text-sm leading-relaxed text-white/55 md:text-base">
          Repos, live sites and access notes. Nothing invented — everything here exists on GitHub or in production.
        </p>
      </div>

      <div className="mb-8 flex justify-start">
        <div className="surface flex w-full max-w-xl gap-1 rounded-full p-1.5" role="tablist">
          {[
            ["projects", "Projects"],
            ["path", "Path"],
            ["techstack", "Stack"],
          ].map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-full py-2.5 text-sm transition-colors duration-200 ${
                activeTab === tab
                  ? "bg-[var(--accent)] text-[oklch(16%_0.04_152)]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] tracking-[0.04em] ${
                  filter === item
                    ? "bg-white text-[oklch(16%_0.04_152)]"
                    : "border border-white/10 text-white/55 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {visible.featured ? <PortfolioCard project={visible.featured} featured /> : null}

          <div className="grid gap-5 md:grid-cols-2">
            {visible.rest.map((item) => (
              <PortfolioCard key={item.id} project={item} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "path" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm tracking-[0.14em] text-white/45">EDUCATION</h3>
            <div className="space-y-3">
              {education.map((item) => (
                <div key={item.id} className="surface rounded-2xl p-5">
                  <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-white/40">
                    {item.period}
                  </p>
                  <p className="mt-1 text-lg font-semibold">{item.title}</p>
                  <p className="text-sm text-[var(--accent)]">{item.school}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/55">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm tracking-[0.14em] text-white/45">EXPERIENCE</h3>
            <div className="space-y-3">
              {experience.map((item) => (
                <div key={item.id} className="surface rounded-2xl p-5">
                  <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-white/40">
                    {item.period}
                  </p>
                  <p className="mt-1 text-lg font-semibold">{item.title}</p>
                  <p className="text-sm text-[var(--accent)]">{item.org}</p>
                  <p className="mt-2 text-[13px] text-white/55">{item.place}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "techstack" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {techStacks.map((item) => (
            <div
              key={item.id}
              className="surface flex min-h-[88px] items-center justify-center rounded-[20px] px-3 py-4 text-center text-[13px] text-white/80"
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
