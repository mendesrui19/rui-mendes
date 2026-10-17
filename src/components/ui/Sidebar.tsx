"use client";

import { useEffect, useState } from "react";
import { BarChart3, CalendarRange, FolderKanban, LayoutDashboard, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { site } from "@/data/site";

export const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "skills", label: "Skills", icon: BarChart3 },
  { id: "timeline", label: "Timeline", icon: CalendarRange },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function Sidebar() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="sidebar">
      <a href="#overview" className="side-profile">
        <img src={site.photo} alt="" className="side-avatar" />
        <span className="min-w-0">
          <span className="side-name">{site.name}</span>
          <span className="side-role">Data Science & Engineering</span>
        </span>
      </a>

      <nav className="side-nav" aria-label="Sections">
        {sections.map(({ id, label, icon: Icon }) => (
          <a key={id} href={`#${id}`} data-active={active === id}>
            <Icon size={17} strokeWidth={1.8} />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <div className="side-foot">
        <span className="side-status">
          <span className="live-dot" />
          {site.available}
        </span>
        <span className="side-social">
          <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
          <a href={site.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
          </a>
        </span>
      </div>
    </aside>
  );
}
