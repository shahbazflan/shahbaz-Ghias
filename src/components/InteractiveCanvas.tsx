import React, { useEffect, useRef, useState } from 'react';

interface InteractiveCanvasProps {
  className?: string;
  exclusionId?: string;
  hideControlDock?: boolean;
}

interface WebNode {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  rgb: string;
  pulsePhase: number;
  pulseSpeed: number;
  isCircleNode?: boolean;
  circleAngle?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  isFeatureOrb?: boolean;
}

interface CursorSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  alpha: number;
  life: number;
  maxLife: number;
}

const NODE_COLORS = [
  { hex: '#d85d3a', rgb: '216, 93, 58' },   // Terracotta signature
  { hex: '#10b981', rgb: '16, 185, 129' },  // Emerald green
  { hex: '#f59e0b', rgb: '245, 158, 11' },  // Electric amber
  { hex: '#06b6d4', rgb: '6, 182, 212' },   // Cyan
  { hex: '#a855f7', rgb: '168, 85, 247' },  // Violet
  { hex: '#f43f5e', rgb: '244, 63, 94' },   // Electric rose
  { hex: '#38bdf8', rgb: '56, 189, 248' },  // Sky blue
  { hex: '#eab308', rgb: '234, 179, 8' },   // Golden solar
];

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  className = '',
  exclusionId = 'hero-content-exclusion',
  hideControlDock = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const exclusionIdRef = useRef(exclusionId);

  useEffect(() => {
    exclusionIdRef.current = exclusionId;
  }, [exclusionId]);

  const mouseRef = useRef<{
    x: number;
    y: number;
    px: number;
    py: number;
    vx: number;
    vy: number;
    active: boolean;
  }>({
    x: -1000,
    y: -1000,
    px: -1000,
    py: -1000,
    vx: 0,
    vy: 0,
    active: false,
  });

  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive constellation network: Reduced by 25% from original, richly visible and balanced
    const isMobile = width < 768;
    const nodeCount = isMobile ? 62 : 100;
    const circleNodeCount = isMobile ? 26 : 40;
    const maxLinkDistance = isMobile ? 160 : 215;
    const cursorLinkDistance = isMobile ? 160 : 230;
    const lensRadius = isMobile ? 150 : 210;

    // Celestial circle geometry: 25% zoomed out to comfortably frame the content
    const getCircleGeometry = () => {
      const cx = width * 0.5;
      const cy = height * 0.48;
      const radius = isMobile
        ? Math.min(width * 0.44, 195)
        : Math.min(width * 0.35, height * 0.44, 380);
      return { cx, cy, radius };
    };

    // Measure exclusion zone for text/content area to prevent line clumping over copy
    let exclusionBox: { left: number; top: number; right: number; bottom: number } | null = null;
    const updateExclusionBox = () => {
      const targetId = exclusionIdRef.current || 'hero-content-exclusion';
      const el = document.getElementById(targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.bottom > 0 && rect.top < height) {
          const padX = isMobile ? 18 : 36;
          const padY = isMobile ? 16 : 30;
          exclusionBox = {
            left: rect.left - padX,
            top: rect.top - padY,
            right: rect.right + padX,
            bottom: rect.bottom + padY,
          };
          return;
        }
      }
      exclusionBox = null;
    };

    updateExclusionBox();

    const isInsideExclusion = (x: number, y: number) => {
      if (!exclusionBox) return false;
      return (
        x >= exclusionBox.left &&
        x <= exclusionBox.right &&
        y >= exclusionBox.top &&
        y <= exclusionBox.bottom
      );
    };

    // Initialize Web Nodes: Distinct luminous nodes with glowing accent orbs
    const nodes: WebNode[] = [];
    const { cx, cy, radius: circleRadius } = getCircleGeometry();

    // 1. Circle Perimeter Nodes (Forms a clean circular ring framing the center)
    for (let c = 0; c < circleNodeCount; c++) {
      const angle = (c / circleNodeCount) * Math.PI * 2;
      const isFeature = c % 5 === 0;
      // Slight natural breathing variation along the perimeter
      const r = circleRadius * (0.95 + Math.random() * 0.08);
      const colorObj = NODE_COLORS[c % NODE_COLORS.length];
      const radius = isFeature
        ? (isMobile ? 3.6 : 4.6)
        : (Math.random() * 1.0 + (isMobile ? 1.8 : 2.2));

      nodes.push({
        id: c,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        vx: 0,
        vy: 0,
        radius,
        baseRadius: radius,
        color: colorObj.hex,
        rgb: colorObj.rgb,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.016 + Math.random() * 0.018,
        isCircleNode: true,
        circleAngle: angle,
        orbitRadius: r,
        orbitSpeed: (0.0014 + (c % 3) * 0.0004) * (c % 2 === 0 ? 1 : -0.8),
        isFeatureOrb: isFeature,
      });
    }

    // 2. Viewport Spread Nodes: Ambient constellation nodes across the canvas
    const freeNodeCount = nodeCount - circleNodeCount;
    for (let i = 0; i < freeNodeCount; i++) {
      const idx = circleNodeCount + i;
      const isFeature = i % 7 === 0;
      const colorObj = NODE_COLORS[idx % NODE_COLORS.length];
      const radius = isFeature
        ? (isMobile ? 3.8 : 4.8)
        : (Math.random() * 1.0 + (isMobile ? 1.8 : 2.2));

      let startX = Math.random() * width;
      let startY = Math.random() * height;

      nodes.push({
        id: idx,
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius,
        baseRadius: radius,
        color: colorObj.hex,
        rgb: colorObj.rgb,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.016 + Math.random() * 0.02,
        isCircleNode: false,
        isFeatureOrb: isFeature,
      });
    }

    // Cursor micro-sparks for delicate trails
    const cursorSparks: CursorSpark[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      updateExclusionBox();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mouseRef.current.x;
      const dy = e.clientY - mouseRef.current.y;
      const speed = Math.hypot(dx, dy);

      mouseRef.current.px = mouseRef.current.x;
      mouseRef.current.py = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.vx = dx * 0.22;
      mouseRef.current.vy = dy * 0.22;
      mouseRef.current.active = true;

      // Subtle cursor dust trail
      const spawnCount = Math.min(Math.max(Math.floor(speed / 8), 1), 3);
      for (let s = 0; s < spawnCount; s++) {
        if (cursorSparks.length >= 70) {
          cursorSparks.shift();
        }
        const angle = Math.random() * Math.PI * 2;
        const spreadSpeed = Math.random() * 1.5 + 0.3;
        const colorObj = NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)];
        const life = Math.random() * 24 + 18;

        cursorSparks.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * spreadSpeed + mouseRef.current.vx * 0.12,
          vy: Math.sin(angle) * spreadSpeed + mouseRef.current.vy * 0.12 - 0.1,
          radius: Math.random() * 1.6 + 0.9,
          color: colorObj.rgb,
          glowColor: colorObj.hex,
          alpha: 0.75,
          life,
          maxLife: life,
        });
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      trailX = -1000;
      trailY = -1000;
      trailVx = 0;
      trailVy = 0;
    };

    const handleScroll = () => {
      updateExclusionBox();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Trailing cursor physics state for organic drifting web lines
    let trailX = -1000;
    let trailY = -1000;
    let trailVx = 0;
    let trailVy = 0;
    let frameCount = 0;

    // Preallocated transformed coordinates for zoom effect
    const projectedNodes = nodes.map(() => ({
      x: 0,
      y: 0,
      radius: 0,
      zoom: 1,
      inLens: false,
    }));

    const render = () => {
      frameCount++;
      if (frameCount % 30 === 0) {
        updateExclusionBox();
      }

      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = mouseRef.current.active;

      // Update smooth cursor trailing anchor for organic line drift
      if (mouseActive) {
        if (trailX === -1000) {
          trailX = mx;
          trailY = my;
        }
        const spring = 0.14;
        const damping = 0.82;
        trailVx = (trailVx + (mx - trailX) * spring) * damping;
        trailVy = (trailVy + (my - trailY) * spring) * damping;
        trailX += trailVx;
        trailY += trailVy;
      }

      // 1. Update Base Positions & Physics
      const currentCircle = getCircleGeometry();

      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.pulsePhase += p.pulseSpeed;

        if (p.isCircleNode) {
          // Update orbital angle
          p.circleAngle = (p.circleAngle || 0) + (p.orbitSpeed || 0.002);
          const targetX = currentCircle.cx + Math.cos(p.circleAngle) * (p.orbitRadius || currentCircle.radius);
          const targetY = currentCircle.cy + Math.sin(p.circleAngle) * (p.orbitRadius || currentCircle.radius);

          // Spring gently toward target orbit position so it holds the circular shape
          p.x += (targetX - p.x) * 0.08 + p.vx;
          p.y += (targetY - p.y) * 0.08 + p.vy;
        } else {
          p.x += p.vx;
          p.y += p.vy;

          // Soft bounce off canvas edges
          if (p.x < 12) {
            p.x = 12;
            p.vx = Math.abs(p.vx);
          } else if (p.x > width - 12) {
            p.x = width - 12;
            p.vx = -Math.abs(p.vx);
          }
          if (p.y < 12) {
            p.y = 12;
            p.vy = Math.abs(p.vy);
          } else if (p.y > height - 12) {
            p.y = height - 12;
            p.vy = -Math.abs(p.vy);
          }
        }

        // Mouse organic attraction & wake drift
        if (mouseActive) {
          const mdx = mx - p.x;
          const mdy = my - p.y;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < 190 && mDist > 6) {
            const influence = 1 - mDist / 190;
            const force = influence * (p.isCircleNode ? 0.16 : 0.24);
            p.x += (mdx / mDist) * force;
            p.y += (mdy / mDist) * force;
            p.vx += trailVx * influence * 0.015;
            p.vy += trailVy * influence * 0.015;
          }
        }

        // Gentle velocity damping
        p.vx *= 0.96;
        p.vy *= 0.96;

        // 2. CURSOR ZOOM EFFECT (Magnification Lens applied with cursor movement)
        const pulse = Math.sin(p.pulsePhase) * 0.35 + 1;
        let pRadius = p.radius * pulse;
        let projX = p.x;
        let projY = p.y;
        let zoom = 1;
        let inLens = false;

        if (mouseActive) {
          const cdx = p.x - mx;
          const cdy = p.y - my;
          const cDist = Math.hypot(cdx, cdy);

          if (cDist < lensRadius && cDist > 0.5) {
            inLens = true;
            const normDist = cDist / lensRadius; // 0 at cursor, 1 at perimeter
            // Cosine optical magnification bell curve
            const lensPower = Math.cos(normDist * (Math.PI / 2));
            zoom = 1 + lensPower * 1.8; // Up to 2.8x magnification at center!
            pRadius *= zoom;

            // Optical fish-eye outward radial refraction displacement
            const warp = Math.sin(normDist * Math.PI) * (isMobile ? 18 : 28) * lensPower;
            projX = p.x + (cdx / cDist) * warp;
            projY = p.y + (cdy / cDist) * warp;
          }
        }

        projectedNodes[i].x = projX;
        projectedNodes[i].y = projY;
        projectedNodes[i].radius = pRadius;
        projectedNodes[i].zoom = zoom;
        projectedNodes[i].inLens = inLens;
      }

      // 3. CONSTELLATION GRAPH: Connected perimeter ring & balanced ambient links without inner clutter
      ctx.save();
      const connectedPairs = new Set<string>();
      const nodeDegree = new Uint8Array(nodes.length);

      // A. Connect adjacent perimeter nodes in circle ring to form a clean, unbroken celestial frame
      for (let c = 0; c < circleNodeCount; c++) {
        const nextC = (c + 1) % circleNodeCount;
        const key = c < nextC ? `${c}-${nextC}` : `${nextC}-${c}`;
        connectedPairs.add(key);
        nodeDegree[c]++;
        nodeDegree[nextC]++;
      }

      // B. Connect each free node to its 2 nearest neighbors (ensuring an unbroken ambient web)
      for (let i = circleNodeCount; i < nodes.length; i++) {
        let n1Idx = -1;
        let n1Dist = Infinity;
        let n2Idx = -1;
        let n2Dist = Infinity;
        const p1 = projectedNodes[i];

        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const p2 = projectedNodes[j];
          const d = Math.hypot(p2.x - p1.x, p2.y - p1.y);

          if (d < n1Dist) {
            n2Dist = n1Dist;
            n2Idx = n1Idx;
            n1Dist = d;
            n1Idx = j;
          } else if (d < n2Dist) {
            n2Dist = d;
            n2Idx = j;
          }
        }

        if (n1Idx !== -1 && n1Dist < maxLinkDistance) {
          const midX = (p1.x + projectedNodes[n1Idx].x) / 2;
          const midY = (p1.y + projectedNodes[n1Idx].y) / 2;
          // Avoid drawing lines slicing directly through central text exclusion
          if (!exclusionBox || !isInsideExclusion(midX, midY)) {
            const key = i < n1Idx ? `${i}-${n1Idx}` : `${n1Idx}-${i}`;
            if (!connectedPairs.has(key)) {
              connectedPairs.add(key);
              nodeDegree[i]++;
              nodeDegree[n1Idx]++;
            }
          }
        }

        if (n2Idx !== -1 && n2Dist < maxLinkDistance * 0.9) {
          const midX = (p1.x + projectedNodes[n2Idx].x) / 2;
          const midY = (p1.y + projectedNodes[n2Idx].y) / 2;
          if (!exclusionBox || !isInsideExclusion(midX, midY)) {
            const key = i < n2Idx ? `${i}-${n2Idx}` : `${n2Idx}-${i}`;
            if (!connectedPairs.has(key)) {
              connectedPairs.add(key);
              nodeDegree[i]++;
              nodeDegree[n2Idx]++;
            }
          }
        }
      }

      // C. Connect circle ring to closest outer spread nodes so the ring integrates with the field
      for (let c = 0; c < circleNodeCount; c += 2) {
        if (nodeDegree[c] >= 4) continue;
        const p1 = projectedNodes[c];
        let bestSpread = -1;
        let bestDist = Infinity;

        for (let j = circleNodeCount; j < nodes.length; j++) {
          const p2 = projectedNodes[j];
          const d = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          if (d < bestDist && d < maxLinkDistance * 0.85) {
            bestDist = d;
            bestSpread = j;
          }
        }

        if (bestSpread !== -1) {
          const key = c < bestSpread ? `${c}-${bestSpread}` : `${bestSpread}-${c}`;
          connectedPairs.add(key);
          nodeDegree[c]++;
          nodeDegree[bestSpread]++;
        }
      }

      // D. Render clean, vibrant constellation threads
      connectedPairs.forEach((pairKey) => {
        const [idxStrA, idxStrB] = pairKey.split('-');
        const i = Number(idxStrA);
        const j = Number(idxStrB);
        const p1 = projectedNodes[i];
        const p2 = projectedNodes[j];
        const origNode1 = nodes[i];
        const origNode2 = nodes[j];

        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        const inText = exclusionBox && isInsideExclusion(midX, midY);

        // Zoom magnification effect on lines passing through cursor lens
        let lineZoom = 1;
        if (mouseActive) {
          const midDist = Math.hypot(midX - mx, midY - my);
          if (midDist < lensRadius) {
            const lensPower = Math.cos((midDist / lensRadius) * (Math.PI / 2));
            lineZoom = 1 + lensPower * 0.45;
          }
        }

        const maxD = Math.max(maxLinkDistance, 220);
        const normDist = Math.min(dist / maxD, 1);
        // Rich visible alpha, with soft reduction over text
        let alpha = (1 - normDist) * (inText ? 0.12 : 0.32) * Math.min(lineZoom, 1.6);

        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grad.addColorStop(0, `rgba(${origNode1.rgb}, ${alpha})`);
        grad.addColorStop(1, `rgba(${origNode2.rgb}, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.min(1.1 * lineZoom, 2.2);
        ctx.stroke();
      });

      ctx.restore();

      // 4. Subtle Cursor Elastic Threads
      if (mouseActive) {
        ctx.save();

        // Delicate lens perimeter ring
        ctx.beginPath();
        ctx.arc(mx, my, lensRadius * 0.95, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(216, 93, 58, 0.12)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Connect to top 4 closest nodes
        const mouseLinks: { node: WebNode; proj: typeof projectedNodes[0]; dist: number }[] = [];
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const proj = projectedNodes[i];
          const dist = Math.hypot(mx - proj.x, my - proj.y);
          if (dist < cursorLinkDistance) {
            mouseLinks.push({ node, proj, dist });
          }
        }

        mouseLinks.sort((a, b) => a.dist - b.dist);
        const topLinks = mouseLinks.slice(0, 4);

        for (const link of topLinks) {
          const { node, proj, dist } = link;
          const midX = (mx + proj.x) / 2;
          const midY = (my + proj.y) / 2;
          if (exclusionBox && isInsideExclusion(midX, midY)) continue;

          const alpha = (1 - dist / cursorLinkDistance) * 0.45;
          const ctrlX = midX - trailVx * 1.4;
          const ctrlY = midY - trailVy * 1.4;

          const grad = ctx.createLinearGradient(mx, my, proj.x, proj.y);
          grad.addColorStop(0, `rgba(216, 93, 58, ${alpha})`);
          grad.addColorStop(1, `rgba(${node.rgb}, ${alpha})`);

          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.quadraticCurveTo(ctrlX, ctrlY, proj.x, proj.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }

        // Primary cursor focal dot
        ctx.beginPath();
        ctx.arc(mx, my, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = '#d85d3a';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#d85d3a';
        ctx.fill();

        ctx.restore();
      }

      // 5. Draw Transformed Web Nodes with rich luminous glowing halos
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        const proj = projectedNodes[i];

        ctx.save();
        // Luminous outer aura/halo (distinctive orb glow matching the reference)
        const haloMultiplier = p.isFeatureOrb ? 3.4 : 2.2;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius * haloMultiplier, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.rgb}, ${p.isFeatureOrb ? 0.30 : 0.16})`;
        ctx.fill();

        // Secondary soft glow for feature orbs
        if (p.isFeatureOrb) {
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, proj.radius * 2.0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.rgb}, 0.38)`;
          ctx.fill();
        }

        // Core star dot
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = proj.inLens ? 18 : (p.isFeatureOrb ? 15 : 8);
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      // 6. Draw Cursor Micro-Sparks
      if (cursorSparks.length > 0) {
        ctx.save();
        for (let k = cursorSparks.length - 1; k >= 0; k--) {
          const spark = cursorSparks[k];
          spark.x += spark.vx;
          spark.y += spark.vy;
          spark.vx *= 0.94;
          spark.vy *= 0.94;
          spark.life -= 1;

          const progress = spark.life / spark.maxLife;
          spark.alpha = Math.max(progress * 0.75, 0);

          if (spark.life <= 0 || spark.alpha <= 0.02) {
            cursorSparks.splice(k, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(spark.x, spark.y, spark.radius * progress, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${spark.color}, ${spark.alpha})`;
          ctx.shadowBlur = 5;
          ctx.shadowColor = spark.glowColor;
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isEnabled]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-0 h-full w-full opacity-100 transition-opacity duration-700 ${className}`}
      />
      {/* Interactive Web Control Dock */}
      {!hideControlDock && (
        <div className="fixed bottom-3 right-3 z-30 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEnabled(!isEnabled)}
            className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-light tracking-wider uppercase bg-neutral-900/85 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800/80 rounded-full backdrop-blur shadow-lg transition-colors group"
            title="Toggle interactive constellation web"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'
              }`}
            />
            <span>WEB FX: {isEnabled ? 'LIVE' : 'PAUSED'}</span>
          </button>
        </div>
      )}
    </>
  );
};
