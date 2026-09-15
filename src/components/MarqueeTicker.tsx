import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Compass, Film, Play, Star, MoveHorizontal } from 'lucide-react';

export const MarqueeTicker: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const singleSetRef = useRef<HTMLDivElement | null>(null);

  // Animation physics state (kept in refs for zero React re-renders during 60/120fps scrolling)
  const offsetRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const singleSetWidthRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(0);

  // Pointer drag tracking
  const pointerStartXRef = useRef<number>(0);
  const pointerStartYRef = useRef<number>(0);
  const lastPointerXRef = useRef<number>(0);
  const lastPointerTimeRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);

  const [isInteracting, setIsInteracting] = useState(false);

  const items = [
    { label: 'MOTION GRAPHICS', icon: <Sparkles className="w-3 h-3 text-[#d85d3a]" /> },
    { label: 'AI CONCEPT DESIGN', icon: <Star className="w-3 h-3 text-[#d85d3a]" /> },
    { label: 'VISUAL DYNAMICS & MOTION', icon: <Compass className="w-3 h-3 text-[#d85d3a]" /> },
    { label: 'BROADCAST COMMERCIALS', icon: <Film className="w-3 h-3 text-[#d85d3a]" /> },
    { label: 'KINETIC TYPOGRAPHY', icon: <Sparkles className="w-3 h-3 text-[#d85d3a]" /> },
    { label: 'VEO 3 & MIDJOURNEY PIPELINE', icon: <Play className="w-3 h-3 text-[#d85d3a]" /> },
    { label: '15+ YEARS UAE EXPERIENCE', icon: <Star className="w-3 h-3 text-[#d85d3a]" /> },
    { label: 'DUBAI & GLOBAL CREATIVE', icon: <Compass className="w-3 h-3 text-[#d85d3a]" /> },
  ];

  // Measure single item set width and update on window resize
  useEffect(() => {
    const updateWidth = () => {
      if (singleSetRef.current) {
        singleSetWidthRef.current = singleSetRef.current.offsetWidth;
      }
    };

    updateWidth();

    let resizeObserver: ResizeObserver | null = null;
    if (singleSetRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateWidth);
      resizeObserver.observe(singleSetRef.current);
    }

    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  // Main 60-120fps animation loop with continuous auto-scroll, momentum glide, and infinite wrapping
  useEffect(() => {
    let animationFrameId: number;
    const baseAutoSpeed = 40; // px per second to the left

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min(0.064, (timestamp - lastTimeRef.current) / 1000); // delta in seconds
      lastTimeRef.current = timestamp;

      if (!isDraggingRef.current) {
        // If there's flick velocity from a swipe, glide with exponential decay friction
        if (Math.abs(velocityRef.current) > 8) {
          offsetRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(0.92, dt * 60);
        } else {
          velocityRef.current = 0;
          // Normal auto-scroll leftwards when not hovered or dragged
          if (!isHoveredRef.current) {
            offsetRef.current -= baseAutoSpeed * dt;
          }
        }
      }

      // Seamless infinite wrapping
      const singleWidth = singleSetWidthRef.current;
      if (singleWidth > 0) {
        while (offsetRef.current <= -singleWidth) {
          offsetRef.current += singleWidth;
        }
        while (offsetRef.current > 0) {
          offsetRef.current -= singleWidth;
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Pointer event handlers for swipe / drag gestures
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    pointerStartXRef.current = e.clientX;
    pointerStartYRef.current = e.clientY;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    const deltaX = e.clientX - pointerStartXRef.current;
    const deltaY = e.clientY - pointerStartYRef.current;

    // Check gesture direction if not yet locked into horizontal dragging
    if (!isDraggingRef.current) {
      // If user is clearly scrolling the page vertically, cancel ticker drag
      if (Math.abs(deltaY) > 8 && Math.abs(deltaY) > Math.abs(deltaX)) {
        isPointerDownRef.current = false;
        return;
      }
      // If user is swiping horizontally, activate ticker drag
      if (Math.abs(deltaX) > 5) {
        isDraggingRef.current = true;
        setIsInteracting(true);
        try {
          containerRef.current?.setPointerCapture(e.pointerId);
        } catch {
          // pointer capture unsupported or already active
        }
      }
    }

    if (isDraggingRef.current) {
      const now = performance.now();
      const moveX = e.clientX - lastPointerXRef.current;
      const dt = Math.max(1, now - lastPointerTimeRef.current);

      offsetRef.current += moveX;
      // Calculate swipe velocity in px/sec
      velocityRef.current = (moveX / dt) * 1000;

      lastPointerXRef.current = e.clientX;
      lastPointerTimeRef.current = now;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      // Limit extreme fling velocities to preserve readable glide
      velocityRef.current = Math.max(-2200, Math.min(2200, velocityRef.current));
      try {
        containerRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // safety guard
      }
    }

    isPointerDownRef.current = false;
    isDraggingRef.current = false;
    setIsInteracting(false);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    isDraggingRef.current = false;
    setIsInteracting(false);
    try {
      containerRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // safety guard
    }
  };

  return (
    <div
      ref={containerRef}
      id="marquee-ticker-container"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      className={`relative w-full overflow-hidden border-y border-neutral-800/80 bg-[#090a0c]/90 py-3.5 select-none z-10 backdrop-blur-sm touch-pan-y ${
        isInteracting ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      aria-label="Interactive portfolio marquee ticker. Drag or swipe horizontally to scroll."
    >
      {/* Edge Gradient Shadow Masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#090a0c] to-transparent z-20" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#090a0c] to-transparent z-20" />

      {/* Swipe Interactive Indicator Pill (Subtle visual affordance on mobile/touch) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-[10px] font-light text-neutral-400 opacity-60 hover:opacity-100 transition-opacity">
        <MoveHorizontal className="w-3 h-3 text-[#d85d3a]" />
        <span>SWIPE TO SCROLL</span>
      </div>

      {/* Scrolling / Draggable Track Container */}
      <div
        ref={trackRef}
        className="inline-flex items-center whitespace-nowrap will-change-transform"
      >
        {/* Set 1: Measured set for dynamic loop boundary calculation */}
        <div ref={singleSetRef} className="inline-flex items-center shrink-0">
          {items.map((item, idx) => (
            <div key={`set1-${idx}`} className="inline-flex items-center gap-3 mx-5 sm:mx-6 group">
              <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                {item.icon}
              </span>
              <span className="text-xs tracking-wider font-light text-neutral-400 group-hover:text-white transition-colors uppercase">
                {item.label}
              </span>
              <span className="text-neutral-700 mx-2 text-xs">/</span>
            </div>
          ))}
        </div>

        {/* Repeating Set 2 */}
        <div className="inline-flex items-center shrink-0">
          {items.map((item, idx) => (
            <div key={`set2-${idx}`} className="inline-flex items-center gap-3 mx-5 sm:mx-6 group">
              <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                {item.icon}
              </span>
              <span className="text-xs tracking-wider font-light text-neutral-400 group-hover:text-white transition-colors uppercase">
                {item.label}
              </span>
              <span className="text-neutral-700 mx-2 text-xs">/</span>
            </div>
          ))}
        </div>

        {/* Repeating Set 3 */}
        <div className="inline-flex items-center shrink-0">
          {items.map((item, idx) => (
            <div key={`set3-${idx}`} className="inline-flex items-center gap-3 mx-5 sm:mx-6 group">
              <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                {item.icon}
              </span>
              <span className="text-xs tracking-wider font-light text-neutral-400 group-hover:text-white transition-colors uppercase">
                {item.label}
              </span>
              <span className="text-neutral-700 mx-2 text-xs">/</span>
            </div>
          ))}
        </div>

        {/* Repeating Set 4 (Ensures no gaps on ultra-wide 4K screens) */}
        <div className="inline-flex items-center shrink-0">
          {items.map((item, idx) => (
            <div key={`set4-${idx}`} className="inline-flex items-center gap-3 mx-5 sm:mx-6 group">
              <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                {item.icon}
              </span>
              <span className="text-xs tracking-wider font-light text-neutral-400 group-hover:text-white transition-colors uppercase">
                {item.label}
              </span>
              <span className="text-neutral-700 mx-2 text-xs">/</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
