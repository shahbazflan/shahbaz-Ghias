import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, ArrowDown, Sparkles, ArrowUpRight, Compass, Film } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { PageTab } from '../types';
import { ScrambleText } from './ScrambleText';
import { GlassMagnifierHeadline } from './GlassMagnifierHeadline';

interface HeroSectionProps {
  onTabChange: (tab: PageTab) => void;
  onPlayShowreel?: () => void;
}

const DISCIPLINES = [
  'Broadcast Commercials',
  'AI Synthetic Cinematography',
  'Product Visual Dynamics',
  'Kinetic Typography',
  'Vertical UGC Campaigns',
];

// Interactive Creative Philosophy Panel matching the kinetic cursor-following 3D movement of AI Concept Lab cards
const PhilosophyPanel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 700, height: 200 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

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
    return () => window.removeEventListener('resize', updateSize);
  }, [updateSize]);

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

  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;
  const normX = centerX > 0 ? (mousePos.x - centerX) / centerX : 0;
  const normY = centerY > 0 ? (mousePos.y - centerY) / centerY : 0;

  // Kinetic cursor-following displacement and 3D tilt
  const shiftX = isHovered ? normX * 14 : 0;
  const shiftY = isHovered ? normY * 10 : 0;
  const rotY = isHovered ? normX * 5.5 : 0;
  const rotX = isHovered ? -normY * 4.5 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="perspective-[1000px] select-none"
    >
      <motion.div
        animate={{
          x: shiftX,
          y: shiftY,
          rotateX: rotX,
          rotateY: rotY,
          scale: isHovered ? 1.014 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 220,
          mass: 0.5,
        }}
        className="relative overflow-hidden p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900/90 via-neutral-900/70 to-neutral-900/40 border border-neutral-800 hover:border-[#d85d3a]/70 shadow-xl hover:shadow-2xl hover:shadow-[#d85d3a]/15 backdrop-blur-md transition-[border-color,box-shadow] duration-300 will-change-transform transform-gpu group cursor-default"
      >
        {/* Dynamic Specular Radial Light following mouse */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(216, 93, 58, 0.14), transparent 70%)`,
            }}
          />
        )}

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-xs uppercase tracking-wider text-[#d85d3a] font-light">
              Creative Philosophy
            </span>
            <p className="text-sm sm:text-base text-neutral-200 font-light leading-relaxed italic group-hover:text-white transition-colors">
              "{PERSONAL_INFO.heroTagline}"
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-normal">
              {PERSONAL_INFO.heroDescription}
            </p>
          </div>

          <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-neutral-800 pt-3 sm:pt-0 sm:pl-6 gap-2 flex-shrink-0">
            <span className="font-normal text-sm sm:text-base text-white group-hover:text-[#f59e0b] transition-colors">
              {PERSONAL_INFO.punchline}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-light">
              15+ Years UAE Market
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onTabChange, onPlayShowreel }) => {
  const scrollToWorks = () => {
    const worksElement = document.getElementById('selected-works');
    if (worksElement) {
      worksElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-neutral-800/60">
      {/* Figma-clean centered container (never stretched too wide) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          id="hero-content-exclusion"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 md:space-y-10 relative z-10"
        >
          {/* Top Clean Status Pills (Clean Figma aesthetic, no spaceship HUD) */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-neutral-800/80 pb-5"
          >
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-300 text-xs font-light uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#d85d3a]" />
              <span className="tracking-wider">15+ Years UAE Agency Experience</span>
            </div>

            <div className="flex items-center gap-3 text-neutral-400 text-[11px] uppercase tracking-wider font-light">
              <span className="hidden sm:inline-block">DUBAI, UAE</span>
              <span className="hidden sm:inline-block text-neutral-600">•</span>
              <span className="inline-flex items-center gap-1.5 text-neutral-300 font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for Projects</span>
              </span>
            </div>
          </motion.div>

          {/* Main Headline Block with Refined Proportions and Fluid Motion */}
          <div className="space-y-4 sm:space-y-5">
            <motion.div variants={itemVariants} className="py-1">
              <GlassMagnifierHeadline
                line1="ENTER MY"
                line2="CREATIVE SPACE"
                sizeClassName="text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[5rem]"
              />

              {/* Small text under headline: Shahbaz Ahmed (one line) */}
              <div className="pt-2 sm:pt-3">
                <p className="text-xs sm:text-sm md:text-base font-normal tracking-[0.22em] text-neutral-300 uppercase select-none flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d85d3a]" />
                  <span>Shahbaz Ahmed</span>
                </p>
              </div>
            </motion.div>

            {/* Reduced font size for Senior Motion Graphics & Visual Designer */}
            <motion.div variants={itemVariants} className="pt-0.5">
              <h2
                className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-400 tracking-wide font-light uppercase select-none flex flex-wrap items-center gap-x-2"
              >
                <span>Senior Motion Graphics</span>
                <span className="text-neutral-600">•</span>
                <span>Visual Designer</span>
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed max-w-2xl pt-1"
            >
              Transforming complex brand ideas into magnetic screen experiences. Merging fifteen years of UAE broadcast commercial production with high-precision motion design and next-generation synthetic cinematography.
            </motion.p>
          </div>

          {/* Core Disciplines Pill Tags (Clean Figma Layout) */}
          <motion.div variants={itemVariants} className="space-y-2.5">
            <div className="text-[11px] uppercase tracking-widest text-[#d85d3a] font-light">
              Specialized Disciplines
            </div>
            <div className="flex flex-wrap gap-2">
              {DISCIPLINES.map((item, idx) => (
                <motion.span
                  key={idx}
                  whileHover={{
                    scale: 1.05,
                    y: -2.5,
                    transition: { type: 'spring', stiffness: 420, damping: 20 },
                  }}
                  whileTap={{ scale: 0.96 }}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 hover:border-[#d85d3a]/80 text-neutral-300 hover:text-white text-xs font-light uppercase tracking-wider transition-colors cursor-default shadow-sm hover:shadow-lg hover:shadow-[#d85d3a]/15"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Creative Manifesto Quote Card with Kinetic Mouse Hover Physics */}
          <motion.div variants={itemVariants}>
            <PhilosophyPanel />
          </motion.div>

          {/* Action Buttons (Interactive Kinetic Hover Motion) */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
          >
            <motion.button
              id="hero-explore-works-btn"
              onClick={scrollToWorks}
              whileHover={{
                scale: 1.035,
                y: -2.5,
                transition: { type: 'spring', stiffness: 400, damping: 20 },
              }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs uppercase tracking-wider text-white bg-[#d85d3a] hover:bg-[#c24e2d] shadow-lg hover:shadow-[#d85d3a]/30 transition-shadow duration-200 font-medium cursor-pointer"
            >
              <span>Explore Selected Works</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </motion.button>

            <motion.button
              id="hero-play-reel-btn"
              onClick={onPlayShowreel}
              whileHover={{
                scale: 1.035,
                y: -2.5,
                transition: { type: 'spring', stiffness: 400, damping: 20 },
              }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-full text-xs uppercase tracking-wider text-neutral-200 hover:text-white bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 hover:border-[#d85d3a]/60 shadow-lg transition-colors duration-200 font-light cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#d85d3a] ml-0.5" />
              <span>Watch Showreel</span>
            </motion.button>

            <motion.button
              onClick={() => onTabChange('about')}
              whileHover={{
                scale: 1.05,
                x: 3,
                transition: { type: 'spring', stiffness: 400, damping: 20 },
              }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors font-light cursor-pointer"
            >
              <span>Profile &amp; Resume</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#d85d3a]" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
