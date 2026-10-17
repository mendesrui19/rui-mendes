"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

export function Panel({
  title,
  meta,
  className = "",
  delay = 0,
  flip = false,
  children,
}: {
  title?: string;
  meta?: ReactNode;
  className?: string;
  delay?: number;
  flip?: boolean;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={`panel ${className}`}
      style={flip ? { transformPerspective: 800, transformOrigin: "50% 100%" } : undefined}
      initial={flip ? { opacity: 0, rotateX: -75, y: 20 } : { opacity: 0, y: 16 }}
      whileInView={flip ? { opacity: 1, rotateX: 0, y: 0 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: flip ? 0.8 : 0.5, delay, ease }}
    >
      {title ? (
        <header className="panel-head">
          <h3>{title}</h3>
          {meta ? <span className="panel-meta">{meta}</span> : null}
        </header>
      ) : null}
      {children}
    </motion.div>
  );
}

export function SectionHead({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <header className="sec-head">
      <p className="sec-kicker">{kicker}</p>
      <h2 className="sec-title">{title}</h2>
      {children ? <p className="sec-lede">{children}</p> : null}
    </header>
  );
}

export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const text = useTransform(count, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 1.1, ease });
    return () => controls.stop();
  }, [inView, count, value]);

  return <motion.span ref={ref}>{text}</motion.span>;
}
