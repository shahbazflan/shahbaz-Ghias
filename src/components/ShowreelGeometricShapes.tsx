import React from 'react';
import { motion } from 'motion/react';

export const ShowreelGeometricShapes: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none -z-0">
      {/* Ambient Atmospheric Glow Orbs (warm terracotta & electric blue) that bleed across the full viewport */}
      <motion.div
        animate={{
          x: [-25, 25, -25],
          y: [-20, 20, -20],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-20 sm:-left-32 w-[28rem] sm:w-[38rem] h-[28rem] sm:h-[38rem] rounded-full bg-[#d85d3a]/12 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          x: [25, -25, 25],
          y: [20, -20, 20],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-32 -right-20 sm:-right-32 w-[28rem] sm:w-[38rem] h-[28rem] sm:h-[38rem] rounded-full bg-[#38bdf8]/12 blur-3xl pointer-events-none"
      />
      {/* Center ambient warm drift */}
      <motion.div
        animate={{
          opacity: [0.04, 0.08, 0.04],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-96 rounded-full bg-[#d85d3a]/8 blur-3xl pointer-events-none"
      />

      {/* Rotating Concentric Motion Rings (Top Right) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        className="absolute top-6 right-12 md:right-32 w-64 h-64 opacity-20"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="rgba(216, 93, 58, 0.4)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1"
          />
          <circle
            cx="100"
            cy="100"
            r="40"
            fill="none"
            stroke="rgba(56, 189, 248, 0.35)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
          <line x1="100" y1="10" x2="100" y2="30" stroke="rgba(216, 93, 58, 0.6)" strokeWidth="1.5" />
          <line x1="100" y1="170" x2="100" y2="190" stroke="rgba(216, 93, 58, 0.6)" strokeWidth="1.5" />
          <line x1="10" y1="100" x2="30" y2="100" stroke="rgba(216, 93, 58, 0.6)" strokeWidth="1.5" />
          <line x1="170" y1="100" x2="190" y2="100" stroke="rgba(216, 93, 58, 0.6)" strokeWidth="1.5" />
        </svg>
      </motion.div>

      {/* Floating Isometric Motion Cube Outline (Bottom Left) */}
      <motion.div
        animate={{
          y: [-12, 14, -12],
          rotate: [-4, 6, -4],
          x: [-6, 6, -6],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-8 md:left-20 w-44 h-44 opacity-15"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Isometric Cube Wireframe */}
          <polygon points="50,15 85,35 50,55 15,35" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <polygon points="15,35 50,55 50,90 15,70" fill="none" stroke="rgba(216, 93, 58, 0.5)" strokeWidth="1" />
          <polygon points="50,55 85,35 85,70 50,90" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
          {/* Inner accent node */}
          <circle cx="50" cy="55" r="2.5" fill="#d85d3a" />
        </svg>
      </motion.div>

      {/* Floating Precision Viewfinder / Reticle (Center Background) */}
      <motion.div
        animate={{
          y: [8, -10, 8],
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/2 left-1/3 -translate-y-1/2 w-40 h-40 opacity-15 hidden md:block"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Framing brackets */}
          <path d="M 10 25 L 10 10 L 25 10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <path d="M 90 25 L 90 10 L 75 10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <path d="M 10 75 L 10 90 L 25 90" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <path d="M 90 75 L 90 90 L 75 90" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          {/* Center Crosshair */}
          <line x1="45" y1="50" x2="55" y2="50" stroke="#d85d3a" strokeWidth="1" />
          <line x1="50" y1="45" x2="50" y2="55" stroke="#d85d3a" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Slow-Drifting Kinetic Torus Ellipse */}
      <motion.div
        animate={{
          rotate: -360,
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-10 right-1/4 w-52 h-52 opacity-15 pointer-events-none"
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <ellipse cx="60" cy="60" rx="50" ry="20" fill="none" stroke="rgba(216, 93, 58, 0.35)" strokeWidth="1" transform="rotate(-30 60 60)" />
          <ellipse cx="60" cy="60" rx="50" ry="20" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="3 5" transform="rotate(30 60 60)" />
        </svg>
      </motion.div>

      {/* Left Edge Blur & Gradient Bleed (ensures seamless soft transition into deep dark canvas on ultra-wide screens) */}
      <div className="absolute inset-y-0 left-0 w-20 sm:w-36 md:w-56 lg:w-72 bg-gradient-to-r from-[#090a0c] via-[#090a0c]/80 to-transparent backdrop-blur-[2px] pointer-events-none z-10" />

      {/* Right Edge Blur & Gradient Bleed (ensures seamless soft transition into deep dark canvas on ultra-wide screens) */}
      <div className="absolute inset-y-0 right-0 w-20 sm:w-36 md:w-56 lg:w-72 bg-gradient-to-l from-[#090a0c] via-[#090a0c]/80 to-transparent backdrop-blur-[2px] pointer-events-none z-10" />
    </div>
  );
};
