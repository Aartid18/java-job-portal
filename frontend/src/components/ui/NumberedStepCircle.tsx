import { motion } from 'framer-motion';

export interface StepItem {
  step: number;
  title: string;
  description: string;
}

export function NumberedStepCircle({ steps }: { steps: StepItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
      {/* Connecting Background Line (Desktop) */}
      <div aria-hidden="true" className="hidden md:block absolute top-8 left-12 right-12 h-0.5 bg-line z-0" />

      {steps.map((item, idx) => (
        <motion.div
          key={item.step}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.12 }}
          className="relative z-10 flex flex-col items-center text-center space-y-3 p-4"
        >
          {/* Numbered Badge Circle */}
          <div className="w-14 h-14 rounded-full bg-surface border-2 border-brand text-brand font-display font-extrabold text-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            {item.step}
          </div>
          <h4 className="text-base font-bold text-ink font-display">{item.title}</h4>
          <p className="text-xs text-ink-muted leading-relaxed">{item.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
