import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, Film, Smartphone, User, Play, ArrowRight } from 'lucide-react';
import { FEATURED_GATEWAYS } from '../data/portfolioData';
import { PageTab } from '../types';
import { ScrambleText } from './ScrambleText';

interface FeaturedCardsProps {
  onSelectTab: (tab: PageTab) => void;
}

interface GatewayCardItemProps {
  card: (typeof FEATURED_GATEWAYS)[0];
  index: number;
  onSelectTab: (tab: PageTab) => void;
}

const getIcon = (id: PageTab) => {
  switch (id) {
    case 'ai-ideation':
      return <Sparkles className="w-3.5 h-3.5 text-[#d85d3a]" />;
    case 'showreel':
      return <Play className="w-3.5 h-3.5 text-[#d85d3a]" />;
    case 'ucg-ads':
      return <Smartphone className="w-3.5 h-3.5 text-[#d85d3a]" />;
    case 'about':
      return <User className="w-3.5 h-3.5 text-[#d85d3a]" />;
    default:
      return <Film className="w-3.5 h-3.5 text-[#d85d3a]" />;
  }
};

const getCardSpecs = (id: PageTab) => {
  switch (id) {
    case 'ai-ideation':
      return {
        pipeline: 'Midjourney • Stable Diffusion • Topaz AI',
        resolution: '4K Ultra HD • Latent Space',
        deliverables: '14 Synthetic Cinematic Cuts',
      };
    case 'showreel':
      return {
        pipeline: 'After Effects • Premiere • DaVinci Studio',
        resolution: '3840×2160 • 60 FPS',
        deliverables: 'Commercial Master Showcase',
      };
    case 'ucg-ads':
      return {
        pipeline: 'CapCut Pro • AE • TikTok Ads Manager',
        resolution: '1080×1920 (9:16) • Mobile Native',
        deliverables: '4 Viral Retention Creatives',
      };
    case 'about':
      return {
        pipeline: '15+ Years UAE Agency & Motion Craft',
        resolution: 'Creative Direction & Design Leadership',
        deliverables: 'Verified Client Case Studies',
      };
    default:
      return {
        pipeline: 'Design & Motion Pipeline',
        resolution: 'Ultra High Definition',
        deliverables: 'Curated Works',
      };
  }
};

const GatewayCardItem: React.FC<GatewayCardItemProps> = ({ card, index, onSelectTab }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 450, height: 350 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const specs = getCardSpecs(card.id);

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
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [updateSize]);

  // Synchronous cursor tracking matching the Shahbaz Ahmed headline implementation
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

  // Kinetic cursor-following movement calculations matching GlassMagnifierHeadline:
  // As user moves cursor over card, the card physically glides & tilts top-to-bottom and left-to-right
  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;
  const normX = centerX > 0 ? (mousePos.x - centerX) / centerX : 0; // -1 to 1 (left to right)
  const normY = centerY > 0 ? (mousePos.y - centerY) / centerY : 0; // -1 to 1 (top to bottom)

  // Dynamic displacement & 3D rotation values (exact responsiveness as headline)
  const cardShiftX = isHovered ? normX * 18 : 0;
  const cardShiftY = isHovered ? normY * 12 : 0;
  const cardRotateY = isHovered ? normX * 7 : 0;
  const cardRotateX = isHovered ? -normY * 6 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelectTab(card.id)}
      className="perspective-[1000px] select-none"
    >
      <motion.div
        id={`gateway-card-${card.id}`}
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        animate={{
          x: cardShiftX,
          y: cardShiftY,
          rotateX: cardRotateX,
          rotateY: cardRotateY,
        }}
        transition={{
          // Spring physics identical to GlassMagnifierHeadline
          type: 'spring',
          damping: 24,
          stiffness: 220,
          mass: 0.5,
        }}
        className="group relative cursor-pointer rounded-2xl overflow-hidden bg-neutral-900/60 border border-neutral-800 hover:border-[#d85d3a]/70 shadow-xl transition-colors duration-300 flex flex-col justify-between will-change-transform transform-gpu"
      >
        {/* 3D Flip Container: Flips completely when scrolled into view from top or bottom to reveal the image */}
        <div className="relative aspect-[16/9] w-full [perspective:1000px] overflow-hidden bg-black">
          <motion.div
            initial={{ rotateY: 180 }}
            whileInView={{ rotateY: 0 }}
            viewport={{ once: false, amount: 0.22 }}
            transition={{
              duration: 0.8,
              delay: 0.06 + index * 0.08,
              ease: [0.23, 1, 0.32, 1],
            }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative w-full h-full"
          >
            {/* Front Face: Image & Clean Discipline Badges (No numbers) */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={card.imageUrl}
                alt={card.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover object-center brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a0c] via-[#090a0c]/40 to-transparent" />

              {/* Clean Discipline & Category Badges (No 01-05 numbers) */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-200 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-700/80">
                  {card.subtitle}
                </span>
                <span className="text-[10px] font-mono tracking-wider uppercase bg-[#d85d3a] text-white font-semibold px-2.5 py-1 rounded-full shadow-md">
                  {card.tag}
                </span>
              </div>
            </div>

            {/* Back Face: High-Tech Motion HUD Specs (Clean aesthetic without 01-05 numbers) */}
            <div
              style={{
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#12141a] via-[#0c0e12] to-[#090a0c] border border-[#d85d3a]/60 p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-inner"
            >
              {/* Top Header on Back Face */}
              <div className="relative z-10 flex items-center justify-between border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d85d3a] animate-pulse" />
                  <span className="text-xs font-mono text-white uppercase tracking-wider font-semibold">
                    {card.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#d85d3a] bg-[#d85d3a]/15 px-2.5 py-0.5 rounded-full border border-[#d85d3a]/30 font-medium">
                  CORE DISCIPLINE
                </span>
              </div>

              {/* Middle Technical Specs */}
              <div className="relative z-10 space-y-1.5 py-1 text-xs font-light text-neutral-300 font-mono">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500">FOCUS:</span>
                  <span className="text-neutral-200 truncate max-w-[180px]">{card.subtitle}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500">PIPELINE:</span>
                  <span className="text-amber-400/90 truncate max-w-[180px]">{specs.pipeline}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500">FORMAT:</span>
                  <span className="text-neutral-300">{specs.resolution}</span>
                </div>
              </div>

              {/* Bottom Action Prompt */}
              <div className="relative z-10 pt-2 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-400">CLICK TO ENTER</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-white bg-[#d85d3a] px-3 py-1 rounded-full shadow hover:bg-[#c24e2d] transition-colors">
                  <span>OPEN</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Text Info Box */}
        <div className="p-5 sm:p-6 relative z-10 flex-1 flex flex-col justify-between space-y-3 bg-[#090a0c]/80 border-t border-neutral-800/80">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 font-light">
                {getIcon(card.id)}
                <span>{card.subtitle}</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-[#d85d3a] transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>

            <h3 className="text-base sm:text-lg font-normal text-white group-hover:text-[#d85d3a] transition-colors">
              <ScrambleText text={card.title} hoverOnly />
            </h3>

            <p className="text-xs text-neutral-400 leading-relaxed font-light line-clamp-2">
              {card.description}
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs font-light">
            <span className="text-neutral-400 group-hover:text-neutral-200 transition-colors text-xs font-mono tracking-wider">
              EXPLORE WORK
            </span>
            {/* Clean, Sharp Architectural VIEW PORTFOLIO Button (No Glow/Blur) */}
            <div className="relative group/btn">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-medium uppercase tracking-wider text-white bg-[#d85d3a] hover:bg-[#c24e2d] border border-[#d85d3a]/60 group-hover/btn:border-[#d85d3a] transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
                <span>VIEW PORTFOLIO</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const FeaturedCards: React.FC<FeaturedCardsProps> = ({ onSelectTab }) => {
  return (
    <section id="portfolio-pillars" className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header with Clean Typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-5 border-b border-neutral-800/80 gap-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#d85d3a] mb-1.5 font-light">
            <span>Portfolio Pillars</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight uppercase">
            Four Core Disciplines
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed font-light">
          Curated gateways into synthetic ideation labs, broadcast master reels, commercial vertical campaigns, and creative career trajectory.
        </p>
      </div>

      {/* 2x2 Grid with Scroll-Triggered 3D Card Flip to Reveal Images & Kinetic Mouse Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {FEATURED_GATEWAYS.map((card, index) => (
          <GatewayCardItem
            key={card.id}
            card={card}
            index={index}
            onSelectTab={onSelectTab}
          />
        ))}
      </div>
    </section>
  );
};

