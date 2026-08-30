import { useEffect, useRef } from 'react';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Group,
  Mesh,
  BoxGeometry,
  CylinderGeometry,
  TorusGeometry,
  IcosahedronGeometry,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  AmbientLight,
  DirectionalLight,
  PointLight,
  Color,
  ACESFilmicToneMapping,
  SRGBColorSpace,
  Clock,
} from 'three';

export interface CareerModel3DProps {
  className?: string;
  /** Disable auto-rotation / float loop (prefers-reduced-motion). */
  reduceMotion?: boolean;
}

/**
 * A genuine WebGL 3D model built from Three.js primitives — a briefcase
 * (career/job icon) orbited by small "matched skill" spheres — rather than
 * CSS pseudo-3D. Auto-rotates and gently tilts toward the cursor.
 */
export function CareerModel3D({ className = '', reduceMotion = false }: CareerModel3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 320;
    let height = container.clientHeight || 320;

    let hasWebGL = true;
    try {
      const test = document.createElement('canvas');
      hasWebGL = !!(test.getContext('webgl2') || test.getContext('webgl'));
    } catch {
      hasWebGL = false;
    }
    if (!hasWebGL) return;

    const scene = new Scene();
    const camera = new PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new AmbientLight(0xffffff, 0.55));
    const keyLight = new DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);
    const rimLight = new PointLight(0x7c3aed, 6, 20);
    rimLight.position.set(-4, -2, 3);
    scene.add(rimLight);
    const accentLight = new PointLight(0x06b6d4, 5, 20);
    accentLight.position.set(3, -3, -2);
    scene.add(accentLight);

    // --- Geometries & Materials tracking for clean disposal ---
    const bodyGeom = new BoxGeometry(2.6, 1.7, 0.9);
    const lidGeom = new BoxGeometry(2.62, 0.28, 0.92);
    const handleGeom = new TorusGeometry(0.55, 0.09, 12, 32, Math.PI);
    const claspGeom = new CylinderGeometry(0.12, 0.12, 0.35, 16);
    const nodeGeom = new IcosahedronGeometry(0.11, 0);

    const bodyMat = new MeshPhysicalMaterial({
      color: new Color(0x4f46e5),
      metalness: 0.35,
      roughness: 0.35,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
    });
    const lidMat = new MeshPhysicalMaterial({
      color: new Color(0xf59e0b),
      metalness: 0.3,
      roughness: 0.4,
      clearcoat: 0.4,
    });
    const handleMat = new MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.3 });

    // --- Briefcase group ---
    const briefcase = new Group();
    const body = new Mesh(bodyGeom, bodyMat);
    briefcase.add(body);

    const lidStripe = new Mesh(lidGeom, lidMat);
    lidStripe.position.y = 0.15;
    briefcase.add(lidStripe);

    const handle = new Mesh(handleGeom, handleMat);
    handle.position.y = 1.05;
    handle.rotation.z = Math.PI;
    briefcase.add(handle);

    const clasp = new Mesh(claspGeom, handleMat);
    clasp.rotation.z = Math.PI / 2;
    clasp.position.set(0, 0.15, 0.5);
    briefcase.add(clasp);

    scene.add(briefcase);

    // --- Orbiting "matched skill" nodes ---
    const orbitGroup = new Group();
    const nodeColors = [0x67e8f9, 0xa78bfa, 0xf59e0b, 0x34d399];
    const nodes: Mesh[] = [];
    const nodeMats: MeshStandardMaterial[] = [];
    const nodeCount = 8;
    for (let i = 0; i < nodeCount; i++) {
      const mat = new MeshStandardMaterial({
        color: nodeColors[i % nodeColors.length],
        emissive: new Color(nodeColors[i % nodeColors.length]),
        emissiveIntensity: 0.6,
        roughness: 0.3,
      });
      nodeMats.push(mat);
      const node = new Mesh(nodeGeom, mat);
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 2.6 + (i % 2) * 0.4;
      node.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.3) * 0.9, Math.sin(angle) * radius);
      orbitGroup.add(node);
      nodes.push(node);
    }
    scene.add(orbitGroup);

    // Interaction: gentle tilt toward cursor
    let targetRotX = 0;
    let targetRotY = 0;
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRotY = nx * 0.5;
      targetRotX = -ny * 0.3;
    };
    if (!reduceMotion) {
      container.addEventListener('pointermove', handlePointerMove);
    }

    const clock = new Clock();
    let rafId = 0;
    const animate = () => {
      const t = clock.getElapsedTime();

      if (!reduceMotion) {
        briefcase.rotation.y += (targetRotY + t * 0.25 - briefcase.rotation.y) * 0.04;
        briefcase.rotation.x += (targetRotX - briefcase.rotation.x) * 0.06;
        briefcase.position.y = Math.sin(t * 1.2) * 0.12;

        orbitGroup.rotation.y = t * 0.35;
        orbitGroup.rotation.x = Math.sin(t * 0.4) * 0.15;
        nodes.forEach((node, i) => {
          node.rotation.y = t * 2 + i;
          node.rotation.x = t * 1.4 + i;
        });
      } else {
        briefcase.rotation.y = 0.3;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (!reduceMotion) container.removeEventListener('pointermove', handlePointerMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Dispose unique geometries
      [bodyGeom, lidGeom, handleGeom, claspGeom, nodeGeom].forEach((g) => g.dispose());
      // Dispose unique materials
      [bodyMat, lidMat, handleMat, ...nodeMats].forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, [reduceMotion]);

  return <div ref={containerRef} className={`w-full h-full ${className}`} />;
}

export default CareerModel3D;
