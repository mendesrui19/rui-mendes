"use client";

import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Project } from "@/data/site";
import CopyCode from "@/components/ui/CopyCode";

type Props = {
  project: Project;
  featured?: boolean;
  hits?: string[];
};

export default function PortfolioCard({ project, featured = false, hits }: Props) {
  const router = useRouter();
  const primaryCode = project.access?.codes?.[0];
  const contain = project.imageFit === "contain";

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/portfolio/${project.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/portfolio/${project.id}`);
        }
      }}
      className={`surface group relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-[24px] text-left ${
        featured ? "md:flex-row" : ""
      }`}
    >
      <div
        className={`overflow-hidden border-b border-white/10 ${
          contain ? "bg-[#ecece8]" : "bg-white/[0.03]"
        } ${
          featured
            ? "h-56 md:h-auto md:min-h-[280px] md:w-[46%] md:border-r md:border-b-0"
            : "h-44"
        }`}
      >
        <img
          src={project.image_url}
          alt=""
          className={`h-full w-full transition duration-500 ${
            contain
              ? "object-contain object-top p-3 group-hover:scale-[1.02]"
              : "object-cover group-hover:scale-[1.04]"
          }`}
        />
      </div>

      <div className={`flex flex-1 flex-col p-5 ${featured ? "md:p-8" : ""}`}>
        <p className="mb-2 font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.16em] text-[var(--text-muted)]">
          {project.category}
        </p>
        <h3 className={`mb-2 font-semibold leading-tight ${featured ? "text-[28px]" : "text-[17px]"}`}>
          {project.title}
        </h3>
        <p className="line-clamp-3 text-[13px] leading-relaxed text-[var(--text-secondary)]">{project.description}</p>
        {hits && hits.length > 0 ? (
          <p className="mt-3 font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.04em] text-[var(--accent)]">
            matched · {hits.join(" · ")}
          </p>
        ) : null}

        {primaryCode ? (
          <div className="mt-4 max-w-sm" onClick={(event) => event.stopPropagation()}>
            <CopyCode label={primaryCode.label} value={primaryCode.value} hint={primaryCode.hint} />
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
          {project.live_url ? (
            <a
              href={project.live_url}
              target={project.live_url.startsWith("/") ? undefined : "_blank"}
              rel={project.live_url.startsWith("/") ? undefined : "noopener noreferrer"}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[13px] text-[var(--accent)] no-underline"
            >
              {project.live_url?.startsWith("/") ? "Open demo" : "Open site"}
              <ArrowUpRight size={14} />
            </a>
          ) : null}
          {project.github_url ? (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[13px] text-[var(--text-muted)] no-underline hover:text-white"
            >
              GitHub
              <ArrowUpRight size={14} />
            </a>
          ) : null}
          <span className="ml-auto text-[12px] text-[var(--text-muted)]">Details →</span>
        </div>
      </div>
    </article>
  );
}
