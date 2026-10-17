"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, GraduationCap, MapPin } from "lucide-react";
import { experience, projects, site, skillCount, skillGroups } from "@/data/site";
import { Counter, Panel, ease } from "@/components/ui/Panel";
import QueryConsole from "@/components/ui/QueryConsole";
import Tilt from "@/components/ui/Tilt";

const live = projects.filter((p) => p.live_url).length;
const firstYear = Math.min(...experience.map((e) => Number(e.start.slice(0, 4))));

const categoryCounts = Array.from(new Set(projects.map((p) => p.category))).map(
  (cat) => projects.filter((p) => p.category === cat).length,
);
const years = Array.from({ length: 5 }, (_, i) => firstYear + i);
const rolesPerYear = years.map((y) => experience.filter((e) => Number(e.start.slice(0, 4)) <= y && Number((e.end ?? "9999").slice(0, 4)) >= y).length);

const kpis: { label: string; value?: number; text?: string; note: string; spark: number[]; max?: number }[] = [
  { label: "Projects", value: projects.length, note: `${live} live in production`, spark: categoryCounts },
  { label: "Skills", value: skillCount, note: `across ${skillGroups.length} areas`, spark: skillGroups.map((g) => g.items.length) },
  { label: "Roles", value: experience.length, note: `since ${firstYear}`, spark: rolesPerYear },
  { label: "BSc standing", text: "150/200", note: "University of Minho", spark: [150], max: 200 },
];

function Spark({ values, max, delay }: { values: number[]; max?: number; delay: number }) {
  const top = max ?? Math.max(...values, 1);
  if (values.length === 1) {
    return (
      <span className="spark-progress">
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: values[0] / top }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease }}
        />
      </span>
    );
  }
  return (
    <span className="spark">
      {values.map((v, i) => (
        <motion.span
          key={i}
          style={{ height: `${Math.max(12, (v / top) * 100)}%` }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: delay + i * 0.06, ease }}
        />
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section id="overview" className="dash-section overview">
      <div className="ov-hero">
        <motion.header
          className="ov-head"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="ov-badge">
            <span className="live-dot" /> {site.available} · Data Science & Engineering
          </p>
          <h1 className="ov-title">{site.name}</h1>
          <p className="ov-lede">
            Master&apos;s student at FEUP with a background in Information Systems (UMinho). I build web
            apps end to end and work with data in SQL, Python, R and Tableau.
          </p>
          <div className="ov-cta">
            <a href="#projects" className="btn btn-solid">
              View projects <ArrowRight size={16} />
            </a>
            <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              LinkedIn <ArrowUpRight size={16} />
            </a>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
        >
          <Tilt scrollTilt max={5}>
            <QueryConsole />
          </Tilt>
        </motion.div>
      </div>

      <div className="kpi-grid">
        {kpis.map((kpi, i) => (
          <Panel key={kpi.label} className="kpi" delay={0.1 + i * 0.08} flip>
            <span className="kpi-label">{kpi.label}</span>
            <span className="kpi-value">{kpi.text ?? <Counter value={kpi.value ?? 0} />}</span>
            <span className="kpi-note">{kpi.note}</span>
            <Spark values={kpi.spark} max={kpi.max} delay={0.3 + i * 0.08} />
          </Panel>
        ))}
      </div>

      <div className="ov-grid">
        <Panel title="Currently" meta="2026" delay={0.15}>
          <ul className="now-list">
            <li>
              <GraduationCap size={18} />
              <span>
                <b>MSc Data Science and Engineering</b>
                <small>FEUP · University of Porto · Sep 2026 — present</small>
              </span>
            </li>
            <li>
              <MapPin size={18} />
              <span>
                <b>{site.location}</b>
                <small>Open to internships and junior data / full-stack roles</small>
              </span>
            </li>
          </ul>
        </Panel>

        <Panel title="Skill mix" meta={`${skillCount} skills`} delay={0.2}>
          <div className="mix-bar">
            {skillGroups.map((g, i) => (
              <motion.span
                key={g.id}
                style={{ background: g.color, flexGrow: g.items.length }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease }}
              />
            ))}
          </div>
          <ul className="mix-legend">
            {skillGroups.map((g) => (
              <li key={g.id}>
                <i style={{ background: g.color }} />
                {g.label}
                <b>{g.items.length}</b>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </section>
  );
}
