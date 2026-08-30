import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Skeleton, StatCard, AnimatedSection } from '../components/ui';
import { api, getErrorMessage } from '../lib/api';
import { staggerContainer, fadeUp } from '../lib/motion';
import { Users, Briefcase, FileText, Shield } from 'lucide-react';

interface AdminOverview {
  users: number;
  candidates: number;
  recruiters: number;
  openJobs: number;
  applications: number;
}

export default function AdminPage() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: overview } = await api.get<AdminOverview>('/api/admin/overview');
        if (!cancelled) setData(overview);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <AnimatedSection>
        <header>
          <p className="text-label">Admin</p>
          <h1 className="text-h1 text-ink">Platform overview</h1>
        </header>
      </AnimatedSection>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-danger"
        >
          {error}
        </motion.p>
      )}
      {data && (
        <motion.div
          variants={staggerContainer(0.07)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <motion.div variants={fadeUp}>
            <StatCard icon={<Users size={22} />} label="Users" value={String(data.users)} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard icon={<Shield size={22} />} label="Candidates" value={String(data.candidates)} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard icon={<Briefcase size={22} />} label="Open jobs" value={String(data.openJobs)} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard icon={<FileText size={22} />} label="Applications" value={String(data.applications)} />
          </motion.div>
        </motion.div>
      )}
      {data && (
        <AnimatedSection delay={0.3}>
          <p className="text-sm text-ink-muted">Recruiters registered: {data.recruiters}</p>
        </AnimatedSection>
      )}
    </div>
  );
}
