import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ExpandableCardProps {
  id?: string;
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  tag?: string;
  content?: ReactNode;
}

export default function ExpandableProfileCard({
  id,
  imageSrc = "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1000",
  title = "Jane Doe",
  subtitle = "Senior Java Architect",
  tag = "Featured Mentor",
  content
}: ExpandableCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const layoutId = id || `expandable-profile-card-${title.toLowerCase().replace(/\s+/g, '-')}`;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <motion.div
        layoutId={layoutId}
        onClick={() => setIsOpen(true)}
        className="cursor-pointer relative h-64 w-full overflow-hidden rounded-2xl border border-line/80 group shadow-md hover:shadow-xl transition-shadow bg-surface-2"
        whileHover="hover"
      >
        <motion.img 
          layoutId={`image-${layoutId}`} 
          src={imageSrc} 
          alt={title}
          className="absolute inset-0 h-full w-full object-cover" 
          variants={{
            hover: { scale: 1.06 }
          }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-85 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-full bg-brand/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
            {tag}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 p-5 sm:p-6 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <motion.p layoutId={`subtitle-${layoutId}`} className="text-amber-300 text-xs font-semibold tracking-wide uppercase mb-1">
            {subtitle}
          </motion.p>
          <motion.h3 layoutId={`title-${layoutId}`} className="text-lg sm:text-xl font-bold font-display tracking-tight text-white">
            {title}
          </motion.h3>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              layoutId={layoutId}
              className="relative w-full max-w-4xl h-[85vh] max-h-[640px] bg-surface rounded-3xl overflow-hidden border border-line/80 z-10 flex flex-col md:flex-row shadow-2xl"
            >
              <button 
                type="button"
                onClick={() => setIsOpen(false)} 
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center bg-black/60 hover:bg-black/80 rounded-full border border-white/20 text-white transition-colors backdrop-blur-md cursor-pointer"
                aria-label="Close modal"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
              
              <div className="relative h-60 w-full shrink-0 overflow-hidden md:h-full md:w-1/2">
                <motion.img 
                  layoutId={`image-${layoutId}`} 
                  src={imageSrc} 
                  alt={title}
                  className="h-full w-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:hidden" />
              </div>
              
              <div className="p-6 sm:p-8 w-full md:w-1/2 flex flex-col h-full overflow-y-auto custom-scrollbar">
                <motion.p layoutId={`subtitle-${layoutId}`} className="text-brand text-xs font-bold tracking-wide uppercase mb-2">
                  {subtitle}
                </motion.p>
                <motion.h3 layoutId={`title-${layoutId}`} className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-ink mb-4 pb-3 border-b border-line">
                  {title}
                </motion.h3>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: 0.15 }}
                  className="text-ink-muted text-sm leading-relaxed grow space-y-4"
                >
                  {content || (
                    <div className="flex flex-col gap-5">
                      <p className="text-ink">
                        Passionate Java Architect with over 8 years of experience building high-throughput, distributed enterprise systems using Spring Boot 3, Kafka, and Kubernetes.
                      </p>
                      
                      <div className="space-y-1">
                        <h4 className="text-ink font-bold text-sm tracking-tight">Background & Expertise</h4>
                        <p className="text-ink-muted text-xs leading-relaxed">
                          Previously led core banking backend teams, specializing in reactive JVM architectures, zero-downtime microservices deployments, and high-concurrency event streaming.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-ink font-bold text-sm tracking-tight">Career Mentorship Focus</h4>
                        <p className="text-ink-muted text-xs leading-relaxed">
                          Helping candidate engineers master Spring Security, Jaccard AI skill-matching metrics, and system design interviews for top enterprise tech roles.
                        </p>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="mt-2 px-5 py-2.5 bg-brand text-white font-semibold text-xs rounded-xl hover:bg-brand/90 transition-all self-start shadow-md cursor-pointer"
                      >
                        Connect & Explore Roles
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
