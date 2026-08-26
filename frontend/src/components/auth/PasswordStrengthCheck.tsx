import { motion, AnimatePresence } from 'framer-motion';

interface PasswordStrengthCheckProps {
  password: string;
  isVisible: boolean;
}

export default function PasswordStrengthCheck({ password, isVisible }: PasswordStrengthCheckProps) {
  const reqs = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'Number', valid: /[0-9]/.test(password) },
    { label: 'Special character', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const passedCount = reqs.filter((r) => r.valid).length;

  const getStrengthInfo = () => {
    if (!password) return { label: 'Enter password', color: 'bg-surface-2', textColor: 'text-ink-muted', pct: 0 };
    if (passedCount <= 1) return { label: 'Weak', color: 'bg-danger', textColor: 'text-danger', pct: 25 };
    if (passedCount === 2) return { label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-500', pct: 50 };
    if (passedCount === 3) return { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-500', pct: 75 };
    return { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500', pct: 100 };
  };

  const strength = getStrengthInfo();

  return (
    <AnimatePresence>
      {(isVisible || password.length > 0) && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="overflow-hidden space-y-2.5 p-3.5 rounded-xl bg-surface/60 border border-line/60 backdrop-blur-sm text-xs"
        >
          {/* Progress Bar & Label */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-ink-muted font-medium">Password Strength</span>
            <span className={`font-semibold ${strength.textColor} transition-colors duration-300`}>
              {strength.label}
            </span>
          </div>

          {/* Strength Bar */}
          <div className="h-1.5 w-full bg-line/60 rounded-full overflow-hidden flex gap-1 p-0.5">
            {[1, 2, 3, 4].map((step) => {
              const isActive = passedCount >= step;
              return (
                <div
                  key={step}
                  className={`h-full flex-1 rounded-full transition-all duration-300 ${
                    isActive ? strength.color : 'bg-surface-2 dark:bg-line/40'
                  }`}
                />
              );
            })}
          </div>

          {/* Animated Checklist */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {reqs.map((req, idx) => (
              <motion.div
                key={req.label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-1.5 text-[11px]"
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                    req.valid
                      ? 'bg-emerald-500 text-white scale-105'
                      : 'bg-surface-2 text-ink-faint border border-line'
                  }`}
                >
                  <svg className="w-2.5 h-2.5 stroke-current stroke-[3]" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className={req.valid ? 'text-ink font-medium' : 'text-ink-muted'}>{req.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
