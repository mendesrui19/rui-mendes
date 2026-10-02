"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

const navItems = [
  { label: "Home", id: "home" },
  { label: "Work", id: "portfolio" },
  { label: "Skills", id: "skills" },
  { label: "Path", id: "path" },
  { label: "Contact", id: "contact" },
];

const darkSections = new Set(["skills"]);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [underNav, setUnderNav] = useState("home");

  useEffect(() => {
    const sectionAt = (sections: HTMLElement[], y: number) => {
      let id = sections[0]?.id ?? "home";
      for (const s of sections) if (s.getBoundingClientRect().top <= y) id = s.id;
      return id;
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = navItems
        .map((item) => document.getElementById(item.id))
        .filter((s): s is HTMLElement => s !== null);
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setScrolled(window.scrollY > 20);
      setActiveSection(
        atBottom ? (sections.at(-1)?.id ?? "home") : sectionAt(sections, window.innerHeight * 0.4),
      );
      setUnderNav(sectionAt(sections, 36));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav className={`nav-shell ${darkSections.has(underNav) ? "theme-dark" : ""}`}>
      <div className="nav-pill" data-scrolled={scrolled}>
        <a
          href="#home"
          className="font-[family-name:var(--font-dm-mono)] text-[13px] tracking-[0.12em] text-[var(--text-secondary)] no-underline"
        >
          {site.handle}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="relative pb-1 font-[family-name:var(--font-dm-mono)] text-[13px] tracking-[0.08em] no-underline transition-colors duration-200"
                style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}
              >
                {item.label}
                <span
                  className="absolute bottom-0 left-0 h-px w-full origin-left bg-[var(--accent)] transition-transform duration-300"
                  style={{ transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
                />
              </a>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex cursor-pointer flex-col gap-1 border-0 bg-transparent md:hidden"
        >
          <span className="h-0.5 w-5 bg-[var(--ink)]" />
          <span className="h-0.5 w-5 bg-[var(--ink)]" />
          <span className="h-0.5 w-5 bg-[var(--ink)]" />
        </button>
      </div>

      {open && (
        <div className="surface mt-3 flex flex-col gap-4 rounded-2xl p-5 md:hidden">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="font-[family-name:var(--font-dm-mono)] text-[13px] no-underline"
              style={{ color: activeSection === item.id ? "var(--text-primary)" : "var(--text-secondary)" }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
