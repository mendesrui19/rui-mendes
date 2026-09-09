import type { ProjectLenses } from "@/data/site";

const chapters = [
  {
    key: "management" as const,
    step: "01",
    label: "Owned",
    hint: "Product, people and operations",
  },
  {
    key: "engineering" as const,
    step: "02",
    label: "Built",
    hint: "Architecture and delivery",
  },
  {
    key: "data" as const,
    step: "03",
    label: "Intelligence",
    hint: "Rules, models and learning",
  },
];

type Props = {
  lenses: ProjectLenses;
  embedded?: boolean;
};

export default function ProjectLenses({ lenses, embedded = false }: Props) {
  const visible = chapters.filter((chapter) => (lenses[chapter.key]?.length ?? 0) > 0);
  if (!visible.length) return null;

  const trail = visible.map((chapter) => chapter.label).join(" → ");

  return (
    <section className={embedded ? "" : "mt-12"} aria-labelledby="project-brief-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p
            id="project-brief-title"
            className="font-[family-name:var(--font-dm-mono)] text-[12px] tracking-[0.18em] text-white/40"
          >
            How I worked this
          </p>
          <p className="mt-1 text-[13px] text-white/45">{trail}</p>
        </div>
      </div>

      <div className="surface overflow-hidden rounded-[28px]">
        {visible.map((chapter, index) => (
          <div
            key={chapter.key}
            className={`grid gap-4 px-5 py-6 md:grid-cols-[11rem_1fr] md:gap-10 md:px-7 md:py-7 ${
              index > 0 ? "border-t border-white/10" : ""
            }`}
          >
            <div>
              <p className="font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.16em] text-[var(--accent)]">
                {chapter.step} · {chapter.label}
              </p>
              <p className="mt-1 text-[12px] leading-5 text-white/40">{chapter.hint}</p>
            </div>
            <ul className="space-y-2.5 text-[13px] leading-6 text-white/70">
              {lenses[chapter.key]!.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
