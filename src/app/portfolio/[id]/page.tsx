"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, KeyRound } from "lucide-react";
import { getProject } from "@/data/site";
import AnimatedBackground from "@/components/AnimatedBackground";
import CopyCode from "@/components/ui/CopyCode";
import ProjectLenses from "@/components/ui/ProjectLenses";

type Pane = "look" | "worked";

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const project = getProject(String(id));
  const [activeShot, setActiveShot] = useState(0);
  const [pane, setPane] = useState<Pane>("look");

  const panes = useMemo(() => {
    return [
      { id: "look" as const, label: "Look" },
      { id: "worked" as const, label: "How I worked" },
    ];
  }, [project?.id]);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Project not found.
      </div>
    );
  }

  const tech = project.technologies.split(",").map((item) => item.trim()).filter(Boolean);
  const features = project.key_features.split(",").map((item) => item.trim()).filter(Boolean);
  const gallery = project.image_urls.length ? project.image_urls : [project.image_url];
  const contain = project.imageFit === "contain";

  const handleBack = () => {
    sessionStorage.setItem("skipIntroOnce", "true");
    router.push("/#portfolio");
  };

  const onPaneKey = (event: KeyboardEvent, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = event.key === "ArrowRight" ? (index + 1) % panes.length : (index - 1 + panes.length) % panes.length;
    setPane(panes[next].id);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip px-6 py-8 pb-16 text-white md:px-10 lg:px-16">
      <AnimatedBackground />
      <div className="relative z-10 mx-auto max-w-6xl">
        <button
          type="button"
          onClick={handleBack}
          className="mb-8 inline-flex items-center gap-2 border-0 bg-transparent text-[13px] text-white/50 hover:text-white"
        >
          <ArrowLeft size={14} />
          Work
        </button>

        <p className="mb-3 font-[family-name:var(--font-dm-mono)] text-[12px] tracking-[0.18em] text-[var(--text-muted)]">
          {project.category}
        </p>
        <h1 className="mb-4 max-w-[34rem] text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.05] tracking-tight">
          {project.title}
        </h1>
        <p className="mb-6 max-w-[36rem] text-[15px] leading-[1.8] text-[var(--text-secondary)]">{project.description}</p>

        <div className="mb-8 flex flex-wrap gap-3">
          {project.live_url ? (
            <a
              href={project.live_url}
              target={project.live_url.startsWith("/") ? undefined : "_blank"}
              rel={project.live_url.startsWith("/") ? undefined : "noopener noreferrer"}
              className="btn-primary no-underline"
            >
              {project.live_url.startsWith("/") ? "Open demo" : "Open site"}
              <ArrowUpRight size={15} />
            </a>
          ) : null}
          {project.github_url ? (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost no-underline"
            >
              GitHub
              <ArrowUpRight size={15} />
            </a>
          ) : null}
        </div>

        <div className="mb-3 flex justify-start">
          <div className="surface flex w-full max-w-xl gap-1 rounded-full p-1.5" role="tablist" aria-label="Project views">
            {panes.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={pane === item.id}
                tabIndex={pane === item.id ? 0 : -1}
                onClick={() => setPane(item.id)}
                onKeyDown={(event) => onPaneKey(event, index)}
                className={`flex-1 rounded-full py-2.5 text-sm transition-colors duration-200 ${
                  pane === item.id
                    ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                    : "text-[var(--text-muted)] hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mb-8 text-[12px] text-[var(--text-muted)]">The grid below switches. Nothing is tucked under a long scroll.</p>

        {pane === "look" ? (
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div className="max-w-[34rem]">
              {project.access ? (
                <div className="surface mb-8 rounded-2xl p-5">
                  <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold">
                    <KeyRound size={15} />
                    {project.access.title}
                  </p>
                  <p className="mb-4 text-[13px] leading-relaxed text-white/60">{project.access.detail}</p>
                  <div className="grid gap-2">
                    {project.access.codes?.map((code) => (
                      <CopyCode
                        key={`${code.label}-${code.value}`}
                        label={code.label}
                        value={code.value}
                        hint={code.hint}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {tech.length > 0 ? (
                <div>
                  <p className="mb-3 text-[13px] font-semibold">Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {tech.map((item) => (
                      <span key={item} className="surface rounded-full px-3 py-1.5 text-[12px] text-white/75">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div>
              <div
                className={`mb-3 overflow-hidden rounded-[26px] border border-white/10 ${
                  contain ? "bg-[#ecece8]" : ""
                }`}
              >
                <img
                  src={gallery[activeShot]}
                  alt=""
                  className={
                    contain
                      ? "mx-auto max-h-[420px] w-full object-contain object-top"
                      : "h-[240px] w-full object-cover object-top md:h-[320px]"
                  }
                />
              </div>
              {gallery.length > 1 ? (
                <div className="mb-5 grid grid-cols-4 gap-2">
                  {gallery.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveShot(index)}
                      className={`overflow-hidden rounded-xl border p-0 ${
                        contain ? "bg-[#ecece8]" : ""
                      } ${index === activeShot ? "border-[var(--accent)]" : "border-white/10"}`}
                    >
                      <img
                        src={src}
                        alt=""
                        className={
                          contain
                            ? "h-16 w-full object-contain object-top md:h-20"
                            : "h-14 w-full object-cover object-top md:h-16"
                        }
                      />
                    </button>
                  ))}
                </div>
              ) : null}
              <div className="surface rounded-3xl p-5">
                <p className="mb-4 text-sm font-semibold">What’s in it</p>
                <ul className="space-y-2.5 text-[13px] leading-6 text-white/65">
                  {features.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="text-[var(--accent)]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {pane === "worked" && project.lenses ? <ProjectLenses lenses={project.lenses} embedded /> : null}
      </div>
    </div>
  );
}
