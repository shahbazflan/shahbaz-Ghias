import React from 'react';
import { ArrowUp } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { PageTab } from '../types';
import { ScrambleText } from './ScrambleText';

interface FooterProps {
  onTabChange: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-800/80 bg-[#07080a] py-16 text-neutral-400 text-xs font-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="pb-16 border-b border-neutral-800/70">
          {/* Brand Col */}
          <div className="max-w-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white text-xs font-light tracking-wider">
                SA
              </div>
              <span className="font-normal text-base sm:text-lg text-white uppercase tracking-tight">
                <ScrambleText text={PERSONAL_INFO.name} hoverOnly />
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed font-light">
              {PERSONAL_INFO.bioShort}
            </p>
            <div className="text-[11px] text-[#d85d3a] tracking-wider uppercase pt-1 font-light">
              // {PERSONAL_INFO.punchline}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-light">
          <p>© {new Date().getFullYear()} Shahbaz Ahmed. Visual Direction &amp; Motion Graphics.</p>

          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-neutral-300 font-light">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AVAILABLE FOR COMMISSIONS
            </span>

            <button
              onClick={scrollToTop}
              id="back-to-top-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors uppercase tracking-wider text-xs font-light"
              aria-label="Back to top"
            >
              <span>TOP</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
