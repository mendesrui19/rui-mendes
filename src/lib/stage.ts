// Shared, mutable scroll/pointer state read by the WebGL scene every frame.
// Kept outside React so scrolling never triggers a re-render.
export const stage = {
  value: 0,
  pointer: { x: 0, y: 0 },
};

export const STAGES = ["home", "work", "skills", "path", "contact"] as const;

// Continuous stage index: section i takes over as its top travels
// from 70% to 10% of the viewport height.
export function readStage() {
  const h = window.innerHeight;
  let value = 0;
  for (let i = 1; i < STAGES.length; i++) {
    const el = document.querySelector<HTMLElement>(`[data-stage="${STAGES[i]}"]`);
    if (!el) continue;
    const top = el.getBoundingClientRect().top;
    value += Math.min(1, Math.max(0, (h * 0.7 - top) / (h * 0.6)));
  }
  return value;
}
