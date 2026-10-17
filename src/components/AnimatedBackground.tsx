export default function AnimatedBackground() {
  return (
    <div className="site-bg" aria-hidden="true">
      <span className="bg-grid" />
      <span className="bg-glow bg-glow-a" />
      <span className="bg-glow bg-glow-b" />
    </div>
  );
}
