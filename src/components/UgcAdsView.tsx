import React from 'react';
import { motion } from 'motion/react';
import { Play, Smartphone, Sparkles, Flame, CheckCircle, ArrowUpRight } from 'lucide-react';
import { UGC_ADS_VIDEOS } from '../data/portfolioData';
import { VideoItem } from '../types';
import { ScrambleText } from './ScrambleText';

interface UgcAdsViewProps {
  onSelectVideo: (video: VideoItem) => void;
}

export const UgcAdsView: React.FC<UgcAdsViewProps> = ({ onSelectVideo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-800/80">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d85d3a]/15 text-[#d85d3a] border border-[#d85d3a]/30 text-xs font-mono font-bold uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5" />
            <span>9:16 Vertical Video</span>
          </div>
          <h1 className="font-syne text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
            UGC Ads &amp; Mobile Social Campaigns
          </h1>
          <p className="text-base text-neutral-400 leading-relaxed font-normal">
            High-converting vertical video creatives engineered for TikTok, Instagram Reels, and YouTube Shorts algorithms. Hook-tested, color-graded, and kinetic caption synchronized.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300">
          <Flame className="w-4 h-4 text-[#d85d3a]" />
          <span>Optimized for 3s Hook Rate &amp; Retention</span>
        </div>
      </div>

      {/* 9:16 Video Mockup Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {UGC_ADS_VIDEOS.map((ad, index) => (
          <motion.div
            key={ad.id}
            id={`ugc-ad-card-${ad.id}`}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSelectVideo(ad)}
            className="group cursor-pointer flex flex-col"
          >
            {/* Phone Bezel Frame */}
            <div className="relative aspect-[9/16] w-full rounded-[28px] p-2 bg-neutral-900 border-2 border-neutral-800 group-hover:border-[#d85d3a]/80 shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">
              {/* Camera notch simulator */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/90 rounded-full z-20" />

              {/* Inner screen */}
              <div className="relative flex-1 rounded-[22px] overflow-hidden bg-black">
                <img
                  src={ad.thumbnail}
                  alt={ad.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

                {/* Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#d85d3a]/90 group-hover:bg-[#d85d3a] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/75 backdrop-blur-md border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between text-white font-syne text-xs font-bold truncate">
                    <span className="truncate">
                      <ScrambleText text={ad.title} hoverOnly />
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#d85d3a] shrink-0" />
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">
                    {ad.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-card tags */}
            <div className="mt-3 flex items-center justify-between px-1 text-xs font-mono text-neutral-400">
              <span className="text-[10px] uppercase tracking-wider text-[#d85d3a]">
                {ad.category}
              </span>
              <span className="text-[11px] hover:text-white transition-colors">
                9:16 VERTICAL ↗
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* UGC Campaign Highlights */}
      <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-neutral-300">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d85d3a]">
            01 / Fast Hooks
          </span>
          <h3 className="font-syne text-base font-bold text-white">First 3-Second Retention</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            High-stimulus visual pattern interrupts engineered to minimize feed scroll-away rate across TikTok and Reels.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d85d3a]">
            02 / Kinetic Subtitles
          </span>
          <h3 className="font-syne text-base font-bold text-white">Sound-Off Comprehension</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Custom word-by-word animated highlights ensuring complete message transmission even when muted in public feeds.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d85d3a]">
            03 / Direct-Response
          </span>
          <h3 className="font-syne text-base font-bold text-white">Clear Call-to-Actions</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Engineered end-screens and swipe-up prompts designed to boost click-through rates (CTR) and ROAS for commercial brands.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
