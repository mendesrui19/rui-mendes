"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { STAGES } from "@/lib/stage";

const links = [
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "path", label: "Path" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive((entry.target as HTMLElement).dataset.stage ?? "home");
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    STAGES.forEach((id) => {
      const el = document.querySelector(`[data-stage="${id}"]`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="nav">
      <a href="#home" className="nav-mark" aria-label={`${site.name} — top`}>
        <span className="nav-logo">RM</span>
        <span className="nav-name">{site.name}</span>
      </a>
      <nav className="nav-links" aria-label="Sections">
        {links.map((link, i) => (
          <a key={link.id} href={`#${link.id}`} data-active={active === link.id}>
            <span className="nav-idx">0{i + 1}</span>
            {link.label}
          </a>
        ))}
      </nav>
      <span className="nav-status">
        <span className="live-dot" />
        {site.available}
      </span>
    </header>
  );
}
