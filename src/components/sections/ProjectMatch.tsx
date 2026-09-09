"use client";

import { Search } from "lucide-react";

const EXAMPLES = ["PWA", "POS", "staff system", "catalogue", "Prolog", "Next.js"];

type Props = {
  query: string;
  onQuery: (value: string) => void;
  resultCount: number;
};

export default function ProjectMatch({ query, onQuery, resultCount }: Props) {
  return (
    <div className="surface mb-6 rounded-2xl p-4 md:p-5">
      <label className="field">
        <span className="field-label">Find a project</span>
        <span className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="PWA, kitchen, Prolog, jewellery…"
            className="field-input"
            style={{ paddingLeft: 40 }}
            autoComplete="off"
            spellCheck={false}
          />
        </span>
      </label>
      <p className="mt-3 text-[12px] leading-relaxed text-[var(--text-muted)]">
        Ranks this work from your text (keyword overlap). Not a generative model.
        {query.trim() ? ` · ${resultCount} match${resultCount === 1 ? "" : "es"}` : ""}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onQuery(item)}
            className={`rounded-full border px-3 py-1 text-[12px] ${
              query === item
                ? "border-[var(--accent)] bg-[color-mix(in_oklch,var(--accent)_14%,transparent)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-muted)] hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
