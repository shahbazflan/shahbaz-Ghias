import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, Film, Smartphone, User, Play, ArrowRight } from 'lucide-react';
import { FEATURED_GATEWAYS } from '../data/portfolioData';
import { PageTab } from '../types';
import { ScrambleText } from './ScrambleText';

interface FeaturedCardsProps {
  onSelectTab: (tab: PageTab) => void;
}

export const FeaturedCards: React.FC<FeaturedCardsProps> = ({ onSelectTab }) => {
  const getIcon = (id: PageTab) => {
    switch (id) {
      case 'ai-ideation':
        return <Sparkles className="w-4 h-4 text-[#d85d3a]" />;
      case 'showreel':
        return <Play className="w-4 h-4 text-[#d85d3a]" />;
      case 'ucg-ads':
        return <Smartphone className="w-4 h-4 text-[#d85d3a]" />;
      case 'about':
        return <User className="w-4 h-4 text-[#d85d3a]" />;
      default:
        return <Film className="w-4 h-4 text-[#d85d3a]" />;
    }
  };

  return (
    <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
      {/* Section Header with Clean Figma Typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-neutral-800/80 gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[#d85d3a] mb-2 font-semibold">
            <span>Portfolio Pillars</span>
          </div>
          <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
            Four Core Disciplines
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed font-normal">
          Explore curated gateways into synthetic ideation labs, broadcast master reels, commercial vertical campaigns, and creative career trajectory.
        </p>
      </div>

      {/* 2x2 Architectural Grid with Quentin Hocde inspired micro-details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {FEATURED_GATEWAYS.map((card, index) => {
          const indexFormatted = String(index + 1).padStart(2, '0');
          return (
            <motion.div
              key={card.id}
              id={`gateway-card-${card.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onSelectTab(card.id)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden bg-neutral-900/60 border border-neutral-800 hover:border-[#d85d3a]/70 shadow-2xl transition-all duration-500 flex flex-col justify-between"
            >
              {/* Media Container with smooth cinematic scaling */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090a0c] via-[#090a0c]/40 to-transparent" />

                {/* Index tag & Category Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="font-mono text-xs font-bold text-neutral-300 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-neutral-800">
                    [{indexFormatted}]
                  </span>
                  <span className="font-mono text-[11px] font-semibold tracking-wider uppercase bg-[#d85d3a]/90 text-white px-3 py-1 rounded shadow-sm">
                    {card.tag}
                  </span>
                </div>
              </div>

              {/* Text Info Box */}
              <div className="p-6 sm:p-8 relative z-10 flex-1 flex flex-col justify-between space-y-4 bg-[#090a0c]/80 border-t border-neutral-800/80">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
                      {getIcon(card.id)}
                      <span>{card.subtitle}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-[#d85d3a] transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>

                  <h3 className="font-syne text-xl sm:text-2xl font-bold text-white group-hover:text-[#d85d3a] transition-colors">
                    <ScrambleText text={card.title} hoverOnly />
                  </h3>

                  <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between font-mono text-xs">
                  <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors">
                    ENTER DISCIPLINE
                  </span>
                  <span className="text-[#d85d3a] font-bold group-hover:underline inline-flex items-center gap-1">
                    <span>VIEW PORTFOLIO</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
