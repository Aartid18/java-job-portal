import { useEffect, useRef } from 'react';
import { useAppReducedMotion } from '../../lib/motion';

interface SkillConstellationProps {
  candidateSkills?: string[];
  requiredSkills?: string[];
  className?: string;
}

export function SkillConstellationBackground({
  candidateSkills = ['Java 21', 'Spring Boot', 'Microservices', 'PostgreSQL'],
  requiredSkills = ['Java 21', 'Spring Boot', 'Kafka', 'Redis', 'Kubernetes'],
  className = '',
}: SkillConstellationProps) {
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

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const overlapSkills = candidateSkills.filter((s) =>
      requiredSkills.some((r) => r.toLowerCase() === s.toLowerCase())
    );

    // Map candidate and required skill nodes to screen canvas
    const nodes = [
      ...candidateSkills.map((name, i) => ({
        x: width * 0.25 + (Math.random() - 0.5) * 200,
        y: height * 0.3 + (i * (height * 0.4)) / Math.max(1, candidateSkills.length),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        name,
        isOverlap: overlapSkills.includes(name),
        type: 'user',
      })),
      ...requiredSkills.map((name, i) => ({
        x: width * 0.75 + (Math.random() - 0.5) * 200,
        y: height * 0.3 + (i * (height * 0.4)) / Math.max(1, requiredSkills.length),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        name,
        isOverlap: overlapSkills.includes(name),
        type: 'job',
      })),
    ];

    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.02;

      // Draw connection lines between matching user and job skills
      nodes.forEach((n1) => {
        nodes.forEach((n2) => {
          if (n1.type !== n2.type && n1.name.toLowerCase() === n2.name.toLowerCase()) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            const lineAlpha = 0.2 + Math.sin(t) * 0.08;
            ctx.strokeStyle = `rgba(16, 185, 129, ${lineAlpha})`; // Emerald match connection
            ctx.lineWidth = 1.5;
            ctx.setLineDash([6, 6]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      });

      // Render Nodes
      nodes.forEach((n) => {
        if (!shouldReduceMotion) {
          n.x += n.vx;
          n.y += n.vy;
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.isOverlap ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = n.isOverlap
          ? 'rgba(16, 185, 129, 0.4)'
          : n.type === 'user'
          ? 'rgba(79, 70, 229, 0.3)'
          : 'rgba(239, 68, 68, 0.3)';
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [candidateSkills, requiredSkills, shouldReduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-[-1] pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
