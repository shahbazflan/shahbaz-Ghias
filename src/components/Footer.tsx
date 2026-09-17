import React, { useState } from 'react';
import { ArrowUp, Mail, MessageCircle, ArrowUpRight, Check, Copy } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { PageTab } from '../types';
import { ScrambleText } from './ScrambleText';

interface FooterProps {
  onTabChange: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-800/80 bg-[#07080a] py-16 text-neutral-400 text-xs font-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="pb-16 border-b border-neutral-800/70 flex flex-col md:flex-row md:items-end justify-between gap-8">
          {/* Brand Col */}
          <div className="max-w-lg space-y-4">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 group-hover:border-[#f59e0b] group-hover:text-[#f59e0b] flex items-center justify-center text-white text-xs font-light tracking-wider transition-colors duration-300">
                SA
              </div>
              <span className="font-normal text-base sm:text-lg text-white group-hover:text-[#f59e0b] uppercase tracking-tight transition-colors duration-300">
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

          {/* Quick Direct Reach */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
              DIRECT REACH
            </div>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={`https://wa.me/${PERSONAL_INFO.whatsappClean}?text=${encodeURIComponent("Hi Shahbaz, I'm reaching out regarding a motion design project.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-emerald-400 hover:text-emerald-300 transition-colors font-mono text-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors font-mono text-xs cursor-pointer"
                title="Click to copy email address"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5 text-[#d85d3a]" />}
                <span>{copiedEmail ? 'COPIED TO CLIPBOARD' : PERSONAL_INFO.email}</span>
              </button>

              <button
                type="button"
                onClick={() => onTabChange('about')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d85d3a]/15 hover:bg-[#d85d3a]/25 border border-[#d85d3a]/40 text-[#ff8366] hover:text-white transition-colors font-mono text-xs cursor-pointer"
              >
                <span>Message Form</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a66c2]/10 hover:bg-[#0a66c2]/20 border border-[#0a66c2]/30 text-[#38bdf8] hover:text-white transition-colors font-mono text-xs"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 text-[#38bdf8]" />
              </a>
              <a
                href={PERSONAL_INFO.canvaPortfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00c4cc]/10 via-[#5d3bf6]/10 to-[#7d2ae8]/10 hover:from-[#00c4cc]/20 hover:to-[#7d2ae8]/20 border border-[#00c4cc]/30 text-[#00c4cc] hover:text-white transition-colors font-mono text-xs"
              >
                <span>Canva</span>
                <ArrowUpRight className="w-3 h-3 text-[#00c4cc]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-light">
          <p>© {new Date().getFullYear()} <span className="text-white hover:text-[#f59e0b] transition-colors duration-300 cursor-default">Shahbaz Ahmed</span>. Motion Graphics &amp; Visual Design.</p>

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
