"use client";

import { useState, useEffect } from "react";
import { site } from "@/data/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ["home", "about", "portfolio", "contact"];

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Work", id: "portfolio" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav className="nav-shell">
      <div
        className="nav-pill"
        style={{
          background: scrolled
            ? "oklch(13.5% 0.028 152 / 0.92)"
            : "oklch(13.5% 0.028 152 / 0.7)",
        }}
      >
        <span
          className="font-[family-name:var(--font-dm-mono)] text-[13px] tracking-[0.12em]"
          style={{ color: "var(--text-secondary)" }}
        >
          {site.handle}
        </span>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="relative pb-1 font-[family-name:var(--font-dm-mono)] text-[13px] tracking-[0.08em] no-underline transition-colors duration-200"
                style={{
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                {item.label}
                <span
                  className="absolute bottom-0 left-0 h-px w-full origin-left bg-[var(--accent)] transition-transform duration-200"
                  style={{ transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
                />
              </a>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="flex cursor-pointer flex-col gap-1 border-0 bg-transparent md:hidden"
        >
          <span className="h-0.5 w-5 bg-white" />
          <span className="h-0.5 w-5 bg-white" />
          <span className="h-0.5 w-5 bg-white" />
        </button>
      </div>

      {open && (
        <div className="surface mt-3 flex flex-col gap-4 rounded-2xl p-5 md:hidden">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="font-[family-name:var(--font-dm-mono)] text-[13px]"
                style={{
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
}
