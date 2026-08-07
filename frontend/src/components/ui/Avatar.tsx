export default function Avatar({
  name,
  size = 36,
}: {
  name?: string | null;
  size?: number;
}) {
  const initials = (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        fontSize: Math.max(11, size * 0.34),
        background: 'var(--gradient-primary)',
      }}
      aria-hidden={!name}
    >
      {initials || '?'}
    </span>
  );
}
