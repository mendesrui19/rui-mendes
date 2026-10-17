"use client";

import { motion } from "framer-motion";
import { education, experience } from "@/data/site";
import { Panel, SectionHead, ease } from "@/components/ui/Panel";

function toYear(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return y + (m - 1) / 12;
}

const now = (() => {
  const d = new Date();
  return d.getFullYear() + d.getMonth() / 12;
})();

const rows = [
  ...education.map((e) => ({ id: e.id, kind: "Study", title: e.title, org: e.school, period: e.period, start: e.start, end: e.end })),
  ...experience.map((e) => ({ id: e.id, kind: "Work", title: e.title, org: e.org, period: e.period, start: e.start, end: e.end })),
]
  .map((r) => ({ ...r, from: toYear(r.start), to: r.end ? toYear(r.end) + 1 / 12 : now, ongoing: !r.end }))
  .sort((a, b) => a.from - b.from);

const MIN = Math.floor(Math.min(...rows.map((r) => r.from)));
const MAX = Math.ceil(Math.max(now, ...rows.map((r) => r.to)) + 0.01);
const pct = (t: number) => ((t - MIN) / (MAX - MIN)) * 100;
const years = Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i);

export default function PathSection() {
  return (
    <section id="timeline" className="dash-section">
      <SectionHead kicker="Timeline" title="Study and work">
        Every degree and role on one time axis. Blue is study, teal is work.
      </SectionHead>

      <Panel title="Gantt" meta={`${MIN} — today`}>
        <div className="gantt">
          <div className="gantt-axis">
            {years.map((y) => (
              <span key={y} style={{ left: `${pct(y)}%` }}>
                {y}
              </span>
            ))}
          </div>

          <div className="gantt-body">
            <div className="gantt-grid" aria-hidden="true">
              {years.map((y) => (
                <i key={y} style={{ left: `${pct(y)}%` }} />
              ))}
              <b className="gantt-now" style={{ left: `${pct(now)}%` }}>
                <span>today</span>
              </b>
            </div>

            {rows.map((row, i) => (
              <div key={row.id} className="gantt-row">
                <div className="gantt-label">
                  <span className="gantt-title">{row.title}</span>
                  <span className="gantt-org">
                    {row.org} · {row.period}
                  </span>
                </div>
                <div className="gantt-track">
                  <motion.span
                    className="gantt-bar"
                    data-kind={row.kind}
                    data-ongoing={row.ongoing}
                    style={{ left: `${pct(row.from)}%`, width: `${Math.max(1.2, pct(row.to) - pct(row.from))}%` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease }}
                    title={`${row.title} · ${row.period}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <ul className="gantt-legend">
          <li>
            <i data-kind="Study" /> Study
          </li>
          <li>
            <i data-kind="Work" /> Work
          </li>
          <li>
            <i className="is-now" /> Today
          </li>
        </ul>
      </Panel>
    </section>
  );
}
