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

    // Responsive node count (22 on mobile, 38 on desktop)
    const isMobile = width < 768;
    const nodeCount = isMobile ? 22 : 38;
    const maxLinkDistance = isMobile ? 135 : 175;
    const cursorLinkDistance = isMobile ? 140 : 185;

    // Measure exclusion zone for text/content area so the web NEVER overlaps text or modal
    let exclusionBox: { left: number; top: number; right: number; bottom: number } | null = null;
    const updateExclusionBox = () => {
      const targetId = exclusionIdRef.current || 'hero-content-exclusion';
      const el = document.getElementById(targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.bottom > 0 && rect.top < height) {
          const padX = isMobile ? 25 : 50;
          const padY = isMobile ? 20 : 38;
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

    // Helper: test if point is inside exclusion box
    const isInsideExclusion = (x: number, y: number) => {
      if (!exclusionBox) return false;
      return (
        x >= exclusionBox.left &&
        x <= exclusionBox.right &&
        y >= exclusionBox.top &&
        y <= exclusionBox.bottom
      );
    };

    // Initialize Web Nodes (pure luminous dots, zero text)
    const nodes: WebNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const colorObj = NODE_COLORS[i % NODE_COLORS.length];
      const radius = Math.random() * 1.1 + 2.1; // small dots: 2.1px to 3.2px

      let startX = Math.random() * width;
      let startY = Math.random() * height;

      // If spawning inside exclusion area, push to outside
      if (exclusionBox && isInsideExclusion(startX, startY)) {
        if (Math.random() > 0.5) {
          startX = Math.random() > 0.5 ? Math.random() * Math.max(0, exclusionBox.left - 25) : exclusionBox.right + 25 + Math.random() * (width - exclusionBox.right - 25);
        } else {
          startY = Math.random() > 0.5 ? Math.random() * Math.max(0, exclusionBox.top - 25) : exclusionBox.bottom + 25 + Math.random() * (height - exclusionBox.bottom - 25);
        }
      }

      nodes.push({
        id: i,
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 0.40,
        vy: (Math.random() - 0.5) * 0.40,
        radius,
        baseRadius: radius,
        color: colorObj.hex,
        rgb: colorObj.rgb,
        pulsePhase: Math.random() * Math.PI * 2,
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
      const spawnCount = Math.min(Math.max(Math.floor(speed / 7), 1), 3);
      for (let s = 0; s < spawnCount; s++) {
        if (cursorSparks.length >= 60) {
          cursorSparks.shift();
        }
        const angle = Math.random() * Math.PI * 2;
        const spreadSpeed = Math.random() * 1.4 + 0.3;
        const colorObj = NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)];
        const life = Math.random() * 22 + 18;

        cursorSparks.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * spreadSpeed + mouseRef.current.vx * 0.15,
          vy: Math.sin(angle) * spreadSpeed + mouseRef.current.vy * 0.15 - 0.1,
          radius: Math.random() * 1.5 + 1,
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

    const render = () => {
      frameCount++;
      // Periodically refresh exclusion box coordinates to account for any layout updates
      if (frameCount % 30 === 0) {
        updateExclusionBox();
      }

      ctx.clearRect(0, 0, width, height);

      // Update smooth cursor trailing anchor for organic line drift
      if (mouseRef.current.active) {
        if (trailX === -1000) {
          trailX = mouseRef.current.x;
          trailY = mouseRef.current.y;
        }
        const spring = 0.12;
        const damping = 0.84;
        trailVx = (trailVx + (mouseRef.current.x - trailX) * spring) * damping;
        trailVy = (trailVy + (mouseRef.current.y - trailY) * spring) * damping;
        trailX += trailVx;
        trailY += trailVy;
      }

      // 1. Update and drift Web Nodes with dynamic repulsion from text exclusion zone
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulsePhase += 0.022;

        // Soft bounce off canvas edges
        if (p.x < 15) {
          p.x = 15;
          p.vx = Math.abs(p.vx);
        } else if (p.x > width - 15) {
          p.x = width - 15;
          p.vx = -Math.abs(p.vx);
        }
        if (p.y < 15) {
          p.y = 15;
          p.vy = Math.abs(p.vy);
        } else if (p.y > height - 15) {
          p.y = height - 15;
          p.vy = -Math.abs(p.vy);
        }

        // TEXT EXCLUSION: Repel nodes smoothly away from hero text zone so they never overlap text!
        if (exclusionBox && isInsideExclusion(p.x, p.y)) {
          const dLeft = p.x - exclusionBox.left;
          const dRight = exclusionBox.right - p.x;
          const dTop = p.y - exclusionBox.top;
          const dBottom = exclusionBox.bottom - p.y;
          const minD = Math.min(dLeft, dRight, dTop, dBottom);

          if (minD === dLeft) {
            p.x = exclusionBox.left - 3;
            p.vx = -Math.abs(p.vx || 0.35);
          } else if (minD === dRight) {
            p.x = exclusionBox.right + 3;
            p.vx = Math.abs(p.vx || 0.35);
          } else if (minD === dTop) {
            p.y = exclusionBox.top - 3;
            p.vy = -Math.abs(p.vy || 0.35);
          } else {
            p.y = exclusionBox.bottom + 3;
            p.vy = Math.abs(p.vy || 0.35);
          }
        }

        // Mouse organic attraction, deflection, and trailing wake drift
        if (mouseRef.current.active) {
          const mdx = mouseRef.current.x - p.x;
          const mdy = mouseRef.current.y - p.y;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < 170 && mDist > 8) {
            const influence = 1 - mDist / 170;
            const force = influence * 0.28;
            p.x += (mdx / mDist) * force;
            p.y += (mdy / mDist) * force;

            // Fluid trailing wake: nodes gently drift in the wake of the cursor movement
            p.vx += trailVx * influence * 0.018;
            p.vy += trailVy * influence * 0.018;
          }
        }

        // Gentle velocity damping to preserve smooth ambient drift
        p.vx *= 0.992;
        p.vy *= 0.992;
      }

      // 2. Draw Connecting Web Lines (Thicker, refined opacity, never slicing through text)
      ctx.save();
      for (let i = 0; i < nodes.length; i++) {
        const p1 = nodes[i];

        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;

          // Quick bounding box cull
          if (Math.abs(dx) > maxLinkDistance || Math.abs(dy) > maxLinkDistance) continue;

          const dist = Math.hypot(dx, dy);
          if (dist < maxLinkDistance) {
            // Check if midpoint of line crosses into the hero text exclusion box
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            if (exclusionBox && isInsideExclusion(midX, midY)) {
              continue; // Do not draw line through the text area
            }

            const normalizedDist = dist / maxLinkDistance;
            // Slightly thicker line (1.2px) with balanced, subtle alpha ("little thick bt not so obvious")
            const alpha = (1 - normalizedDist) * 0.36;

            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            grad.addColorStop(0, `rgba(${p1.rgb}, ${alpha})`);
            grad.addColorStop(1, `rgba(${p2.rgb}, ${alpha})`);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.2; // Slightly thicker than hairline, clean & refined
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // 3. Connect Mouse Cursor to Web (with subtle trailing motion drift and depth)
      if (mouseRef.current.active) {
        ctx.save();
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;

        // If mouse is inside text exclusion, don't draw overlapping cursor links across text
        const mouseInText = exclusionBox && isInsideExclusion(mx, my);

        if (!mouseInText) {
          const mouseLinks: { node: WebNode; dist: number }[] = [];
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const dist = Math.hypot(mx - node.x, my - node.y);
            if (dist < cursorLinkDistance) {
              mouseLinks.push({ node, dist });
            }
          }

          mouseLinks.sort((a, b) => a.dist - b.dist);
          const topLinks = mouseLinks.slice(0, 5);

          const lagDist = Math.hypot(mx - trailX, my - trailY);

          for (const link of topLinks) {
            const { node, dist } = link;
            const midX = (mx + node.x) / 2;
            const midY = (my + node.y) / 2;
            if (exclusionBox && isInsideExclusion(midX, midY)) continue;

            const alpha = (1 - dist / cursorLinkDistance) * 0.5;

            // Elastic control point that slightly curves and drifts behind cursor velocity vector
            const ctrlX = midX - trailVx * 1.7;
            const ctrlY = midY - trailVy * 1.7;

            // 1. Subtle secondary trailing ghost line (creates depth and drifting lag behind cursor)
            if (lagDist > 1.5) {
              const trailAlpha = alpha * 0.35;
              const trailGrad = ctx.createLinearGradient(trailX, trailY, node.x, node.y);
              trailGrad.addColorStop(0, `rgba(216, 93, 58, ${trailAlpha})`);
              trailGrad.addColorStop(1, `rgba(${node.rgb}, ${trailAlpha * 0.4})`);

              ctx.beginPath();
              ctx.moveTo(trailX, trailY);
              ctx.lineTo(node.x, node.y);
              ctx.strokeStyle = trailGrad;
              ctx.lineWidth = 0.9;
              ctx.stroke();
            }

            // 2. Primary elastic web line with subtle trailing curve
            const grad = ctx.createLinearGradient(mx, my, node.x, node.y);
            grad.addColorStop(0, `rgba(216, 93, 58, ${alpha})`);
            grad.addColorStop(0.7, `rgba(${node.rgb}, ${alpha * 0.85})`);
            grad.addColorStop(1, `rgba(${node.rgb}, ${alpha})`);

            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.quadraticCurveTo(ctrlX, ctrlY, node.x, node.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.25;
            ctx.stroke();
          }

          // Trailing cursor echo dot drifting behind cursor
          if (lagDist > 2) {
            ctx.beginPath();
            ctx.arc(trailX, trailY, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(216, 93, 58, 0.45)';
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#d85d3a';
            ctx.fill();

            // Faint trailing thread between active cursor and trailing anchor
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(trailX, trailY);
            ctx.strokeStyle = 'rgba(216, 93, 58, 0.28)';
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // Small primary cursor focal glow
        ctx.beginPath();
        ctx.arc(mx, my, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#d85d3a';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#d85d3a';
        ctx.fill();

        ctx.restore();
      }

      // 4. Draw Small Dots & Non-Glowing Labels
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        const pulse = Math.sin(p.pulsePhase) * 0.4 + 1; // 0.6 to 1.4
        const currentRadius = p.radius * (0.92 + pulse * 0.16);

        // Soft outer glow halo for dot
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.rgb}, 0.15)`;
        ctx.fill();

        // Core colored small dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      // 5. Draw Cursor Micro-Sparks
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
        className={`pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90 transition-opacity duration-700 ${className}`}
      />
      {/* Interactive Web Control Dock */}
      {!hideControlDock && (
        <div className="fixed bottom-3 right-3 z-30 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEnabled(!isEnabled)}
            className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono tracking-wider uppercase bg-neutral-900/85 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800/80 rounded-full backdrop-blur shadow-lg transition-colors group"
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
