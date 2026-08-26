import { motion } from 'framer-motion';

export interface SkillItem {
  name: string;
  weight?: 'expert' | 'advanced' | 'intermediate';
  matched?: boolean;
}

export function SkillPillCluster({ skills }: { skills: SkillItem[] }) {
  return (
    <div className="flex flex-wrap gap-2.5 items-center">
      {skills.map((skill, idx) => {
        const isMatched = skill.matched ?? true;
        const sizeClasses = {
          expert: 'px-4 py-2 text-sm font-bold shadow-md',
          advanced: 'px-3.5 py-1.5 text-xs font-semibold shadow-xs',
          intermediate: 'px-3 py-1 text-[11px] font-medium opacity-90',
        }[skill.weight || 'advanced'];

        const colorClasses = isMatched
          ? 'bg-brand/10 border-brand/30 text-brand dark:bg-brand/20'
          : 'bg-surface-2 border-line text-ink-muted';

        return (
          <motion.span
            key={skill.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            whileHover={{ scale: 1.08 }}
            className={`rounded-full border transition-all cursor-default select-none ${sizeClasses} ${colorClasses}`}
          >
            {skill.name}
          </motion.span>
        );
      })}
    </div>
  );
}
