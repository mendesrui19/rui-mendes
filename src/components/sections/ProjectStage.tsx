"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/site";
import CopyCode from "@/components/ui/CopyCode";

type Props = {
  project: Project;
  compact?: boolean;
};

const SHOT_MS = 3200;
const ease = [0.22, 1, 0.36, 1] as const;

function shotsOf(project: Project) {
  return Array.from(new Set([project.image_url, ...project.image_urls]));
}

function hostOf(project: Project) {
  const url = project.live_url ?? project.github_url ?? "";
  if (!url || url.startsWith("/")) return url;
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default function ProjectStage({ project, compact = false }: Props) {
  const reduce = useReducedMotion();
  const shots = shotsOf(project);
  const [shot, setShot] = useState({ id: project.id, index: 0 });
  const [paused, setPaused] = useState(false);
  const index = shot.id === project.id ? shot.index : 0;
  const contain = project.imageFit === "contain";
  const code = project.access?.codes?.[0];

  useEffect(() => {
    if (reduce || paused || shots.length < 2) return;
    const timer = window.setInterval(() => {
      setShot((current) => ({
        id: project.id,
        index: ((current.id === project.id ? current.index : 0) + 1) % shots.length,
      }));
    }, SHOT_MS);
    return () => window.clearInterval(timer);
  }, [project.id, shots.length, paused, reduce]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="browser-frame">
        <div className="browser-bar">
          <span className="browser-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="browser-url">{hostOf(project)}</span>
        </div>

        <div className={`relative overflow-hidden ${compact ? "aspect-[16/10]" : "aspect-[16/9.5]"} ${contain ? "bg-[#ecece8]" : "bg-black/40"}`}>
          <AnimatePresence initial={false}>
            <motion.img
              key={`${project.id}-${index}`}
              src={shots[index]}
              alt={`${project.title} screenshot ${index + 1}`}
              className={`absolute inset-0 h-full w-full ${contain ? "object-contain object-top p-3" : "object-cover object-top"}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease }}
            />
          </AnimatePresence>

          {shots.length > 1 && (
            <div className="absolute inset-x-0 bottom-0 flex gap-1.5 p-3">
              {shots.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Show screenshot ${i + 1}`}
                  onClick={() => setShot({ id: project.id, index: i })}
                  className="shot-dot"
                  data-active={i === index}
                >
                  {i === index && !reduce && !paused && (
                    <span className="shot-fill" style={{ animationDuration: `${SHOT_MS}ms` }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          className={compact ? "pt-5" : "pt-6"}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease }}
        >
          {!compact && (
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">{project.title}</h3>
              <span className="font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.16em] text-[var(--text-muted)]">
                {project.category.toUpperCase()}
              </span>
            </div>
          )}
          <p className="max-w-2xl text-[14px] leading-relaxed text-[var(--text-secondary)]">{project.description}</p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {project.technologies.split(",").map((tech, i) => (
              <motion.li
                key={tech}
                className="tech-chip"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 + i * 0.04 }}
              >
                {tech.trim()}
              </motion.li>
            ))}
          </ul>

          {code && (
            <div className="mt-4 max-w-sm">
              <CopyCode label={code.label} value={code.value} hint={code.hint} />
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.live_url && (
              <a
                href={project.live_url}
                target={project.live_url.startsWith("/") ? undefined : "_blank"}
                rel={project.live_url.startsWith("/") ? undefined : "noopener noreferrer"}
                className="btn-primary no-underline"
              >
                Open site <ArrowUpRight size={16} />
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-ghost no-underline">
                GitHub <ArrowUpRight size={16} />
              </a>
            )}
            <Link href={`/portfolio/${project.id}`} className="project-details no-underline">
              Case study →
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
