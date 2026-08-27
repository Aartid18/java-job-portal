import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import ChromaGrid, { type ChromaGridItem } from './ChromaGrid';
import { jobsApi, type Job } from '../lib/jobsApi';
import { ViewportReveal, Skeleton, ErrorBoundary } from './ui';

function generateJobHeaderSvg(initials: string, title: string, color: string): string {
  const svgWidth = 600;
  const svgHeight = 320;

  const escapeXml = (str: string) =>
    str.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#12131A" />
          <stop offset="100%" stop-color="#1E202E" />
        </linearGradient>

        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${color}" />
          <stop offset="100%" stop-color="${color}88" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bgGrad)" rx="16" />

      <!-- Top Accent Bar -->
      <rect x="0" y="0" width="${svgWidth}" height="6" fill="url(#accentGrad)" />

      <!-- Watermark Company Initials -->
      <text x="560" y="240" font-family="system-ui, sans-serif" font-size="180" font-weight="900" fill="${color}" opacity="0.08" text-anchor="end">
        ${initials}
      </text>

      <!-- Category Pill Badge -->
      <rect x="24" y="32" width="160" height="36" rx="18" fill="${color}22" stroke="${color}66" stroke-width="1.5" />
      <text x="104" y="55" font-family="monospace" font-size="13" font-weight="800" fill="${color}" text-anchor="middle" letter-spacing="1.5">
        FEATURED ROLE
      </text>

      <!-- Job Title Snippet -->
      <text x="24" y="130" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" fill="#FFFFFF">
        ${escapeXml(title.length > 28 ? title.substring(0, 26) + '...' : title)}
      </text>

      <!-- Subtitle Badge Tag -->
      <rect x="24" y="220" width="220" height="44" rx="12" fill="#000000" opacity="0.6" />
      <text x="40" y="248" font-family="sans-serif" font-size="15" font-weight="700" fill="#CBD5E1">
        ✓ Verified Enterprise Job
      </text>
    </svg>
  `.trim();

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}

function mapJobToChromaItem(job: Job): ChromaGridItem {
  let borderColor = '#3B82F6';
  let gradient = 'linear-gradient(145deg, #181C28, #0E111A)';

  const titleLower = job.title.toLowerCase();

  if (titleLower.includes('architect') || titleLower.includes('lead') || titleLower.includes('principal')) {
    borderColor = '#F59E0B'; // Amber
    gradient = 'linear-gradient(145deg, #241A0E, #0E111A)';
  } else if (titleLower.includes('full stack') || titleLower.includes('react') || titleLower.includes('frontend')) {
    borderColor = '#8B5CF6'; // Violet
    gradient = 'linear-gradient(145deg, #201533, #0E111A)';
  } else if (titleLower.includes('microservices') || titleLower.includes('cloud') || titleLower.includes('devops')) {
    borderColor = '#06B6D4'; // Cyan
    gradient = 'linear-gradient(145deg, #0F2530, #0E111A)';
  } else if (titleLower.includes('security') || titleLower.includes('staff') || titleLower.includes('systems')) {
    borderColor = '#10B981'; // Emerald
    gradient = 'linear-gradient(145deg, #0B251B, #0E111A)';
  }

  const companyInitials = (job.companyName || 'Java Enterprise')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 3)
    .toUpperCase();

  const image = generateJobHeaderSvg(companyInitials, job.title, borderColor);

  return {
    id: job.id,
    title: job.title,
    subtitle: job.companyName || 'Enterprise Java Partner',
    handle: `${job.requiredExperienceYears || 3}+ yrs exp`,
    location: job.location,
    salary: job.salaryRange,
    image,
    borderColor,
    gradient,
    url: `/candidate/jobs`,
    job,
  };
}

export function RecommendedJobsChromaSection() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ChromaGridItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await jobsApi.listOpen(0, 6);
        if (active && res.data?.content) {
          const chromaItems = res.data.content.slice(0, 6).map(mapJobToChromaItem);
          setItems(chromaItems);
        }
      } catch {
        // Fallback handled by jobsApi
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleItemClick = (item: ChromaGridItem) => {
    if (item.id) {
      navigate('/candidate/jobs');
    }
  };

  return (
    <ViewportReveal delay={0.08} yOffset={25} className="w-full space-y-6 my-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line/60 pb-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Interactive Job Discovery</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight">
            Recommended Java & Enterprise Openings
          </h2>
          <p className="text-sm text-ink-muted">
            Hover over cards to trigger the chromatic spotlight. Click any position to view matching requirements.
          </p>
        </div>

        <button
          onClick={() => navigate('/candidate/jobs')}
          className="press-btn press-btn--ghost !min-h-10 !px-4 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>View All Positions</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <ErrorBoundary fallback={<div className="p-8 text-center text-ink-muted">ChromaGrid gallery unavailable.</div>}>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-ink-muted bg-surface-2 rounded-2xl border border-line">
            No open jobs available at this moment.
          </div>
        ) : (
          <ChromaGrid items={items} radius={280} columns={3} onItemClick={handleItemClick} />
        )}
      </ErrorBoundary>
    </ViewportReveal>
  );
}

export default RecommendedJobsChromaSection;
