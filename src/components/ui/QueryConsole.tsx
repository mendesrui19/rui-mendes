"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { projects, site, skillGroups } from "@/data/site";

type Query = {
  sql: string;
  columns: string[];
  rows: string[][];
};

const dataSkills = skillGroups.find((g) => g.id === "data")?.items ?? [];

const queries: Query[] = [
  {
    sql: "SELECT name, degree, city FROM profile;",
    columns: ["name", "degree", "city"],
    rows: [[site.name, "MSc Data Science & Eng. · FEUP", "Felgueiras"]],
  },
  {
    sql: "SELECT skill FROM skills WHERE area = 'data';",
    columns: ["skill"],
    rows: dataSkills.map((s) => [s]),
  },
  {
    sql: "SELECT title, status FROM projects;",
    columns: ["title", "status"],
    rows: projects.map((p) => [p.title, p.live_url ? "live" : "code"]),
  },
];

const TYPE_MS = 32;
const HOLD_MS = 4200;

export default function QueryConsole() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [qi, setQi] = useState(0);
  const [typed, setTyped] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const query = queries[qi];

  useEffect(() => {
    if (!inView) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typed < query.sql.length) {
      const t = setTimeout(() => setTyped(reduced ? query.sql.length : typed + 1), TYPE_MS);
      return () => clearTimeout(t);
    }
    if (!showResult) {
      const t = setTimeout(() => setShowResult(true), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setShowResult(false);
      setTyped(0);
      setQi((qi + 1) % queries.length);
    }, HOLD_MS + query.rows.length * 90);
    return () => clearTimeout(t);
  }, [inView, typed, showResult, qi, query]);

  return (
    <div ref={ref} className="console" aria-label="Animated SQL console showing profile, skills and projects">
      <div className="console-bar">
        <span className="console-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="console-file">rui.sql</span>
        <span className="console-db">postgres · connected</span>
      </div>

      <div className="console-tabs">
        {queries.map((q, i) => (
          <span key={q.sql} data-active={i === qi}>
            {["profile", "skills", "projects"][i]}
          </span>
        ))}
      </div>

      <pre className="console-sql">
        <span className="console-prompt">rui=#</span> <Highlighted text={query.sql.slice(0, typed)} />
        <span className="console-caret" />
      </pre>

      <div className="console-result">
        <AnimatePresence mode="wait">
          {showResult ? (
            <motion.div
              key={qi}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <table>
                <thead>
                  <tr>
                    {query.columns.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {query.rows.map((row, r) => (
                    <motion.tr
                      key={row.join("|")}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: r * 0.09 }}
                    >
                      {row.map((cell, c) => (
                        <td key={c} data-status={cell === "live" || cell === "code" ? cell : undefined}>
                          {cell}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              <motion.p
                className="console-foot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: query.rows.length * 0.09 + 0.1 }}
              >
                ({query.rows.length} {query.rows.length === 1 ? "row" : "rows"})
              </motion.p>
            </motion.div>
          ) : (
            <motion.p key="wait" className="console-wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {typed >= query.sql.length ? "running…" : " "}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Highlighted({ text }: { text: string }) {
  const parts: { t: string; k: "kw" | "str" | "txt" }[] = [];
  const re = /('[^']*'?)|\b(SELECT|FROM|WHERE|ORDER BY)\b/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) parts.push({ t: text.slice(last, m.index), k: "txt" });
    parts.push({ t: m[0], k: m[1] ? "str" : "kw" });
    last = m.index! + m[0].length;
  }
  if (last < text.length) parts.push({ t: text.slice(last), k: "txt" });
  return (
    <>
      {parts.map((p, i) => (
        <span key={i} className={p.k === "txt" ? undefined : `sql-${p.k}`}>
          {p.t}
        </span>
      ))}
    </>
  );
}
