"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ErrorBoundary from "@/components/ErrorBoundary";
import { chapterAt, skillChapters, skillDomains, skills } from "@/data/site";

const SkillsScene = dynamic(() => import("./SkillsScene"), { ssr: false });

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [running, setRunning] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const sync = (value: number) => {
      progress.current = value;
      const next = chapterAt(value);
      setChapter((current) => (current === next ? current : next));
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => sync(self.progress),
        onRefresh: (self) => sync(self.progress),
      });
    }, section);

    const observer = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting), {
      rootMargin: "200px 0px",
    });
    observer.observe(section);

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 800);

    return () => {
      window.clearTimeout(refresh);
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  const current = skillChapters[chapter];
  const domain = skillDomains.find((item) => item.id === current.id);
  const listed = domain ? skills.filter((skill) => skill.domain === domain.id) : [];

  return (
    <section id="skills" ref={sectionRef} className="theme-dark relative h-[420vh]">
      <div className="skills-stage sticky top-0 h-[100svh] overflow-hidden">
        <div className="skills-canvas absolute inset-0 isolate md:left-[34%]" aria-hidden="true">
          <ErrorBoundary>
            <SkillsScene progress={progress} chapter={chapter} running={running} reduced={reduced} />
          </ErrorBoundary>
        </div>

        <div className="page-shell pointer-events-none relative z-10 flex h-full items-end pb-14 md:items-center md:pb-0">
          <div className="skills-copy relative w-full max-w-[25rem]">
            {skillChapters.map((item, index) => (
              <div
                key={item.id}
                className="skills-chapter"
                data-active={index === chapter}
                aria-hidden={index !== chapter}
              >
                <p
                  className="mb-3 font-[family-name:var(--font-dm-mono)] text-[12px] tracking-[0.2em]"
                  style={{ color: skillDomains.find((d) => d.id === item.id)?.color ?? "var(--accent)" }}
                >
                  {item.kicker}
                </p>
                <h2 className="mb-4 text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.04em]">
                  {item.title}
                </h2>
                <p className="text-[15px] leading-[1.75] text-[var(--text-secondary)]">{item.body}</p>
              </div>
            ))}

            <ul className="skills-list mt-6 grid gap-2" data-show={listed.length > 0}>
              {listed.map((skill) => (
                <li key={skill.name} className="flex items-baseline justify-between gap-4 text-[13px]">
                  <span className="text-[var(--ink)]">{skill.name}</span>
                  <span className="hidden truncate text-right text-[var(--text-muted)] sm:block">
                    {skill.used.join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pointer-events-none absolute top-1/2 right-[var(--page-pad)] z-10 hidden -translate-y-1/2 flex-col gap-3 md:flex">
          {skillChapters.map((item, index) => (
            <span key={item.id} className="skills-tick" data-active={index === chapter} />
          ))}
        </div>

        <p className="pointer-events-none absolute right-[var(--page-pad)] bottom-6 z-10 hidden font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.08em] text-[var(--text-muted)] md:block">
          Bar height = projects and roles where I used it
        </p>
      </div>
    </section>
  );
}
