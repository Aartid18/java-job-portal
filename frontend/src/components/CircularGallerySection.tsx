import { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Plane, Mesh, Program, Texture } from 'ogl';

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
}

const DEFAULT_JOB_ROLES: JobCardData[] = [
  { title: 'Sr. Java Microservices Architect', dept: DEPARTMENTS.Engineering },
  { title: 'Staff Frontend System Engineer', dept: DEPARTMENTS.Design },
  { title: 'Principal AI Product Manager', dept: DEPARTMENTS.Product },
  { title: 'Head of Developer Growth', dept: DEPARTMENTS.Marketing },
  { title: 'Distributed Systems Lead', dept: DEPARTMENTS.Engineering },
  { title: 'Lead UI/UX Interactive Designer', dept: DEPARTMENTS.Design },
  { title: 'Director of Platform Strategy', dept: DEPARTMENTS.Product },
  { title: 'Talent Acquisition Manager', dept: DEPARTMENTS.Marketing },
  { title: 'Cloud Security & DevOps Architect', dept: DEPARTMENTS.Engineering },
  { title: 'Growth Product Analytics Lead', dept: DEPARTMENTS.Product },
  { title: 'Brand & Motion Visual Producer', dept: DEPARTMENTS.Design },
  { title: 'Technical Content Strategist', dept: DEPARTMENTS.Marketing },
];

function generateCardSvgUri(title: string, dept: DepartmentInfo) {
  const svgWidth = 900;
  const svgHeight = 1300;

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
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.8"/>
        </filter>
      </defs>

      <!-- Card Base Surface -->
      <rect width="100%" height="100%" fill="#0B0C10" rx="52" />

      <!-- Top Color Area (30% Height Header) -->
      <rect width="100%" height="380" fill="url(#cardGrad)" rx="52" />

      <!-- Grain Overlay on Color Area -->
      <rect width="100%" height="380" fill="#ffffff" filter="url(#noiseFilter)" opacity="0.25" rx="52" />

      <!-- Translucent Department Initial Letter in Color Area -->
      <text x="830" y="320" font-family="system-ui, sans-serif" font-size="380" font-weight="900" fill="#ffffff" opacity="0.16" text-anchor="end">
        ${dept.initial}
      </text>

      <!-- Top Accent Line -->
      <rect x="52" y="48" width="796" height="4" fill="#ffffff" opacity="0.4" />

      <!-- Top Accent Department Name -->
      <text x="64" y="110" font-family="monospace" font-size="22" font-weight="900" fill="#ffffff" opacity="0.9" letter-spacing="3">
        JAVA JOB PORTAL • OPEN ROLE
      </text>

      <!-- Bottom Text Area (70% Height Solid Dark Content Surface) -->
      <rect x="32" y="360" width="836" height="900" rx="44" fill="#0B0C10" opacity="0.98" stroke="${dept.color}" stroke-opacity="0.4" stroke-width="3" />

      <!-- Department Badge in Text Area -->
      <rect x="64" y="410" width="280" height="64" rx="32" fill="#1B1D27" stroke="${dept.color}" stroke-opacity="0.3" stroke-width="2" />
      <text x="204" y="451" font-family="monospace" font-size="22" font-weight="900" fill="${dept.color}" text-anchor="middle" letter-spacing="3">
        ${dept.name.toUpperCase()}
      </text>

      <!-- Job Title (HD Ultra-Large 56px Text) -->
      ${
        line2
          ? `<text x="64" y="555" font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="900" fill="#FFFFFF" filter="url(#textShadow)">${escapeXml(line1)}</text>
             <text x="64" y="625" font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="900" fill="#FFFFFF" filter="url(#textShadow)">${escapeXml(line2)}</text>`
          : `<text x="64" y="585" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="900" fill="#FFFFFF" filter="url(#textShadow)">${escapeXml(line1)}</text>`
      }

      <!-- Metadata Lines -->
      <text x="64" y="720" font-family="sans-serif" font-size="30" font-weight="700" fill="#E2E8F0">
        Full-Time Position • Remote / Hybrid
      </text>

      <text x="64" y="780" font-family="sans-serif" font-size="26" font-weight="600" fill="#94A3B8">
        Required: Java 21, Spring Boot 3, Microservices
      </text>

      <!-- Dynamic Feature Badge -->
      <rect x="64" y="830" width="340" height="52" rx="16" fill="${dept.color}" opacity="0.15" />
      <text x="80" y="865" font-family="sans-serif" font-size="22" font-weight="800" fill="${dept.color}">
        ✓ 95% Match • Urgent Hiring
      </text>

      <!-- Action Button inside Text Area -->
      <rect x="64" y="1080" width="708" height="110" rx="30" fill="${dept.color}" />
      <text x="418" y="1148" font-family="monospace" font-size="30" font-weight="900" fill="#000000" text-anchor="middle" letter-spacing="2">
        APPLY FOR POSITION →
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
  bend = 0.3,
  scrollSpeed = 0.006,
  scrollEase = 0.07,
}: CircularGallerySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const renderer = new Renderer({ canvas, alpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 45 });
    camera.position.z = 6.2;

    const scene = new Transform();
    const planeGeometry = new Plane(gl, { width: 2.2, height: 3.0, widthSegments: 20, heightSegments: 20 });

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
        pos.z -= pow(xDist, 2.0) * (uBend * 0.025);
        pos.y -= pow(xDist, 2.0) * (uBend * 0.008);

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
      const texture = new Texture(gl);
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
    const spacing = 2.5;
    const scroll = { current: 0, target: 0 };
    let isDragging = false;
    let startPos = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      startPos = 'touches' in e ? e.touches[0].clientX : e.clientX;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const delta = (x - startPos) * 0.006;
      scroll.target -= delta;
      startPos = x;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

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
        camera.position.z = 7.8;
      } else {
        camera.position.z = 6.2;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let animationFrameId: number;

    const update = () => {
      scroll.current += (scroll.target - scroll.current) * scrollEase;
      const totalWidth = totalCards * spacing;

      cards.forEach((card, i) => {
        let x = (i * spacing - scroll.current) % totalWidth;
        if (x < -totalWidth / 2) x += totalWidth;
        if (x > totalWidth / 2) x -= totalWidth;

        card.mesh.position.x = x;
        card.mesh.program.uniforms.uOffset.value = x;

        const distFromCenter = Math.abs(x);
        card.mesh.rotation.y = -x * 0.03;

        const scale = Math.max(0.92, 1 - distFromCenter * 0.025);
        card.mesh.scale.set(scale, scale, scale);
      });

      renderer.render({ scene, camera });
      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [bend, scrollSpeed, scrollEase]);

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
          Drag, scroll, or use keyboard arrow keys to spin through featured Java & engineering positions.
        </p>
      </div>

      {/* WebGL Canvas Container */}
      <div
        ref={containerRef}
        tabIndex={0}
        aria-label="Interactive WebGL Circular Roles Gallery. Drag or use arrow keys to navigate."
        className="relative w-full h-[380px] sm:h-[480px] cursor-grab active:cursor-grabbing select-none focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] focus:ring-offset-2 focus:ring-offset-[#12131A] rounded-2xl"
      >
        <div className="absolute top-3 right-4 font-mono text-[11px] text-[#64748B] bg-[#1B1D27]/80 backdrop-blur-md px-3 py-1 rounded-full border border-line/40 pointer-events-none z-10">
          Drag / Scroll wheel →
        </div>
        <canvas ref={canvasRef} className="w-full h-full block" />
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
    </section>
  );
}
