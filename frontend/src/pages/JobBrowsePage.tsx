import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, IndianRupee, Sparkles, Search, Filter, Bookmark } from 'lucide-react';
import PressButton from '../components/PressButton';
import LiveDot from '../components/LiveDot';
import { EmptyState, TiltCard, RibbonBadge, SectionRevealContainer, ErrorBoundary, ViewportReveal } from '../components/ui';
import MaskedHeading from '../components/reactbits/MaskedHeading';
import { useLivePoll } from '../hooks/useLivePoll';
import { jobsApi, type Job } from '../lib/jobsApi';
import { CircularGallerySection } from '../components/CircularGallerySection';

const QUICK_FILTERS = ['All Roles', 'Java 21', 'Spring Boot 3', 'Microservices', 'Remote', 'Kafka'];

export default function JobBrowsePage() {
  const [page, setPage] = useState(0);
  const [q, setQ] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Roles');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  const { data, loading, error, updatedAt, refresh } = useLivePoll(
    async () => {
      const res = await jobsApi.listOpen(page, 20);
      return res.data;
    },
    20_000,
    true
  );

  useEffect(() => {
    void refresh(false);
  }, [page, refresh]);

  const jobs: Job[] = data?.content || [];
  const totalPages = data?.totalPages || 0;

  const filtered = jobs.filter((j) => {
    const queryMatch =
      !q.trim() ||
      j.title?.toLowerCase().includes(q.toLowerCase()) ||
      j.requiredSkills?.toLowerCase().includes(q.toLowerCase()) ||
      j.location?.toLowerCase().includes(q.toLowerCase());

    const chipMatch =
      activeFilter === 'All Roles' ||
      j.title?.toLowerCase().includes(activeFilter.toLowerCase()) ||
      j.requiredSkills?.toLowerCase().includes(activeFilter.toLowerCase()) ||
      j.location?.toLowerCase().includes(activeFilter.toLowerCase());

    return queryMatch && chipMatch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Reveal — Phase 6 Spec */}
      <ViewportReveal delay={0.05} yOffset={24}>
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/60 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-muted/60 text-brand text-[11px] font-semibold uppercase tracking-wider">
                Career Marketplace
              </span>
              <LiveDot />
            </div>
            <ErrorBoundary fallback={<h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Enterprise Java Roles</h1>}>
              <MaskedHeading
                text="Enterprise Java Roles"
                tag="h1"
                reveal="rise"
                trigger="view"
                duration={0.9}
                stagger={0.08}
                align="left"
                textScale={0.075}
              />
            </ErrorBoundary>
            {updatedAt && (
              <p className="text-xs text-ink-muted">
                Live matching synced at {updatedAt.toLocaleTimeString()}
              </p>
            )}
          </div>
          <PressButton variant="ghost" onClick={() => void refresh(false)} className="self-start sm:self-auto">
            Refresh Marketplace
          </PressButton>
        </header>
      </ViewportReveal>

      {/* WebGL Open Roles Circular Gallery Carousel — React Bits Integration */}
      <ViewportReveal delay={0.1} yOffset={20}>
        <CircularGallerySection bend={1.4} scrollSpeed={0.006} scrollEase={0.07} />
      </ViewportReveal>

      {/* Search & Filter Bar */}
      <SectionRevealContainer effect="spread" delayMs={100}>
      <div className="space-y-4">
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            className="ui-input !pl-10 !pr-4 !py-3 w-full rounded-xl bg-surface/90 border-line shadow-xs focus:ring-2 focus:ring-brand/30"
            placeholder="Search by role title, skill (e.g. Spring Boot), location..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold text-ink-muted flex items-center gap-1 pr-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>
          {QUICK_FILTERS.map((chip) => (
            <motion.button
              key={chip}
              type="button"
              onClick={() => setActiveFilter(chip)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === chip
                  ? 'bg-brand text-white shadow-xs'
                  : 'bg-surface-2/90 border border-line/80 text-ink-muted hover:text-ink'
              }`}
            >
              {chip}
            </motion.button>
          ))}
        </div>
      </div>
    </SectionRevealContainer>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-danger flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}
      {loading && !data ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="relative overflow-hidden rounded-2xl border border-line p-6 bg-surface/70 space-y-4">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 dark:via-white/5 to-transparent animate-[shimmer_1.5s_infinite] -translate-x-full" />
              <div className="h-6 w-1/3 bg-surface-2 rounded-lg" />
              <div className="h-4 w-1/2 bg-surface-2 rounded-lg" />
              <div className="h-3 w-3/4 bg-surface-2 rounded-lg" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No matching roles found" description="Try clearing your search or selecting a different filter chip." />
      ) : (
        /* Phase 6 Staggered Job Cards Container */
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 1 },
            visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
          }}
          className="space-y-4"
        >
          {filtered.map((job, idx) => {
            const skillsList = job.requiredSkills ? job.requiredSkills.split(',').map((s) => s.trim()) : [];
            const isTopMatch = (job.jobQualityScore && job.jobQualityScore >= 85) || idx === 0;
            const isSaved = savedJobs.includes(job.id);

            return (
              <motion.div
                key={job.id}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.98 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <TiltCard className="group relative rounded-2xl border border-line/80 bg-surface/90 p-6 backdrop-blur-xl shadow-md hover:shadow-xl hover:border-brand/40 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {isTopMatch && <RibbonBadge label={idx === 0 ? 'Top Match' : 'Featured'} variant={idx === 0 ? 'match' : 'featured'} />}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/candidate/jobs/${job.id}`} className="text-xl font-bold font-display text-ink group-hover:text-brand transition-colors">
                          {job.title}
                        </Link>
                        <p className="text-sm font-medium text-ink-muted mt-1 flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-ink">{job.companyName || job.recruiterName || 'Enterprise Partner'}</span>
                          <span className="text-line">•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-brand" /> {job.location || 'Remote'}
                          </span>
                          <span className="text-line">•</span>
                          <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            <IndianRupee className="w-3.5 h-3.5" /> {job.salaryRange || 'Competitive'}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {job.jobQualityScore && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1 whitespace-nowrap">
                            <Sparkles className="w-3.5 h-3.5" /> {job.jobQualityScore}% Match
                          </span>
                        )}
                        {/* Save / Bookmark Button with Press Feedback */}
                        <motion.button
                          type="button"
                          onClick={() => setSavedJobs((prev) => prev.includes(job.id) ? prev.filter((x) => x !== job.id) : [...prev, job.id])}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.88 }}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            isSaved
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                              : 'bg-surface-2/80 border-line text-ink-muted hover:text-ink'
                          }`}
                          title={isSaved ? 'Remove from saved' : 'Save role'}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        </motion.button>
                      </div>
                    </div>

                    <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">{job.description}</p>

                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {skillsList.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-md bg-surface-2 border border-line/70 text-[11px] font-medium text-ink-muted"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center justify-between md:justify-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-line/60 md:pl-6 md:border-l">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                      <Link
                        to={`/candidate/jobs/${job.id}`}
                        className="block w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand text-white font-semibold text-xs text-center shadow-md hover:bg-brand-hover transition-colors cursor-pointer"
                      >
                        View Role
                      </Link>
                    </motion.div>
                    <span className="text-[11px] text-ink-faint whitespace-nowrap">{job.requiredExperienceYears || 3}+ yrs exp</span>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <PressButton variant="ghost" disabled={page <= 0} onClick={() => setPage((p) => p - 1)}>
            Previous
          </PressButton>
          <span className="text-xs font-semibold text-ink-muted">
            Page {page + 1} of {totalPages}
          </span>
          <PressButton variant="ghost" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </PressButton>
        </div>
      )}
    </div>
  );
}

