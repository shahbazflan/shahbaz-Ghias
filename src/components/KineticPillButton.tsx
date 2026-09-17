import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface KineticPillButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant: 'email' | 'linkedin' | 'canva' | 'whatsapp' | 'custom';
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  copied?: boolean;
  className?: string;
}

export const KineticPillButton: React.FC<KineticPillButtonProps> = ({
  children,
  icon,
  variant,
  href,
  onClick,
  target = '_blank',
  rel = 'noopener noreferrer',
  copied = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Synchronous real-time tracking of cursor position relative to this pill
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    setMousePos({ x, y });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
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

  // Kinetic 3D physics calculation identical to Shahbaz Ahmed text
  const width = containerRef.current ? containerRef.current.offsetWidth : 220;
  const height = containerRef.current ? containerRef.current.offsetHeight : 50;
  const centerX = width / 2;
  const centerY = height / 2;

  const normX = centerX > 0 ? (mousePos.x - centerX) / centerX : 0; // -1 to 1
  const normY = centerY > 0 ? (mousePos.y - centerY) / centerY : 0; // -1 to 1

  // 3D physical displacement and tilt
  const textShiftX = isHovered ? normX * 14 : 0;
  const textShiftY = isHovered ? normY * 9 : 0;
  const textRotateY = isHovered ? normX * 12 : 0;
  const textRotateX = isHovered ? -normY * 12 : 0;
  const pillScale = isHovered ? 1.04 : 1.0;

  // Variants styling & color animations
  const getVariantStyles = () => {
    if (copied) {
      return {
        bg: 'bg-emerald-500',
        text: 'text-white font-light',
        border: 'border-emerald-400',
        shadow: 'shadow-[0_12px_32px_rgba(16,185,129,0.45)]',
        caustic: 'rgba(255, 255, 255, 0.4)',
      };
    }

    switch (variant) {
      case 'email':
        return {
          defaultBg: 'bg-white',
          hoverBg: 'bg-gradient-to-r from-[#ff6b4a] via-[#d85d3a] to-[#c24524]',
          defaultText: 'text-neutral-950 font-light',
          hoverText: 'text-white font-normal',
          defaultBorder: 'border-white',
          hoverBorder: 'border-[#ff8366]',
          defaultShadow: 'shadow-lg shadow-black/40',
          hoverShadow: 'shadow-[0_14px_36px_rgba(216,93,58,0.55)]',
          caustic: 'rgba(255, 255, 255, 0.55)',
        };
      case 'linkedin':
        return {
          defaultBg: 'bg-[#0a66c2]/15',
          hoverBg: 'bg-gradient-to-r from-[#0a66c2] via-[#0077b5] to-[#005582]',
          defaultText: 'text-[#38bdf8] font-normal',
          hoverText: 'text-white font-medium',
          defaultBorder: 'border-[#0a66c2]/50',
          hoverBorder: 'border-[#38bdf8]',
          defaultShadow: 'shadow-md shadow-[#0a66c2]/20',
          hoverShadow: 'shadow-[0_14px_36px_rgba(10,102,194,0.6)]',
          caustic: 'rgba(10, 102, 194, 0.6)',
        };
      case 'whatsapp':
        return {
          defaultBg: 'bg-neutral-900/90',
          hoverBg: 'bg-gradient-to-r from-[#25d366] via-[#128c7e] to-[#075e54]',
          defaultText: 'text-neutral-200 font-light',
          hoverText: 'text-white font-normal',
          defaultBorder: 'border-neutral-700/80',
          hoverBorder: 'border-[#25d366]',
          defaultShadow: 'shadow-md shadow-black/30',
          hoverShadow: 'shadow-[0_14px_36px_rgba(37,211,102,0.5)]',
          caustic: 'rgba(37, 211, 102, 0.55)',
        };
      case 'canva':
        return {
          defaultBg: 'bg-gradient-to-r from-[#00c4cc]/15 via-[#5d3bf6]/15 to-[#7d2ae8]/15',
          hoverBg: 'bg-gradient-to-r from-[#00c4cc] via-[#5d3bf6] to-[#7d2ae8]',
          defaultText: 'text-[#00c4cc] font-normal',
          hoverText: 'text-white font-medium',
          defaultBorder: 'border-[#00c4cc]/50',
          hoverBorder: 'border-[#7d2ae8]',
          defaultShadow: 'shadow-md shadow-[#00c4cc]/20',
          hoverShadow: 'shadow-[0_14px_36px_rgba(0,196,204,0.6)]',
          caustic: 'rgba(0, 196, 204, 0.6)',
        };
      default:
        return {
          defaultBg: 'bg-neutral-900/90',
          hoverBg: 'bg-[#d85d3a]',
          defaultText: 'text-neutral-200 font-light',
          hoverText: 'text-white font-normal',
          defaultBorder: 'border-neutral-700',
          hoverBorder: 'border-[#d85d3a]',
          defaultShadow: 'shadow-md shadow-black/30',
          hoverShadow: 'shadow-[0_14px_36px_rgba(216,93,58,0.5)]',
          caustic: 'rgba(255, 255, 255, 0.4)',
        };
    }
  };

  const currentStyles = getVariantStyles();

  const buttonContent = (
    <motion.div
      animate={{
        x: textShiftX,
        y: textShiftY,
        rotateX: textRotateX,
        rotateY: textRotateY,
        scale: pillScale,
      }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 260,
        mass: 0.45,
      }}
      className={`relative inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full border transition-all duration-300 select-none overflow-hidden cursor-pointer ${
        copied
          ? `${currentStyles.bg} ${currentStyles.text} ${currentStyles.border} ${currentStyles.shadow}`
          : isHovered
          ? `${currentStyles.hoverBg} ${currentStyles.hoverText} ${currentStyles.hoverBorder} ${currentStyles.hoverShadow}`
          : `${currentStyles.defaultBg} ${currentStyles.defaultText} ${currentStyles.defaultBorder} ${currentStyles.defaultShadow}`
      } ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Real-time Optical Spotlight / Caustic Lens following cursor inside the button */}
      {isHovered && (
        <>
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle 100px at ${mousePos.x}px ${mousePos.y}px, ${currentStyles.caustic}, transparent 75%)`,
            }}
          />
          {/* Concentric specular lens ring matching Shahbaz Ahmed magnifier */}
          <div
            className="absolute pointer-events-none rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.35)] -translate-x-1/2 -translate-y-1/2"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              width: 58,
              height: 58,
            }}
          />
        </>
      )}

      {/* Animated Sheen / Shimmer Sweep on hover */}
      {isHovered && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '250%' }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 pointer-events-none"
        />
      )}

      {/* Dynamic Icon */}
      {icon && (
        <motion.span
          animate={{
            scale: isHovered ? 1.2 : 1.0,
            x: isHovered && variant !== 'email' ? 3 : 0,
            y: isHovered && variant !== 'email' ? -3 : 0,
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="relative z-10 shrink-0"
          style={{ transform: 'translateZ(25px)' }}
        >
          {icon}
        </motion.span>
      )}

      {/* Label Text with Subtle Character Tracking */}
      <span
        className="relative z-10 uppercase tracking-wide font-light text-xs sm:text-[12.5px] whitespace-nowrap"
        style={{ transform: 'translateZ(20px)' }}
      >
        {children}
      </span>
    </motion.div>
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block perspective-[800px]"
    >
      {href ? (
        <a
          href={href}
          target={target}
          rel={rel}
          className="block outline-none"
        >
          {buttonContent}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className="block outline-none"
        >
          {buttonContent}
        </button>
      )}
    </div>
  );
};
