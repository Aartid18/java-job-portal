import { useEffect, useRef, useState } from 'react';
import { Renderer, Camera, Transform, Plane, Mesh, Program, Texture } from 'ogl';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Briefcase, MapPin, IndianRupee, ArrowRight, X } from 'lucide-react';
import PressButton from './PressButton';

export interface DepartmentInfo {
  name: string;
  color: string;
  gradientStart: string;
  gradientEnd: string;
  initial: string;
}

export const DEPARTMENTS: Record<string, DepartmentInfo> = {
  Engineering: {
    name: 'Engineering',
    color: '#2DD4BF', // Teal
    gradientStart: '#0F766E',
    gradientEnd: '#2DD4BF',
    initial: 'E',
  },
  Design: {
    name: 'Design',
    color: '#FB7185', // Coral
    gradientStart: '#BE123C',
    gradientEnd: '#FB7185',
    initial: 'D',
  },
  Product: {
    name: 'Product',
    color: '#818CF8', // Periwinkle
    gradientStart: '#4338CA',
    gradientEnd: '#818CF8',
    initial: 'P',
  },
  Marketing: {
    name: 'Marketing',
    color: '#FBBF24', // Amber
    gradientStart: '#B45309',
    gradientEnd: '#FBBF24',
    initial: 'M',
  },
};

export interface JobCardData {
  id?: number;
  title: string;
  dept: DepartmentInfo;
  salary?: string;
  experience?: string;
  location?: string;
}

const DEFAULT_JOB_ROLES: JobCardData[] = [
  { title: 'Sr. Java Microservices Architect', dept: DEPARTMENTS.Engineering, salary: '₹28 - 36 LPA', experience: '6+ yrs', location: 'Remote / Bangalore' },
  { title: 'Staff Frontend System Engineer', dept: DEPARTMENTS.Design, salary: '₹24 - 32 LPA', experience: '5+ yrs', location: 'Hybrid / Mumbai' },
  { title: 'Principal AI Product Manager', dept: DEPARTMENTS.Product, salary: '₹30 - 42 LPA', experience: '7+ yrs', location: 'Remote / Gurgaon' },
  { title: 'Head of Developer Growth', dept: DEPARTMENTS.Marketing, salary: '₹22 - 30 LPA', experience: '5+ yrs', location: 'Remote / Pune' },
  { title: 'Distributed Systems Lead', dept: DEPARTMENTS.Engineering, salary: '₹26 - 35 LPA', experience: '6+ yrs', location: 'Hybrid / Hyderabad' },
  { title: 'Lead UI/UX Interactive Designer', dept: DEPARTMENTS.Design, salary: '₹20 - 28 LPA', experience: '4+ yrs', location: 'Remote / Bangalore' },
  { title: 'Director of Platform Strategy', dept: DEPARTMENTS.Product, salary: '₹35 - 50 LPA', experience: '8+ yrs', location: 'Hybrid / Delhi' },
  { title: 'Talent Acquisition Manager', dept: DEPARTMENTS.Marketing, salary: '₹16 - 22 LPA', experience: '4+ yrs', location: 'Hybrid / Mumbai' },
  { title: 'Cloud Security & DevOps Architect', dept: DEPARTMENTS.Engineering, salary: '₹25 - 34 LPA', experience: '5+ yrs', location: 'Remote' },
  { title: 'Growth Product Analytics Lead', dept: DEPARTMENTS.Product, salary: '₹22 - 29 LPA', experience: '4+ yrs', location: 'Hybrid / Bangalore' },
  { title: 'Brand & Motion Visual Producer', dept: DEPARTMENTS.Design, salary: '₹18 - 25 LPA', experience: '3+ yrs', location: 'Remote' },
  { title: 'Technical Content Strategist', dept: DEPARTMENTS.Marketing, salary: '₹15 - 20 LPA', experience: '3+ yrs', location: 'Remote / Hyderabad' },
];

/**
 * Generates an 1800x2600 Ultra-HD crisp SVG URI for 3D card textures.
 * Uses 2x pixel density and heavy font-weight styling to eliminate blurriness.
 */
function generateCardSvgUri(title: string, dept: DepartmentInfo) {
  const svgWidth = 1800;
  const svgHeight = 2600;

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

  // Smart 2-line title wrapping for maximum text size and HD readability
  const words = title.split(' ');
  let line1 = title;
  let line2 = '';
  if (title.length > 16 && words.length > 2) {
    const mid = Math.ceil(words.length / 2);
    line1 = words.slice(0, mid).join(' ');
    line2 = words.slice(mid).join(' ');
  }

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <defs>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${dept.gradientStart}" />
          <stop offset="100%" stop-color="${dept.gradientEnd}" />
        </linearGradient>

        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0" />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>

        <filter id="textShadow">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.95"/>
        </filter>
      </defs>

      <!-- Card Base Surface -->
      <rect width="100%" height="100%" fill="#0B0C12" rx="96" />

      <!-- Top Color Area (Header) -->
      <rect width="100%" height="640" fill="url(#cardGrad)" rx="96" />

      <!-- Grain Overlay on Color Area -->
      <rect width="100%" height="640" fill="#ffffff" filter="url(#noiseFilter)" opacity="0.25" rx="96" />

      <!-- Translucent Department Initial Letter in Color Area -->
      <text x="1660" y="540" font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="680" font-weight="900" fill="#ffffff" opacity="0.22" text-anchor="end">
        ${dept.initial}
      </text>

      <!-- Top Accent Line -->
      <rect x="100" y="88" width="1600" height="8" fill="#ffffff" opacity="0.5" />

      <!-- Top Accent Header Text -->
      <text x="120" y="190" font-family="monospace" font-size="44" font-weight="900" fill="#ffffff" opacity="0.95" letter-spacing="6">
        JAVA JOB PORTAL • FEATURED ROLE
      </text>

      <!-- Bottom Text Area (75% Height Solid Dark Content Surface) -->
      <rect x="56" y="560" width="1688" height="1960" rx="88" fill="#0B0C12" opacity="1.0" stroke="${dept.color}" stroke-opacity="0.7" stroke-width="8" />

      <!-- Department Badge in Text Area -->
      <rect x="120" y="660" width="600" height="136" rx="68" fill="#161824" stroke="${dept.color}" stroke-width="4" />
      <text x="420" y="746" font-family="monospace" font-size="48" font-weight="900" fill="${dept.color}" text-anchor="middle" letter-spacing="6">
        ${dept.name.toUpperCase()}
      </text>

      <!-- Job Title (HD Ultra-Large Sharp Text) -->
      ${
        line2
          ? `<text x="120" y="960" font-family="system-ui, -apple-system, sans-serif" font-size="104" font-weight="900" fill="#FFFFFF" filter="url(#textShadow)">${escapeXml(line1)}</text>
             <text x="120" y="1100" font-family="system-ui, -apple-system, sans-serif" font-size="104" font-weight="900" fill="#FFFFFF" filter="url(#textShadow)">${escapeXml(line2)}</text>`
          : `<text x="120" y="1020" font-family="system-ui, -apple-system, sans-serif" font-size="112" font-weight="900" fill="#FFFFFF" filter="url(#textShadow)">${escapeXml(line1)}</text>`
      }

      <!-- Metadata Lines -->
      <text x="120" y="1280" font-family="system-ui, sans-serif" font-size="64" font-weight="800" fill="#F1F5F9">
        Full-Time Position • Remote / Hybrid
      </text>

      <text x="120" y="1400" font-family="system-ui, sans-serif" font-size="56" font-weight="700" fill="#94A3B8">
        Required: Java 21, Spring Boot 3, Microservices
      </text>

      <!-- Dynamic Feature Badge -->
      <rect x="120" y="1500" width="760" height="112" rx="36" fill="${dept.color}" opacity="0.2" />
      <text x="160" y="1576" font-family="system-ui, sans-serif" font-size="48" font-weight="900" fill="${dept.color}">
        ✓ 95% Match • Urgent Hiring
      </text>

      <!-- Action Button inside Text Area -->
      <rect x="120" y="2160" width="1560" height="228" rx="60" fill="${dept.color}" />
      <text x="900" y="2300" font-family="monospace" font-size="64" font-weight="900" fill="#000000" text-anchor="middle" letter-spacing="4">
        CLICK TO APPLY NOW →
      </text>
    </svg>
  `.trim();

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}

interface CircularGallerySectionProps {
  bend?: number;
  scrollSpeed?: number;
  scrollEase?: number;
}

export function CircularGallerySection({
  bend = 0.2,
  scrollSpeed = 0.006,
  scrollEase = 0.07,
}: CircularGallerySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeJob, setActiveJob] = useState<JobCardData>(DEFAULT_JOB_ROLES[0]);
  const [selectedModalJob, setSelectedModalJob] = useState<JobCardData | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Enable high-DPR hardware crispness
    const renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 45 });
    camera.position.z = 7.2;

    const scene = new Transform();
    const planeGeometry = new Plane(gl, { width: 2.5, height: 3.5, widthSegments: 20, heightSegments: 20 });

    const vertexShader = /* glsl */ `
      attribute vec3 position;
      attribute vec2 uv;

      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uBend;
      uniform float uOffset;

      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;

        float xDist = pos.x + uOffset;
        pos.z -= pow(xDist, 2.0) * (uBend * 0.02);
        pos.y -= pow(xDist, 2.0) * (uBend * 0.005);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = /* glsl */ `
      precision highp float;

      uniform sampler2D tMap;
      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(tMap, vUv);
        gl_FragColor = color;
      }
    `;

    const cards = DEFAULT_JOB_ROLES.map((job, index) => {
      const texture = new Texture(gl, {
        generateMipmaps: true,
      });
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        texture.image = img;
      };
      img.src = generateCardSvgUri(job.title, job.dept);

      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          tMap: { value: texture },
          uBend: { value: bend },
          uOffset: { value: 0 },
        },
        transparent: true,
      });

      const mesh = new Mesh(gl, { geometry: planeGeometry, program });
      mesh.setParent(scene);

      return { mesh, job, index };
    });

    const totalCards = cards.length;
    const spacing = 2.8;
    const scroll = { current: 0, target: 0 };
    let isDragging = false;
    let startPos = 0;
    let dragDistance = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      startPos = 'touches' in e ? e.touches[0].clientX : e.clientX;
      dragDistance = 0;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const delta = (x - startPos) * 0.006;
      scroll.target -= delta;
      dragDistance += Math.abs(x - startPos);
      startPos = x;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onClickCanvas = () => {
      // If user clicked without dragging, open modal for currently focused central card
      if (dragDistance < 10 && activeJobRef.current) {
        setSelectedModalJob(activeJobRef.current);
        setAppliedSuccess(false);
      }
    };

    const activeJobRef = { current: DEFAULT_JOB_ROLES[0] };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('click', onClickCanvas);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scroll.target += e.deltaY * scrollSpeed;
    };
    container.addEventListener('wheel', onWheel, { passive: false });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        scroll.target += 0.8;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        scroll.target -= 0.8;
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (activeJobRef.current) {
          setSelectedModalJob(activeJobRef.current);
          setAppliedSuccess(false);
        }
      }
    };
    container.addEventListener('keydown', onKeyDown);

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });

      if (width < 768) {
        camera.position.z = 9.0;
      } else {
        camera.position.z = 7.2;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let animationFrameId: number;

    const update = () => {
      scroll.current += (scroll.target - scroll.current) * scrollEase;
      const totalWidth = totalCards * spacing;

      let closestCard = cards[0];
      let minDistance = Infinity;

      cards.forEach((card, i) => {
        let x = (i * spacing - scroll.current) % totalWidth;
        if (x < -totalWidth / 2) x += totalWidth;
        if (x > totalWidth / 2) x -= totalWidth;

        card.mesh.position.x = x;
        card.mesh.program.uniforms.uOffset.value = x;

        const distFromCenter = Math.abs(x);
        if (distFromCenter < minDistance) {
          minDistance = distFromCenter;
          closestCard = card;
        }

        card.mesh.rotation.y = -x * 0.02;

        const scale = Math.max(0.94, 1 - distFromCenter * 0.02);
        card.mesh.scale.set(scale, scale, scale);
      });

      if (closestCard && activeJobRef.current !== closestCard.job) {
        activeJobRef.current = closestCard.job;
        setActiveJob(closestCard.job);
      }

      renderer.render({ scene, camera });
      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('click', onClickCanvas);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [bend, scrollSpeed, scrollEase]);

  const handleModalApply = () => {
    setAppliedSuccess(true);
  };

  return (
    <section className="relative w-full rounded-3xl border border-line/80 bg-[#12131A] text-[#F4F2ED] p-6 sm:p-10 shadow-2xl overflow-hidden my-8 space-y-6">
      {/* Header Block */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 text-[#2DD4BF] text-xs font-mono font-semibold uppercase tracking-widest">
          Interactive Careers Gallery
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-[#F4F2ED]">
          Open <em className="italic text-[#2DD4BF] font-serif">Roles</em> Wheel
        </h2>
        <p className="text-sm text-[#94A3B8] font-sans">
          Drag or scroll to rotate positions. Click any card to apply directly!
        </p>
      </div>

      {/* WebGL Canvas Container with HD Sharpness */}
      <div
        ref={containerRef}
        tabIndex={0}
        aria-label="Interactive WebGL Circular Roles Gallery. Drag or click card to apply."
        className="relative w-full h-[540px] sm:h-[660px] cursor-grab active:cursor-grabbing select-none focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] focus:ring-offset-2 focus:ring-offset-[#12131A] rounded-2xl"
      >
        <div className="absolute top-3 right-4 font-mono text-[11px] text-[#64748B] bg-[#1B1D27]/80 backdrop-blur-md px-3 py-1 rounded-full border border-line/40 pointer-events-none z-10">
          Drag / Scroll / Click Card →
        </div>

        <canvas ref={canvasRef} className="w-full h-full block cursor-pointer" />
      </div>

      {/* Active Position Instant Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#1A1C26] border border-line/60 shadow-lg">
        <div className="flex items-center gap-3">
          <span
            className="w-4 h-4 rounded-full shadow-md"
            style={{ backgroundColor: activeJob.dept.color }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase" style={{ color: activeJob.dept.color }}>
                {activeJob.dept.name}
              </span>
              <span className="text-xs text-[#64748B]">•</span>
              <span className="text-xs text-[#94A3B8] font-semibold">{activeJob.salary}</span>
            </div>
            <h4 className="text-base font-bold text-[#F4F2ED]">{activeJob.title}</h4>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
          <button
            type="button"
            onClick={() => {
              setSelectedModalJob(activeJob);
              setAppliedSuccess(false);
            }}
            style={{ backgroundColor: activeJob.dept.color }}
            className="px-6 py-3 rounded-xl text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition-transform"
          >
            <span>Apply for Position</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Legend Row */}
      <div className="flex flex-wrap justify-center items-center gap-6 pt-2 font-mono text-xs text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] shadow-[0_0_8px_#2DD4BF]" />
          <span>Engineering</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185] shadow-[0_0_8px_#FB7185]" />
          <span>Design</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#818CF8] shadow-[0_0_8px_#818CF8]" />
          <span>Product</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] shadow-[0_0_8px_#FBBF24]" />
          <span>Marketing</span>
        </div>
      </div>

      {/* Interactive Application Modal Popup */}
      <AnimatePresence>
        {selectedModalJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#161824] border border-line/80 p-6 sm:p-8 shadow-2xl text-[#F4F2ED] space-y-6"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedModalJob(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-[#222536] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Department Tag */}
              <div className="flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-widest"
                  style={{
                    backgroundColor: `${selectedModalJob.dept.color}20`,
                    color: selectedModalJob.dept.color,
                    border: `1px solid ${selectedModalJob.dept.color}50`,
                  }}
                >
                  {selectedModalJob.dept.name}
                </span>
                <span className="text-xs font-semibold text-[#94A3B8]">Verified Enterprise Role</span>
              </div>

              {/* Modal Title & Salary */}
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-white">{selectedModalJob.title}</h3>
                <div className="flex items-center gap-4 text-xs text-[#94A3B8] pt-1">
                  <span className="flex items-center gap-1 font-semibold text-emerald-400">
                    <IndianRupee className="w-3.5 h-3.5" /> {selectedModalJob.salary}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" /> {selectedModalJob.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" /> {selectedModalJob.experience}
                  </span>
                </div>
              </div>

              {/* Key Skills & AI Score */}
              <div className="p-4 rounded-2xl bg-[#0F1018] border border-line/50 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#94A3B8]">AI Profile Compatibility</span>
                  <span className="font-bold flex items-center gap-1" style={{ color: selectedModalJob.dept.color }}>
                    <Sparkles className="w-3.5 h-3.5" /> 95% Match
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#222536] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: '95%', backgroundColor: selectedModalJob.dept.color }}
                  />
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Required: Java 21, Spring Boot 3.3, Microservices Architecture, Kafka Event Streams, PostgreSQL.
                </p>
              </div>

              {/* Action State */}
              {appliedSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center space-y-2"
                >
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 animate-bounce" />
                  <h4 className="text-base font-bold">Application Submitted Successfully!</h4>
                  <p className="text-xs text-emerald-300">
                    Your profile and verified credentials have been submitted to the recruiter.
                  </p>
                  <div className="pt-2">
                    <PressButton variant="ghost" onClick={() => setSelectedModalJob(null)}>
                      Done
                    </PressButton>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedModalJob(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleModalApply}
                    style={{ backgroundColor: selectedModalJob.dept.color }}
                    className="px-6 py-3 rounded-xl text-black font-extrabold text-xs font-mono uppercase tracking-wider shadow-xl cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <span>Submit Application Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default CircularGallerySection;
