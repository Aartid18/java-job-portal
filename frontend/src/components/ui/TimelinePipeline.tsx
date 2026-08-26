import { motion } from 'framer-motion';

export interface TimelineItem {
  id: string | number;
  title: string;
  subtitle?: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
}

export function TimelinePipeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-line">
      {items.map((item, idx) => {
        const isDone = item.status === 'completed';
        const isCurrent = item.status === 'current';

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="relative flex items-start gap-4"
          >
            {/* Animated Marker Dot */}
            <div
              className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                isDone
                  ? 'bg-brand border-brand text-white shadow-xs'
                  : isCurrent
                  ? 'bg-surface border-brand text-brand ring-4 ring-brand/20'
                  : 'bg-surface border-line text-ink-faint'
              }`}
            >
              {isDone && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              {isCurrent && <span className="w-2 h-2 rounded-full bg-brand animate-ping" />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className={`text-sm font-semibold ${isCurrent ? 'text-brand font-bold' : 'text-ink'}`}>
                  {item.title}
                </h4>
                {item.date && <span className="text-[11px] text-ink-faint">• {item.date}</span>}
              </div>
              {item.subtitle && <p className="text-xs text-ink-muted leading-relaxed">{item.subtitle}</p>}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
