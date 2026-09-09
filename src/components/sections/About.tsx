"use client";

import { GraduationCap, Briefcase, Code, ArrowUpRight } from "lucide-react";
import { education, experience, projects } from "@/data/site";

export default function About() {
  const scrollToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    { icon: <Code size={16} />, value: String(projects.length), title: "PROJECTS" },
    { icon: <GraduationCap size={16} />, value: String(education.length), title: "EDUCATION" },
    { icon: <Briefcase size={16} />, value: String(experience.length), title: "EXPERIENCE" },
  ];

  return (
    <section id="about" className="page-shell pb-16 pt-2 sm:pb-20">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={scrollToPortfolio}
            className="surface relative min-h-[118px] min-w-0 cursor-pointer rounded-2xl p-5 text-left transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div
              className="mb-6 flex size-9 items-center justify-center rounded-full border"
              style={{ borderColor: "var(--border)" }}
            >
              {item.icon}
            </div>
            <div className="absolute top-5 right-5 text-[20px] font-bold">{item.value}</div>
            <div className="pr-8 text-[11px] tracking-[0.1em] text-white/70">{item.title}</div>
            <span className="absolute right-4 bottom-4 text-white/50">
              <ArrowUpRight size={15} />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
