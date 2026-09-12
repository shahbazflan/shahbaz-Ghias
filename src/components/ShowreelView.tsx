import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Film, ArrowRight, Layers, CheckCircle2, Share2, Copy, Check, ArrowUpRight } from 'lucide-react';
import { SHOWREEL_VIDEO, PERSONAL_INFO } from '../data/portfolioData';
import { PageTab } from '../types';

interface ShowreelViewProps {
  onTabChange: (tab: PageTab) => void;
}

export const ShowreelView: React.FC<ShowreelViewProps> = ({ onTabChange }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d85d3a]/15 text-[#d85d3a] border border-[#d85d3a]/30 text-xs font-light uppercase tracking-wider">
            <Film className="w-3.5 h-3.5" />
            <span>Director's Reel</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
            Master Showreel
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-light">
            {SHOWREEL_VIDEO.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-light text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors uppercase tracking-wider"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'LINK COPIED' : 'SHARE REEL'}</span>
          </button>
        </div>
      </div>

      {/* Cinematic Player Frame */}
      <div className="relative rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-2xl shadow-black/80">
        <div className="aspect-video w-full relative">
          <iframe
            src={`https://fast.wistia.net/embed/iframe/${SHOWREEL_VIDEO.id}?web_component=true&seo=true`}
            title={SHOWREEL_VIDEO.title}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full border-0 absolute inset-0"
          />
        </div>
      </div>

      {/* Metadata and Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Direction & Focus */}
        <div className="p-7 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2 text-[#d85d3a]">
            <Layers className="w-4 h-4" />
            <h3 className="text-base font-normal uppercase tracking-wide text-white">
              Creative Direction
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
            Paced for maximum visual momentum. High-frequency transitions, velocity curve easing, sound design synchronization, and brand-first visual storytelling.
          </p>
          <ul className="text-xs text-neutral-400 space-y-1.5 pt-2 border-t border-neutral-800/80 font-light">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d85d3a]" /> Commercial broadcast TVCs
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d85d3a]" /> Commercial motion &amp; product dynamics
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d85d3a]" /> Kinetic typography &amp; lockups
            </li>
          </ul>
        </div>

        {/* Pipeline & Toolkit */}
        <div className="p-7 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2 text-[#d85d3a]">
            <Sparkles className="w-4 h-4" />
            <h3 className="text-base font-normal uppercase tracking-wide text-white">
              Crafted With
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
            Crafted using dual-engine methodologies combining classical Adobe motion compositing with generative AI cinematography pipelines.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {['After Effects', 'Premiere Pro', 'DaVinci Resolve', 'Veo 3', 'Midjourney', 'Runway Gen-3', 'Kling AI'].map((tool, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-light bg-neutral-800 text-neutral-300 border border-neutral-700/60"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Commission & Inquiries */}
        <div className="p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-[#d85d3a]/10 border border-neutral-800 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-light uppercase tracking-widest text-[#d85d3a] block mb-1">
              Available For Work
            </span>
            <h3 className="text-lg font-normal text-white mb-2">
              Have a Project in Mind?
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Open to commercial visual direction, motion design lead roles, and agency contracts worldwide.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href={`mailto:${PERSONAL_INFO.email}?subject=Project%20Inquiry%20from%20Showreel`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-light text-white bg-[#d85d3a] hover:bg-[#c24e2d] transition-colors shadow-lg shadow-[#d85d3a]/20 uppercase tracking-wider"
            >
              <span>EMAIL INQUIRY</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => onTabChange('about')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-light text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors uppercase tracking-wider"
            >
              <span>VIEW FULL PROFILE &amp; RESUME</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
