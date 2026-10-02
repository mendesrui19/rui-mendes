"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { education, experience } from "@/data/site";

const SIZE = 640;
const C = SIZE / 2;
const MONTHS = 60;
const START = toYear("2022-09");
const SPAN = MONTHS / 12;
const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const RING = { edu: 204, work: 174 };

type Kind = keyof typeof RING;

type Milestone = {
  id: string;
  kind: Kind;
  title: string;
  org: string;
  period: string;
  note: string;
  from: number;
  to: number | null;
};

function toYear(value: string) {
  const [year, month] = value.split("-").map(Number);
  return year + (month - 1) / 12;
}

function angleAt(t: number) {
  return ((t - START) / SPAN) * 360;
}

function point(r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return [C + r * Math.sin(rad), C - r * Math.cos(rad)] as const;
}

function arc(r: number, a0: number, a1: number) {
  if (a1 - a0 < 0.05) return "";
  const [x0, y0] = point(r, a0);
  const [x1, y1] = point(r, a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
}

const milestones: Milestone[] = [
  ...education.map((item) => ({
    id: item.id,
    kind: "edu" as const,
    title: item.title,
    org: item.school,
    period: item.period,
    note: item.detail,
    from: toYear(item.start),
    to: item.end ? toYear(item.end) + 1 / 12 : null,
  })),
  ...experience.map((item) => ({
    id: item.id,
    kind: "work" as const,
    title: item.title,
    org: item.org,
    period: item.period,
    note: item.place,
    from: toYear(item.start),
    to: item.end ? toYear(item.end) + 1 / 12 : null,
  })),
].sort((a, b) => a.from - b.from);

function Digit({ value }: { value: number }) {
  return (
    <span className="odo-digit">
      <span className="odo-column" style={{ transform: `translateY(${-value * 10}%)` }}>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i}>{i}</span>
        ))}
      </span>
    </span>
  );
}

export default function PathSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const handRef = useRef<SVGGElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const arcRefs = useRef<(SVGPathElement | null)[]>([]);
  const tickRefs = useRef<(SVGLineElement | null)[]>([]);
  const target = useRef(0);
  const current = useRef(0);

  const now = useMemo(() => {
    const date = new Date();
    return Math.min(date.getFullYear() + (date.getMonth() + 0.5) / 12, START + SPAN);
  }, []);

  const [month, setMonth] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let running = false;
    let lastMonth = -1;
    let lastTicks = -1;

    const render = (p: number) => {
      const t = START + gsap.utils.clamp(0, 1, (p - 0.04) / 0.86) * (now - START);
      const angle = angleAt(t);

      handRef.current?.setAttribute("transform", `rotate(${angle} ${C} ${C})`);
      if (sweepRef.current) sweepRef.current.style.transform = `rotate(${angle}deg)`;

      milestones.forEach((item, i) => {
        const end = Math.min(item.to ?? t, t);
        arcRefs.current[i]?.setAttribute("d", t < item.from ? "" : arc(RING[item.kind], angleAt(item.from), angleAt(end)));
      });

      const ticks = Math.floor(((t - START) / SPAN) * MONTHS + 1e-6);
      if (ticks !== lastTicks) {
        tickRefs.current.forEach((tick, i) => tick?.setAttribute("data-on", String(i <= ticks)));
        lastTicks = ticks;
      }

      const m = Math.floor((t - START) * 12 + 1e-6);
      if (m !== lastMonth) {
        lastMonth = m;
        setMonth(m);
      }
    };

    let last = 0;
    const loop = (time: number) => {
      const dt = last ? Math.min((time - last) / 1000, 0.5) : 1 / 60;
      last = time;
      const ease = reduce ? 1 : 1 - Math.exp(-dt * 7);
      current.current += (target.current - current.current) * ease;
      if (Math.abs(target.current - current.current) < 0.0004) current.current = target.current;
      render(current.current);
      frame = current.current !== target.current && running ? requestAnimationFrame(loop) : 0;
      if (!frame) last = 0;
    };

    const kick = () => {
      if (!frame && running) frame = requestAnimationFrame(loop);
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          target.current = self.progress;
          kick();
        },
        onRefresh: (self) => {
          target.current = self.progress;
          current.current = self.progress;
          render(self.progress);
        },
      });
    }, section);

    const observer = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) {
          setVisible(true);
          kick();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(section);
    render(0);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      ctx.revert();
    };
  }, [now]);

  const t = START + month / 12;
  const reached = milestones.filter((item) => item.from <= t + 1e-6).length;
  const activeIndex = Math.max(0, reached - 1);
  const active = milestones[activeIndex];
  const atNow = t + 1 / 12 >= now;
  const year = Math.floor(t + 1e-6);
  const monthName = MONTH_NAMES[Math.round((t - year) * 12) % 12];
  const nowAngle = angleAt(now);

  return (
    <section id="path" ref={sectionRef} className="relative h-[460vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="page-shell grid w-full items-center gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <div className="lg:order-2">
            <p className="mb-3 font-[family-name:var(--font-dm-mono)] text-[12px] tracking-[0.2em] text-[var(--accent)]">
              PATH
            </p>
            <h2 className="mb-3 text-[clamp(1.9rem,4.2vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.04em]">
              Every month counts.
            </h2>
            <p className="mb-6 hidden max-w-md text-[15px] leading-relaxed text-[var(--text-secondary)] sm:block">
              Each tick on the dial is one month, from my first internship in September 2022 to today. Scroll to wind it
              forward.
            </p>

            <ol className="path-list hidden lg:grid">
              {milestones.map((item, i) => (
                <li
                  key={item.id}
                  className="path-item"
                  data-state={i < reached ? (i === activeIndex ? "active" : "past") : "future"}
                  data-kind={item.kind}
                >
                  <span className="path-dot" />
                  <div className="min-w-0">
                    <p className="font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.06em] text-[var(--text-muted)]">
                      {item.period}
                    </p>
                    <p className="path-title">{item.title}</p>
                    <p className="text-[13px] text-[var(--text-secondary)]">
                      {item.org}
                      <span className="path-note"> · {item.note}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative mx-auto w-[min(86vw,52svh)] lg:order-1 lg:w-[min(100%,72svh)]">
            <div className="dial" data-ready={visible}>
              <div className="dial-sweep" ref={sweepRef} />

              <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="relative block h-auto w-full" aria-hidden="true">
                <defs>
                  <radialGradient id="dial-face" cx="50%" cy="38%" r="70%">
                    <stop offset="0%" stopColor="var(--dial-hi)" />
                    <stop offset="100%" stopColor="var(--dial-lo)" />
                  </radialGradient>
                </defs>

                <circle cx={C} cy={C} r={306} fill="url(#dial-face)" />
                <circle cx={C} cy={C} r={306} className="dial-rim" />
                <circle cx={C} cy={C} r={292} className="dial-line" />

                {Array.from({ length: MONTHS }, (_, i) => {
                  const a = (i / MONTHS) * 360;
                  const isYear = (i + 8) % 12 === 0;
                  const [x0, y0] = point(isYear ? 254 : 266, a);
                  const [x1, y1] = point(280, a);
                  return (
                    <line
                      key={i}
                      ref={(el) => {
                        tickRefs.current[i] = el;
                      }}
                      x1={x0}
                      y1={y0}
                      x2={x1}
                      y2={y1}
                      className={isYear ? "tick tick-year" : "tick"}
                      data-on="false"
                      style={{ transitionDelay: visible ? `${i * 12}ms, 0ms` : "0ms" }}
                    />
                  );
                })}

                {[2023, 2024, 2025, 2026, 2027].map((y) => {
                  const [x, yy] = point(236, angleAt(y));
                  return (
                    <text key={y} x={x} y={yy} className="dial-year" data-on={t >= y} dominantBaseline="middle" textAnchor="middle">
                      {y}
                    </text>
                  );
                })}
                <text x={C} y={C - 236} className="dial-start" dominantBaseline="middle" textAnchor="middle">
                  SEP ’22
                </text>

                <circle cx={C} cy={C} r={RING.edu} className="ring-track" />
                <circle cx={C} cy={C} r={RING.work} className="ring-track" />
                <path d={arc((RING.edu + RING.work) / 2, nowAngle, 360)} className="ring-future" />

                {milestones.map((item, i) => (
                  <path
                    key={item.id}
                    ref={(el) => {
                      arcRefs.current[i] = el;
                    }}
                    className={`ring-arc ring-${item.kind} ring-${item.id}`}
                  />
                ))}

                {milestones.map((item, i) => {
                  const [x, y] = point(292, angleAt(item.from));
                  return (
                    <g key={item.id} className="dial-marker" data-on={i < reached} data-active={i === activeIndex}>
                      <circle cx={x} cy={y} r={13} className="marker-pulse" />
                      <circle cx={x} cy={y} r={6} className={`marker-dot marker-${item.kind}`} />
                    </g>
                  );
                })}

                <g ref={handRef}>
                  <line x1={C} y1={C + 36} x2={C} y2={C - 270} className="hand" />
                  <circle cx={C} cy={C - 270} r={6} className="hand-tip" />
                </g>

                <g className="second-hand">
                  <line x1={C} y1={C + 46} x2={C} y2={C - 296} />
                </g>
              </svg>

              <div className="dial-core">
                <span className="dial-month">{atNow ? "TODAY" : monthName}</span>
                <span className="odo" aria-label={String(year)}>
                  {String(year)
                    .split("")
                    .map((d, i) => (
                      <Digit key={i} value={Number(d)} />
                    ))}
                </span>
                <span className="dial-label" data-kind={active.kind}>
                  {reached ? active.org : "Start"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-5 font-[family-name:var(--font-dm-mono)] text-[11px] text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-2">
                <i className="legend legend-edu" /> Education
              </span>
              <span className="inline-flex items-center gap-2">
                <i className="legend legend-work" /> Work
              </span>
            </div>
          </div>

          <div className="path-mobile lg:hidden" key={active.id}>
            <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[var(--text-muted)]">
              {String(activeIndex + 1).padStart(2, "0")} / {String(milestones.length).padStart(2, "0")} · {active.period}
            </p>
            <p className="mt-1 text-[17px] font-semibold leading-snug">{active.title}</p>
            <p className="text-[13px] text-[var(--text-secondary)]">{active.org}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
