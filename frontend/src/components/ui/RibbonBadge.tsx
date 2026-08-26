import { Sparkles, Flame, Star } from 'lucide-react';

interface RibbonBadgeProps {
  label: string;
  variant?: 'match' | 'urgent' | 'featured';
}

export function RibbonBadge({ label, variant = 'match' }: RibbonBadgeProps) {
  const variantConfig = {
    match: {
      icon: <Sparkles className="w-3 h-3" />,
      bg: 'bg-gradient-to-r from-brand to-violet-600 text-white',
    },
    urgent: {
      icon: <Flame className="w-3 h-3 text-amber-300" />,
      bg: 'bg-gradient-to-r from-rose-500 to-amber-500 text-white',
    },
    featured: {
      icon: <Star className="w-3 h-3 text-cyan-200" />,
      bg: 'bg-gradient-to-r from-cyan-600 to-brand text-white',
    },
  }[variant];

  return (
    <div
      className={`absolute -top-3 right-4 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-md z-10 ${variantConfig.bg}`}
    >
      {variantConfig.icon}
      <span>{label}</span>
    </div>
  );
}
