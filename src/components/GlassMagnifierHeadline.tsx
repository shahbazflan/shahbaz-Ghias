import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GlassMagnifierHeadlineProps {
  text?: string;
  className?: string;
}

export const GlassMagnifierHeadline: React.FC<GlassMagnifierHeadlineProps> = ({
  text = 'Shahbaz Ahmed',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 850, height: 120 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Measure container dimensions continuously and accurately so magnified layer aligns with sub-pixel precision
  const updateSize = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize({ width: rect.width, height: rect.height });
      }
    }
  }, []);

  useEffect(() => {
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // ResizeObserver ensures updates even when fonts finish loading or layout reflows
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(containerRef.current);
    }

    const timer = setTimeout(updateSize, 100);
    return () => {
      window.removeEventListener('resize', updateSize);
      if (resizeObserver) resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [updateSize]);

  // Synchronous real-time tracking: updates instantly with mouse movement (0ms lag)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    setMousePos({ x, y });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    updateSize();
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      setMousePos({ x, y });
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Lens geometry & optical scaling
  const isMobile = containerSize.width < 640;
  const lensSize = isMobile ? 130 : 175;
  const radius = lensSize / 2;
  const magnification = 1.75;

  // Kinetic cursor-following movement calculations
  // As the user moves their cursor over the text, the text physically moves and tilts with spatial depth!
  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;
  const normX = centerX > 0 ? (mousePos.x - centerX) / centerX : 0; // -1 to 1
  const normY = centerY > 0 ? (mousePos.y - centerY) / centerY : 0; // -1 to 1

  // Dynamic displacement values
  const textShiftX = isHovered ? normX * 18 : 0;
  const textShiftY = isHovered ? normY * 12 : 0;
  const textRotateY = isHovered ? normX * 7 : 0;
  const textRotateX = isHovered ? -normY * 6 : 0;

  // Break words into discrete spans with identical styling across both layers
  // This ensures "SHAHBAZ" and "AHMED" are stacked vertically matching the typographic reference
  const words = text.trim().split(/\s+/);
  const word1 = words[0] || 'SHAHBAZ';
  const word2 = words.slice(1).join(' ') || 'AHMED';

  const renderTextContent = (isMagnified = false) => (
    <div
      className={`flex flex-col tracking-tight leading-[0.88] uppercase font-name-zalando text-5xl sm:text-7xl md:text-8xl lg:text-[6.75rem] font-extrabold select-none ${
        isMagnified ? 'text-white' : 'text-white'
      }`}
      style={{
        fontFamily: "'Zalando Sans Expanded', 'Zalando Sans', system-ui, -apple-system, sans-serif",
        fontWeight: 800,
        fontStretch: 'expanded',
      }}
    >
      <span className="inline-block transition-transform duration-75">
        {word1}
      </span>
      <span className="inline-block transition-transform duration-75">
        {word2}
      </span>
    </div>
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block select-none cursor-crosshair perspective-[1000px] ${className}`}
      style={{ isolation: 'isolate' }}
    >
      {/* 1. Base Typography with Dynamic Kinetic Movement: moves & tilts when cursor moves */}
      <motion.div
        animate={{
          x: textShiftX,
          y: textShiftY,
          rotateX: textRotateX,
          rotateY: textRotateY,
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 220,
          mass: 0.5,
        }}
        className="will-change-transform transform-gpu"
      >
        <h1>
          {renderTextContent(false)}
        </h1>
      </motion.div>

      {/* 2. Real Optical Emerald Glass Magnifying Lens: accurately magnifies SHAHBAZ AND AHMED */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.35 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className="absolute rounded-full pointer-events-none overflow-hidden select-none shadow-2xl"
            style={{
              width: lensSize,
              height: lensSize,
              left: mousePos.x - radius,
              top: mousePos.y - radius,
              zIndex: 30,
              backgroundColor: '#090a0c', // Masks unmagnified text underneath so only magnified text shows!
              border: '2px solid rgba(255, 255, 255, 0.92)',
              boxShadow: `
                inset 0 0 28px rgba(16, 185, 129, 0.85),
                inset 3px 6px 14px rgba(255, 255, 255, 0.95),
                inset -5px -8px 20px rgba(0, 0, 0, 0.95),
                0 20px 45px rgba(0, 0, 0, 0.85),
                0 0 45px rgba(16, 185, 129, 0.6)
              `,
            }}
          >
            {/* The Actual Text magnified in-place inside the lens, with matching kinetic displacement */}
            <div
              className="absolute pointer-events-none select-none"
              style={{
                width: containerSize.width,
                height: containerSize.height,
                left: -(mousePos.x * magnification - radius) + textShiftX * (magnification - 1),
                top: -(mousePos.y * magnification - radius) + textShiftY * (magnification - 1),
                transformOrigin: '0 0',
                transform: `scale(${magnification})`,
              }}
            >
              {renderTextContent(true)}
            </div>

            {/* Emerald Glass Volumetric Tint (Matching Reference) */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 35% 30%, rgba(52, 211, 153, 0.38) 0%, rgba(16, 185, 129, 0.55) 52%, rgba(4, 120, 87, 0.92) 100%)',
                mixBlendMode: 'screen',
              }}
            />

            {/* Deep Glass Refractive Ambient Occlusion Shadow */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.72) 0%, transparent 60%)',
              }}
            />

            {/* Distinctive Curved Specular Crescent Reflection (Reference exact match) */}
            <div
              className="absolute top-2.5 left-3.5 rounded-full pointer-events-none"
              style={{
                width: lensSize * 0.58,
                height: lensSize * 0.35,
                background:
                  'radial-gradient(ellipse at 38% 28%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.6) 32%, transparent 70%)',
                transform: 'rotate(-25deg)',
                filter: 'blur(0.3px)',
              }}
            />

            {/* Studio Light Glare Bar */}
            <div
              className="absolute top-4 left-5 rounded-full bg-white/60 blur-[0.4px] -rotate-15 pointer-events-none"
              style={{
                width: lensSize * 0.08,
                height: lensSize * 0.24,
              }}
            />

            {/* Secondary Bottom-Right Caustic Bounce Highlight */}
            <div
              className="absolute bottom-2.5 right-3.5 rounded-full pointer-events-none"
              style={{
                width: lensSize * 0.44,
                height: lensSize * 0.28,
                background:
                  'radial-gradient(ellipse at 60% 70%, rgba(167, 243, 208, 0.55) 0%, transparent 70%)',
                transform: 'rotate(25deg)',
              }}
            />

            {/* Fine Perimeter Chromatic Ring */}
            <div className="absolute inset-1 rounded-full pointer-events-none border border-emerald-400/35 opacity-80" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
