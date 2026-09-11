import React from 'react';
import { ArrowUp, Mail, Linkedin, Globe, Sparkles, ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { PageTab } from '../types';
import { ScrambleText } from './ScrambleText';

interface FooterProps {
  onTabChange: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-800/80 bg-[#07080a] py-16 text-neutral-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-neutral-800/70">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4 font-sans">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white font-mono font-bold text-xs">
                SA
              </div>
              <span className="font-syne font-bold text-lg text-white uppercase">
                <ScrambleText text={PERSONAL_INFO.name} hoverOnly />
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed font-sans">
              {PERSONAL_INFO.bioShort}
            </p>
            <div className="font-mono text-[11px] text-[#d85d3a] tracking-wider uppercase pt-1">
              // {PERSONAL_INFO.punchline}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white block">
              // Index
            </span>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    onTabChange('home');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  [00] Home Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onTabChange('ai-ideation');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  [01] AI Concept Lab (14 Videos)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onTabChange('showreel');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  [02] Master Showreel
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onTabChange('ucg-ads');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  [03] UGC &amp; Mobile Ads (9:16)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onTabChange('about');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  [04] Profile &amp; Resume
                </button>
              </li>
            </ul>
          </div>

          {/* Connect Links */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white block">
              // Direct Connect
            </span>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="flex items-center gap-2 hover:text-[#d85d3a] transition-colors"
                >
                  <span>EMAIL:</span>
                  <span className="text-white">{PERSONAL_INFO.email}</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                </a>
              </li>
              <li>
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span>LINKEDIN:</span>
                  <span className="text-neutral-300 hover:text-white">shabaz-ghias</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                </a>
              </li>
              <li>
                <a
                  href={PERSONAL_INFO.canvaPortfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span>CANVA PORTFOLIO:</span>
                  <span className="text-neutral-300 hover:text-white">shahbazflan</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                </a>
              </li>
              <li className="pt-2 text-[11px] text-neutral-500">
                BASED IN DUBAI, UAE • AVAILABLE GLOBALLY
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Shahbaz Ahmed. Visual Direction &amp; Motion Graphics.</p>

          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AVAILABLE FOR COMMISSIONS
            </span>

            <button
              onClick={scrollToTop}
              id="back-to-top-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors uppercase tracking-wider"
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
