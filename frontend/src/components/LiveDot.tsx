export default function LiveDot({ label = 'Live' }: { label?: string }) {
  return (
    <span className="live-pill" title="Updates automatically">
      <span className="live-dot" aria-hidden />
      <span>{label}</span>
    </span>
  );
}
