import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { PageTab } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ScrambleText } from './ScrambleText';

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
      className={`relative px-3.5 xl:px-4 py-2 font-syne text-xs uppercase tracking-wider rounded-full transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap select-none group ${
        isActive
          ? 'text-white font-extrabold'
          : 'text-neutral-400 hover:text-white font-bold'
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
        <span
          className={`text-[11px] font-mono transition-colors ${
            isActive ? 'text-white/90 font-bold' : 'text-neutral-500 group-hover:text-neutral-300 font-medium'
          }`}
        >
          {item.num}
        </span>
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

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dubaiClock, setDubaiClock] = useState('');

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
          <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-700/80 group-hover:border-[#d85d3a] flex items-center justify-center text-white font-mono text-xs font-bold tracking-widest transition-colors duration-300">
            SA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <ScrambleText
                text={PERSONAL_INFO.name}
                className="font-syne font-extrabold text-sm sm:text-base tracking-tight text-white uppercase"
              />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Available for projects" />
            </div>
            <p className="font-mono text-[10px] text-neutral-400 tracking-wider uppercase">
              Motion Director • Dubai ({dubaiClock} GST)
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#121417]/90 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-neutral-700 text-xs font-syne font-bold tracking-wider transition-all duration-200 whitespace-nowrap shadow-sm group"
              title="LinkedIn Profile"
            >
              <span>
                <ScrambleText text="LI" bgColor="#121417" />
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </MagneticActionLink>

            <MagneticActionLink
              id="nav-action-canva"
              href={PERSONAL_INFO.canvaPortfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#121417]/90 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-neutral-700 text-xs font-syne font-bold tracking-wider transition-all duration-200 whitespace-nowrap shadow-sm group"
              title="Canva Portfolio"
            >
              <span>
                <ScrambleText text="CANVA" bgColor="#121417" />
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </MagneticActionLink>

            <MagneticActionLink
              id="nav-action-contact"
              href={`mailto:${PERSONAL_INFO.email}`}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-syne text-xs font-extrabold uppercase tracking-wider text-white bg-[#d85d3a] hover:bg-[#c24e2d] transition-all shadow-lg shadow-[#d85d3a]/30 whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-[0.98] group"
              title="Direct Email Contact"
            >
              <span>
                <ScrambleText text="CONTACT" bgColor="#d85d3a" />
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </MagneticActionLink>
          </div>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
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
            <div className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest">
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
                    <span
                      className={`font-mono text-xs ${
                        currentTab === item.id ? 'text-white/80 font-bold' : 'text-neutral-500'
                      }`}
                    >
                      {item.num}
                    </span>
                    <span>{item.label}</span>
                  </div>
                </button>
              ))}
            </nav>

            <div className="pt-3 border-t border-neutral-800 flex items-center gap-2">
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 text-white border border-neutral-800 font-syne text-xs font-bold"
              >
                <span>LI</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
              </a>
              <a
                href={PERSONAL_INFO.canvaPortfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 text-white border border-neutral-800 font-syne text-xs font-bold"
              >
                <span>CANVA</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
              </a>
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#d85d3a] text-white font-syne text-xs font-extrabold shadow-md shadow-[#d85d3a]/25"
              >
                <span>CONTACT</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
