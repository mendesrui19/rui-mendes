"use client";

import { type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";

const spring = { stiffness: 180, damping: 18, mass: 0.5 };

// Rotates its content in 3D toward the cursor, with a soft light glare.
// With `scrollTilt`, it also starts turned in perspective and flattens as the page scrolls.
export default function Tilt({
  children,
  max = 8,
  scrollTilt = false,
  className = "",
}: {
  children: ReactNode;
  max?: number;
  scrollTilt?: boolean;
  className?: string;
}) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hover = useMotionValue(0);
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const glareOpacity = useSpring(hover, { stiffness: 200, damping: 30 });

  const { scrollY } = useScroll();
  const flatten = useSpring(useTransform(scrollY, [0, 520], [1, 0], { clamp: true }), { stiffness: 90, damping: 22 });

  const rotateY = useTransform(() => sx.get() * max * 2 + (scrollTilt ? -20 * flatten.get() : 0));
  const rotateX = useTransform(() => -sy.get() * max * 2 + (scrollTilt ? 9 * flatten.get() : 0));
  const gx = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const gy = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgb(255 255 255 / 0.12), transparent 55%)`;

  return (
    <motion.div
      className={`tilt ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
        hover.set(1);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
        hover.set(0);
      }}
    >
      {children}
      <motion.span className="tilt-glare" style={{ background: glare, opacity: glareOpacity }} aria-hidden="true" />
    </motion.div>
  );
}
