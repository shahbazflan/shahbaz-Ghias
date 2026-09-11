import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleOnMount?: boolean;
  hoverOnly?: boolean;
  delay?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'p' | 'button';
  onClick?: () => void;
  id?: string;
  glow?: boolean;
  lensDiameter?: number;
  bgColor?: string;
}

/**
 * Optical Emerald Glass Magnifying Text:
 * Takes effect ONLY when hovering over the text, magnifying only that part directly under the cursor.
 * Features realistic convex lens magnification on the ACTUAL text, emerald volumetric gradient tint, and specular highlights.
 */
export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = '',
  onClick,
  id,
  lensDiameter = 54,
  bgColor = '#0b0d10',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 80, height: 24 });
  const containerRef = useRef<HTMLSpanElement>(null);

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
  }, [updateSize, text]);

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    setMousePos({ x, y });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    updateSize();
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      setMousePos({ x, y });
    }
    setIsHovered(true);
  };

  const orbSize = lensDiameter;
  const radius = orbSize / 2;
  const scale = 1.65;

  return (
    <span
      ref={containerRef}
      id={id}
      className={`relative inline-block select-none cursor-pointer ${className}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovered(false)}
      style={{ isolation: 'isolate' }}
    >
      {/* 1. Base Pristine Text */}
      <span className="relative z-10 transition-colors duration-200">
        {text}
      </span>

      {/* 2. Real Optical Emerald Glass Magnifier (Takes effect ONLY on hover, directly magnifying the actual text) */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute rounded-full pointer-events-none overflow-hidden select-none z-30 shadow-2xl"
            style={{
              width: orbSize,
              height: orbSize,
              left: mousePos.x - radius,
              top: mousePos.y - radius,
              backgroundColor: bgColor, // Masks unmagnified text underneath so only magnified text is visible!
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              boxShadow: `
                inset 0 0 16px rgba(16, 185, 129, 0.85),
                inset 2px 3px 8px rgba(255, 255, 255, 0.95),
                inset -2px -4px 10px rgba(0, 0, 0, 0.85),
                0 10px 22px rgba(0, 0, 0, 0.75),
                0 0 24px rgba(16, 185, 129, 0.55)
              `,
            }}
          >
            {/* The actual text magnified in-place inside the lens */}
            <span
              className="absolute pointer-events-none select-none uppercase whitespace-nowrap text-white font-bold"
              style={{
                width: containerSize.width,
                height: containerSize.height,
                left: -(mousePos.x * scale - radius),
                top: -(mousePos.y * scale - radius),
                transformOrigin: '0 0',
                transform: `scale(${scale})`,
                fontFamily: 'inherit',
                letterSpacing: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {text}
            </span>

            {/* Emerald Glass Volumetric Tint (Matching Reference) */}
            <span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 35% 30%, rgba(52, 211, 153, 0.4) 0%, rgba(16, 185, 129, 0.55) 55%, rgba(4, 120, 87, 0.92) 100%)',
                mixBlendMode: 'screen',
              }}
            />

            {/* Glass Shadow Depth */}
            <span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.65) 0%, transparent 60%)',
              }}
            />

            {/* Curved Specular Crescent Reflection */}
            <span
              className="absolute top-1 left-1.5 rounded-full pointer-events-none"
              style={{
                width: orbSize * 0.56,
                height: orbSize * 0.34,
                background:
                  'radial-gradient(ellipse at 35% 30%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.5) 35%, transparent 70%)',
                transform: 'rotate(-25deg)',
              }}
            />

            {/* Studio Light Glare Bar */}
            <span
              className="absolute top-1.5 left-2 rounded-full bg-white/60 blur-[0.3px] -rotate-15 pointer-events-none"
              style={{
                width: orbSize * 0.08,
                height: orbSize * 0.22,
              }}
            />

            {/* Secondary Bottom Rim Light */}
            <span
              className="absolute bottom-1 right-1.5 rounded-full pointer-events-none"
              style={{
                width: orbSize * 0.4,
                height: orbSize * 0.25,
                background:
                  'radial-gradient(ellipse at 60% 70%, rgba(167, 243, 208, 0.55) 0%, transparent 70%)',
                transform: 'rotate(25deg)',
              }}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

export const MagnifyText = ScrambleText;
