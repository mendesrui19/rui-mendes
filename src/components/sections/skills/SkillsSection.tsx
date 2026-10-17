"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skillCount, skillGroups } from "@/data/site";
import { Panel, SectionHead, ease } from "@/components/ui/Panel";

const R = 70;
const C = 2 * Math.PI * R;
const GAP = 6;

const segments = (() => {
  let offset = 0;
  return skillGroups.map((group) => {
    const len = (group.items.length / skillCount) * C;
    const seg = { group, len: len - GAP, offset };
    offset += len;
    return seg;
  });
})();

const largest = Math.max(...skillGroups.map((g) => g.items.length));

export default function SkillsSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const focus = skillGroups.find((g) => g.id === selected);

  const toggle = (id: string) => setSelected((cur) => (cur === id ? null : id));

  return (
    <section id="skills" className="dash-section">
      <SectionHead kicker="Skills" title="Toolbox">
        From code to databases to the business side. Click an area to focus it.
      </SectionHead>

      <div className="skills-layout">
        <Panel title="Distribution" meta="by area" className="donut-panel">
          <div className="donut">
            <svg viewBox="0 0 180 180" role="img" aria-label="Skills by area">
              <circle cx="90" cy="90" r={R} className="donut-track" />
              {segments.map(({ group, len, offset }, i) => (
                <motion.circle
                  key={group.id}
                  cx="90"
                  cy="90"
                  r={R}
                  fill="none"
                  stroke={group.color}
                  strokeWidth={selected === group.id ? 20 : 16}
                  strokeLinecap="round"
                  strokeDashoffset={-offset}
                  transform="rotate(-90 90 90)"
                  style={{ cursor: "pointer", opacity: selected && selected !== group.id ? 0.25 : 1 }}
                  initial={{ strokeDasharray: `0 ${C}` }}
                  whileInView={{ strokeDasharray: `${len} ${C - len}` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease }}
                  onClick={() => toggle(group.id)}
                />
              ))}
            </svg>
            <div className="donut-center">
              <b>{focus ? focus.items.length : skillCount}</b>
              <span>{focus ? focus.label : "skills"}</span>
            </div>
          </div>
          <ul className="donut-legend">
            {skillGroups.map((g) => (
              <li key={g.id}>
                <button type="button" onClick={() => toggle(g.id)} data-active={selected === g.id} data-dim={Boolean(selected) && selected !== g.id}>
                  <i style={{ background: g.color }} />
                  <span>{g.label}</span>
                  <b>{Math.round((g.items.length / skillCount) * 100)}%</b>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="skill-groups">
          {skillGroups.map((g, gi) => (
            <Panel key={g.id} className="skill-group" delay={gi * 0.06}>
              <div data-dim={Boolean(selected) && selected !== g.id} className="skill-group-inner">
                <header className="skill-group-head">
                  <span>
                    <i style={{ background: g.color }} />
                    {g.label}
                  </span>
                  <b>{g.items.length}</b>
                </header>
                <span className="skill-meter">
                  <motion.span
                    style={{ background: g.color }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: g.items.length / largest }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.2 + gi * 0.08, ease }}
                  />
                </span>
                <ul className="chips">
                  {g.items.map((item) => (
                    <li key={item} style={{ "--chip": g.color } as React.CSSProperties}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </section>
  );
}
