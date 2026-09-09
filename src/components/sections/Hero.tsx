"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { education, site } from "@/data/site";

const Lanyard = dynamic(() => import("@/components/lanyard/Lanyard"), {
  ssr: false,
});

type HeroProps = {
  showApp: boolean;
};

export default function Hero({ showApp }: HeroProps) {
  const [startAnim, setStartAnim] = useState(true);

  useEffect(() => {
    const introDone =
      sessionStorage.getItem("introPlayed") === "true" ||
      sessionStorage.getItem("heroPlayed") === "true";

    if (introDone) {
      setStartAnim(true);
      return;
    }

    const delay = 2800;
    const textTimer = setTimeout(() => setStartAnim(true), delay);
    const appTimer = setTimeout(() => {
      sessionStorage.setItem("heroPlayed", "true");
    }, delay + 800);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(appTimer);
    };
  }, []);

  const scrollToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden">
      {showApp && (
        <div className="pointer-events-none absolute inset-0 z-[4] hidden lg:block">
          <ErrorBoundary>
            <Lanyard />
          </ErrorBoundary>
        </div>
      )}

      <div className="page-shell pointer-events-none relative z-10 pt-32 pb-8">
        <div className="flex min-h-[calc(100svh-9rem)] items-center">
          <div className="relative max-w-[32rem] pointer-events-auto">
            <motion.p
              initial={false}
              animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="status-pill mb-4 font-[family-name:var(--font-dm-mono)] text-[12px] tracking-[0.2em]"
            >
              {site.available.toUpperCase()}
            </motion.p>

            <motion.h1
              initial={false}
              animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2.4rem,5.4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.04em]"
            >
              {site.firstName}
              <br />
              {site.lastName}
            </motion.h1>

            <motion.p
              initial={false}
              animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-[32rem] text-[15px] leading-[1.85]"
              style={{ color: "var(--text-secondary)" }}
            >
              {site.about}
            </motion.p>

            <motion.div
              initial={false}
              animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="surface mt-6 max-w-[32rem] rounded-2xl px-5 py-4"
            >
              <div className="grid gap-4">
                {education.map((item) => {
                  const current = item.id === "feup";
                  return (
                    <div
                      key={item.id}
                      className={current ? "" : "border-t border-[var(--border)] pt-4"}
                    >
                      <p
                        className="mb-1 font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.14em]"
                        style={{ color: current ? "var(--accent)" : "var(--text-muted)" }}
                      >
                        {current ? "NOW" : "COMPLETED"}
                      </p>
                      <p className="text-sm leading-snug">{item.title}</p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {item.school}
                        {item.id === "uminho" ? " · 150/200" : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={false}
              animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.55, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary no-underline"
              >
                LinkedIn
                <ArrowUpRight size={15} />
              </a>
              <button type="button" onClick={scrollToPortfolio} className="btn-ghost">
                View projects
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
