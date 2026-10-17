"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

const spring = { stiffness: 120, damping: 24, mass: 0.4 };

// Wraps a section so scrolling feels like a camera moving past it:
// it arrives tilted back in perspective, faces the viewer while it is
// being read, then tips away as it leaves.
export default function ScrollScene({ children, enter = true }: { children: ReactNode; enter?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // 0 → 1 while the section's top travels from the bottom of the screen to 20% from the top.
  const { scrollYProgress: inRaw } = useScroll({ target: ref, offset: ["start end", "start 20%"] });
  // 0 → 1 while its bottom travels from 70% down the screen to the top.
  const { scrollYProgress: outRaw } = useScroll({ target: ref, offset: ["end 70%", "end start"] });
  const pin = useSpring(inRaw, spring);
  const pout = useSpring(outRaw, spring);

  const rotateIn = useTransform(pin, [0, 1], [enter ? 24 : 0, 0]);
  const rotateOut = useTransform(pout, [0, 1], [0, -18]);
  const rotateX = useTransform(() => rotateIn.get() + rotateOut.get());
  const scale = useTransform(() => (enter ? 0.84 + 0.16 * pin.get() : 1) - 0.1 * pout.get());
  const opacity = useTransform(() => (enter ? Math.min(1, pin.get() * 1.6) : 1) * (1 - 0.85 * pout.get()));
  const y = useTransform(() => (enter ? 90 * (1 - pin.get()) : 0) - 40 * pout.get());

  if (reduced) return <div ref={ref}>{children}</div>;

  return (
    <div ref={ref} className="scene">
      <motion.div className="scene-inner" style={{ rotateX, scale, opacity, y }}>
        {children}
      </motion.div>
    </div>
  );
}
