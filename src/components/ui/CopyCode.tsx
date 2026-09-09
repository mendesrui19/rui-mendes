"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  label: string;
  value: string;
  hint?: string;
};

export default function CopyCode({ label, value, hint }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="surface flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left"
    >
      <span className="min-w-0">
        <span className="block font-[family-name:var(--font-dm-mono)] text-[11px] tracking-[0.08em] text-white/45">
          {label}
        </span>
        <span className="block truncate text-[14px] font-semibold">{value}</span>
        {hint ? <span className="block text-[11px] text-white/40">{hint}</span> : null}
      </span>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/70">
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </span>
    </button>
  );
}
