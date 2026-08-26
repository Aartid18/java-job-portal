import { useEffect, useRef } from 'react';
import { useAppReducedMotion } from '../../lib/motion';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'candidate' | 'job';
  pulsePhase: number;
}

interface MatchConstellationProps {
  density?: 'low' | 'medium' | 'high';
  className?: string;
}

export function MatchConstellationBackground({ density = 'medium', className = '' }: MatchConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduceMotion = useAppReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mousePos = { x: width / 2, y: height / 2 };
    const mouseTarget = { x: 0, y: 0 };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (shouldReduceMotion) return;
      mouseTarget.x = (e.clientX - width / 2) * 0.02;
      mouseTarget.y = (e.clientY - height / 2) * 0.02;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Node count configuration based on screen width & density
    const isSmallScreen = width < 640;
    const countMap = { low: 18, medium: isSmallScreen ? 16 : 30, high: isSmallScreen ? 24 : 42 };
    const count = shouldReduceMotion ? 12 : countMap[density];

    // Initialize nodes
    const nodes: Node[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (shouldReduceMotion ? 0.05 : 0.25),
      vy: (Math.random() - 0.5) * (shouldReduceMotion ? 0.05 : 0.25),
      radius: Math.random() * 2 + 2.5,
      type: i % 2 === 0 ? 'candidate' : 'job',
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    const matchThreshold = width < 640 ? 120 : 180;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse parallax lerp
      mousePos.x += (mouseTarget.x - mousePos.x) * 0.05;
      mousePos.y += (mouseTarget.y - mousePos.y) * 0.05;

      ctx.save();
      ctx.translate(-mousePos.x, -mousePos.y);

      // Draw connecting AI match lines between Candidates & Jobs
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];

          // Only connect Candidate <-> Job pairs for theme fidelity
          if (n1.type === n2.type) continue;

          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < matchThreshold) {
            const alpha = (1 - dist / matchThreshold) * 0.18;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Draw a subtle moving pulse dot along active match connections
            const pulseT = (Math.sin(n1.pulsePhase) + 1) / 2;
            const px = n1.x + (n2.x - n1.x) * pulseT;
            const py = n1.y + (n2.y - n1.y) * pulseT;
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 58, 237, ${alpha * 1.5})`;
            ctx.fill();
          }
        }
      }

      // Update & Render Nodes
      nodes.forEach((node) => {
        if (!shouldReduceMotion) {
          node.x += node.vx;
          node.y += node.vy;
          node.pulsePhase += 0.015;

          if (node.x < -20) node.x = width + 20;
          if (node.x > width + 20) node.x = -20;
          if (node.y < -20) node.y = height + 20;
          if (node.y > height + 20) node.y = -20;
        }

        ctx.beginPath();
        if (node.type === 'candidate') {
          // Candidate node = Smooth Circle
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(79, 70, 229, 0.25)';
          ctx.fill();
        } else {
          // Job node = Diamond/Square
          const r = node.radius * 1.2;
          ctx.moveTo(node.x, node.y - r);
          ctx.lineTo(node.x + r, node.y);
          ctx.lineTo(node.x, node.y + r);
          ctx.lineTo(node.x - r, node.y);
          ctx.closePath();
          ctx.fillStyle = 'rgba(6, 182, 212, 0.22)';
          ctx.fill();
        }
      });

      ctx.restore();
      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [density, shouldReduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-[-1] pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
