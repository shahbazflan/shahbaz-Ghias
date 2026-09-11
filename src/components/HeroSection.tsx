import React from 'react';
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
      {/* Subtle warm ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[320px] bg-[#d85d3a]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Disciplined, Figma-clean centered container (never stretched too wide) */}
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
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-[#d85d3a]" />
              <span className="font-medium tracking-wide">15+ Years UAE Agency Experience</span>
            </div>

            <div className="flex items-center gap-3 text-neutral-400 font-mono text-[11px]">
              <span className="hidden sm:inline-block">DUBAI, UAE</span>
              <span className="hidden sm:inline-block text-neutral-600">•</span>
              <span className="inline-flex items-center gap-1.5 text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for Directing</span>
              </span>
            </div>
          </motion.div>

          {/* Main Headline Block with Refined Proportions and Fluid Motion */}
          <div className="space-y-4">
            <motion.div variants={itemVariants} className="py-2">
              <GlassMagnifierHeadline text="Shahbaz Ahmed" />
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="font-syne text-xl sm:text-3xl md:text-4xl font-bold text-neutral-200 tracking-tight leading-snug">
                Senior Motion Graphics Designer &amp; Visual Director
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed max-w-3xl pt-1"
            >
              Transforming complex brand ideas into magnetic screen experiences. Merging fifteen years of UAE broadcast commercial direction with high-precision motion design and next-generation synthetic cinematography.
            </motion.p>
          </div>

          {/* Core Disciplines Pill Tags (Clean Figma Layout) */}
          <motion.div variants={itemVariants} className="space-y-2.5">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#d85d3a] font-semibold">
              Specialized Disciplines
            </div>
            <div className="flex flex-wrap gap-2">
              {DISCIPLINES.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800/90 text-neutral-300 hover:text-white hover:border-neutral-700 text-xs font-medium transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Creative Manifesto Quote Card (Refined & Subtle) */}
          <motion.div
            variants={itemVariants}
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 border border-neutral-800/90 shadow-xl backdrop-blur-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <span className="text-xs font-mono uppercase tracking-wider text-[#d85d3a] font-semibold">
                  Creative Philosophy
                </span>
                <p className="text-sm sm:text-base text-neutral-200 font-medium leading-relaxed italic">
                  "{PERSONAL_INFO.heroTagline}"
                </p>
                <p className="text-xs sm:text-sm text-neutral-400 leading-normal">
                  {PERSONAL_INFO.heroDescription}
                </p>
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-neutral-800 pt-3 sm:pt-0 sm:pl-6 gap-2 flex-shrink-0">
                <span className="font-syne font-bold text-sm sm:text-base text-white">
                  {PERSONAL_INFO.punchline}
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  15+ Years UAE Market
                </span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons (Clean & Punchy) */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
          >
            <button
              id="hero-play-reel-btn"
              onClick={onPlayShowreel}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#d85d3a] hover:bg-[#c24e2d] shadow-lg shadow-[#d85d3a]/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>WATCH MASTER REEL (01:48)</span>
            </button>

            <button
              id="hero-explore-works-btn"
              onClick={scrollToWorks}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-600 transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>Explore Selected Works</span>
              <ArrowDown className="w-4 h-4 text-[#d85d3a]" />
            </button>

            <button
              onClick={() => onTabChange('about')}
              className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-full text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <span>Profile &amp; Resume</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
