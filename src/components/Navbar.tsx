import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import { PageTab } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ScrambleText } from './ScrambleText';
import { ambientAudio } from '../utils/ambientAudio';

interface NavbarProps {
  currentTab: PageTab;
  onTabChange: (tab: PageTab) => void;
  onOpenContact: () => void;
}

const NAV_ITEMS: { id: PageTab; label: string; num: string }[] = [
  { id: 'home', label: 'HOME', num: '00' },
  { id: 'works', label: 'WORKS', num: '01' },
  { id: 'ai-ideation', label: 'AI CONCEPT LAB', num: '02' },
  { id: 'showreel', label: 'SHOWREEL', num: '03' },
  { id: 'ucg-ads', label: 'UGC ADS', num: '04' },
  { id: 'about', label: 'ABOUT', num: '05' },
];

/**
 * Magnetic Nav Link Component:
 * Text and index numeral subtly gravitate towards cursor coordinates on hover
 */
interface MagneticNavLinkProps {
  item: { id: PageTab; label: string; num: string };
  isActive: boolean;
  onSelect: () => void;
}

const MagneticNavLink: React.FC<MagneticNavLinkProps> = ({ item, isActive, onSelect }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    // Magnetic pull factor (subtle attraction, maximum 7.5px)
    const pullFactor = 0.32;
    const maxPull = 7.5;
    setOffset({
      x: Math.max(-maxPull, Math.min(maxPull, deltaX * pullFactor)),
      y: Math.max(-maxPull, Math.min(maxPull, deltaY * pullFactor)),
    });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <button
      ref={buttonRef}
      id={`nav-link-${item.id}`}
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative px-3 xl:px-3.5 py-1.5 text-xs uppercase tracking-wider rounded-full transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap select-none group ${
        isActive
          ? 'text-white font-normal'
          : 'text-neutral-400 hover:text-white font-light'
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeTabPill"
          className="absolute inset-0 bg-[#d85d3a] rounded-full shadow-[0_0_18px_rgba(216,93,58,0.4)] pointer-events-none"
          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
        />
      )}
      {/* Magnetic text container pulling smoothly toward cursor */}
      <motion.div
        className="relative z-10 flex items-center gap-1.5 pointer-events-none"
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: 'spring', stiffness: 380, damping: 18, mass: 0.15 }}
      >
        <span>
          <ScrambleText text={item.label} bgColor={isActive ? '#d85d3a' : '#0b0d10'} />
        </span>
      </motion.div>
    </button>
  );
};

/**
 * Magnetic Action Link Component:
 * Gravitates button content towards cursor on hover
 */
const MagneticActionLink: React.FC<{
  children: React.ReactNode;
  href?: string;
  className: string;
  title?: string;
  target?: string;
  rel?: string;
  id?: string;
}> = ({ children, href, className, title, target, rel, id }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLAnchorElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const maxPull = 6.5;
    setOffset({
      x: Math.max(-maxPull, Math.min(maxPull, deltaX * 0.3)),
      y: Math.max(-maxPull, Math.min(maxPull, deltaY * 0.3)),
    });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <a
      ref={ref}
      id={id}
      href={href}
      target={target}
      rel={rel}
      title={title}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      <motion.div
        className="flex items-center gap-1.5 pointer-events-none"
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: 'spring', stiffness: 380, damping: 18, mass: 0.15 }}
      >
        {children}
      </motion.div>
    </a>
  );
};

const MagneticActionButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className: string;
  title?: string;
  id?: string;
}> = ({ children, onClick, className, title, id }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const maxPull = 6.5;
    setOffset({
      x: Math.max(-maxPull, Math.min(maxPull, deltaX * 0.3)),
      y: Math.max(-maxPull, Math.min(maxPull, deltaY * 0.3)),
    });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <button
      ref={ref}
      id={id}
      type="button"
      onClick={onClick}
      title={title}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      <motion.div
        className="flex items-center gap-1.5 pointer-events-none"
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: 'spring', stiffness: 380, damping: 18, mass: 0.15 }}
      >
        {children}
      </motion.div>
    </button>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, onOpenContact }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dubaiClock, setDubaiClock] = useState('');
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);

  useEffect(() => {
    return ambientAudio.subscribe((playing) => {
      setIsSoundPlaying(playing);
    });
  }, []);

  const handleToggleSound = () => {
    ambientAudio.toggle();
  };

  useEffect(() => {
    const tick = () => {
      try {
        const now = new Date();
        const str = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Dubai',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(now);
        setDubaiClock(str);
      } catch (e) {
        setDubaiClock('04:20');
      }
    };
    tick();
    const timer = setInterval(tick, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#090a0c]/85 border-b border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
        {/* Brand logo & monogram */}
        <button
          id="nav-brand-logo"
          onClick={() => {
            onTabChange('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group text-left focus:outline-none shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-700/80 group-hover:border-[#f59e0b] group-hover:text-[#f59e0b] flex items-center justify-center text-white text-xs font-light tracking-widest transition-colors duration-300">
            SA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <ScrambleText
                text={PERSONAL_INFO.name}
                className="font-name-zalando font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-[#f59e0b] transition-colors duration-300 uppercase"
              />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Available for projects" />
            </div>
            <p className="text-[10px] text-neutral-400 tracking-wider uppercase font-light">
              Motion Designer • Dubai ({dubaiClock} GST)
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links & Action Buttons */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          {/* Main Navigation Pill Capsule with Magnetic Cursor Attraction */}
          <nav className="flex items-center gap-0.5 bg-[#0b0d10]/95 p-1 rounded-full border border-neutral-800 shadow-xl shrink-0">
            {NAV_ITEMS.map((item) => (
              <MagneticNavLink
                key={item.id}
                item={item}
                isActive={currentTab === item.id}
                onSelect={() => onTabChange(item.id)}
              />
            ))}
          </nav>

          {/* Quick Action Buttons: LI ↗, CANVA ↗, CONTACT ↗ with Magnetic Cursor Attraction */}
          <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">
            <MagneticActionLink
              id="nav-action-li"
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a66c2]/15 hover:bg-[#0a66c2] text-[#0a66c2] hover:text-white border border-[#0a66c2]/40 hover:border-[#0a66c2] text-xs font-medium tracking-wider transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-[0_0_14px_rgba(10,102,194,0.45)] group"
              title="LinkedIn Profile (Brand Color)"
            >
              <span>
                <ScrambleText text="LI" bgColor="#0a66c2" />
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#0a66c2] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </MagneticActionLink>

            <MagneticActionLink
              id="nav-action-canva"
              href={PERSONAL_INFO.canvaPortfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00c4cc]/15 via-[#5d3bf6]/15 to-[#7d2ae8]/15 hover:from-[#00c4cc] hover:via-[#5d3bf6] hover:to-[#7d2ae8] text-[#00c4cc] hover:text-white border border-[#00c4cc]/40 hover:border-[#7d2ae8] text-xs font-medium tracking-wider transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-[0_0_14px_rgba(0,196,204,0.45)] group"
              title="Canva Portfolio (Brand Colors)"
            >
              <span>
                <ScrambleText text="CANVA" bgColor="#00c4cc" />
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#00c4cc] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </MagneticActionLink>

            <MagneticActionButton
              id="nav-action-contact"
              onClick={onOpenContact}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-normal uppercase tracking-wider text-white bg-[#d85d3a] hover:bg-[#c24e2d] transition-all shadow-lg shadow-[#d85d3a]/30 whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
              title="Open Contact & Inquiry"
            >
              <span>
                <ScrambleText text="CONTACT" bgColor="#d85d3a" />
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </MagneticActionButton>

            {/* Persistent Minimal Studio Sound Toggle Button */}
            <button
              id="nav-sound-toggle"
              onClick={handleToggleSound}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-300 select-none ${
                isSoundPlaying
                  ? 'bg-[#d85d3a]/15 border-[#d85d3a]/60 text-white shadow-[0_0_14px_rgba(216,93,58,0.25)]'
                  : 'bg-[#121417]/90 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              }`}
              title={isSoundPlaying ? 'Mute studio ambient loop' : 'Play studio ambient soundscape'}
            >
              {isSoundPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#d85d3a]" />
                  <span className="text-[11px] font-medium tracking-wider text-neutral-200">
                    SOUND
                  </span>
                  <div className="flex items-center gap-0.5 h-2.5">
                    <span className="w-0.5 h-2.5 bg-[#d85d3a] rounded-full animate-pulse" />
                    <span className="w-0.5 h-1.5 bg-[#d85d3a] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-2 bg-[#d85d3a] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-[11px] font-light tracking-wider text-neutral-400">
                    SOUND
                  </span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-neutral-800/80 text-neutral-400 font-mono">
                    OFF
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile controls: Sound toggle + menu trigger */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            id="mobile-sound-toggle"
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border text-xs transition-all duration-300 ${
              isSoundPlaying
                ? 'bg-[#d85d3a]/20 border-[#d85d3a]/60 text-[#d85d3a]'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title={isSoundPlaying ? 'Mute studio ambient sound' : 'Play studio ambient sound'}
            aria-label="Toggle ambient studio sound"
          >
            {isSoundPlaying ? <Volume2 className="w-4 h-4 text-[#d85d3a]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#090a0c] border-b border-neutral-800 px-6 py-6 space-y-4"
          >
            <div className="font-syne text-[11px] text-neutral-400 uppercase tracking-widest font-semibold">
              // Navigation
            </div>
            <nav className="flex flex-col space-y-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl text-left font-syne text-base font-bold uppercase transition-colors ${
                    currentTab === item.id
                      ? 'bg-[#d85d3a] text-white shadow-md shadow-[#d85d3a]/30'
                      : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>{item.label}</span>
                  </div>
                </button>
              ))}
            </nav>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400">STUDIO AMBIENCE:</span>
              <button
                onClick={handleToggleSound}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-300 ${
                  isSoundPlaying
                    ? 'bg-[#d85d3a]/20 border-[#d85d3a]/60 text-white'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                }`}
              >
                {isSoundPlaying ? <Volume2 className="w-3.5 h-3.5 text-[#d85d3a]" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isSoundPlaying ? 'AUDIO ACTIVE' : 'AUDIO MUTED'}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-center gap-2">
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a66c2]/20 hover:bg-[#0a66c2] text-[#0a66c2] hover:text-white border border-[#0a66c2]/50 font-syne text-xs font-bold transition-colors"
              >
                <span>LI</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#0a66c2] group-hover:text-white" />
              </a>
              <a
                href={PERSONAL_INFO.canvaPortfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#00c4cc]/20 via-[#5d3bf6]/20 to-[#7d2ae8]/20 hover:from-[#00c4cc] hover:to-[#7d2ae8] text-[#00c4cc] hover:text-white border border-[#00c4cc]/50 font-syne text-xs font-bold transition-colors"
              >
                <span>CANVA</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#00c4cc] group-hover:text-white" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#d85d3a] text-white font-syne text-xs font-extrabold shadow-md shadow-[#d85d3a]/25"
              >
                <span>CONTACT</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
