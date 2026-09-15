import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedCards } from './components/FeaturedCards';
import { ShowreelView } from './components/ShowreelView';
import { AIIdeationView } from './components/AIIdeationView';
import { UgcAdsView } from './components/UgcAdsView';
import { AboutView } from './components/AboutView';
import { WorksView } from './components/WorksView';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { InteractiveCanvas } from './components/InteractiveCanvas';
import { MarqueeTicker } from './components/MarqueeTicker';
import { ShowreelGeometricShapes } from './components/ShowreelGeometricShapes';
import { KeyboardNavHUD } from './components/KeyboardNavHUD';
import { PageTab, VideoItem } from './types';
import { SHOWREEL_VIDEO, PERSONAL_INFO } from './data/portfolioData';
import { Play, ArrowRight, List, Sliders, ArrowUpRight, Copy, Check } from 'lucide-react';
import { KineticPillButton } from './components/KineticPillButton';

const HOME_SECTIONS = [
  { id: 'hero-section', label: '01 Intro & Bio' },
  { id: 'selected-works', label: '02 Selected Works' },
  { id: 'portfolio-pillars', label: '03 Core Disciplines' },
  { id: 'featured-showreel', label: '04 Featured Showreel' },
  { id: 'commission-contact', label: '05 Contact & Commissions' },
];

const ALL_VIEWS: { id: PageTab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'works', label: 'Selected Works' },
  { id: 'ai-ideation', label: 'AI Ideation' },
  { id: 'showreel', label: 'Master Showreel' },
  { id: 'ucg-ads', label: 'UGC Commercials' },
  { id: 'about', label: 'About & UAE Market' },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageTab>('home');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeNavKey, setActiveNavKey] = useState<'up' | 'down' | 'left' | 'right' | null>(null);
  const [currentSectionLabel, setCurrentSectionLabel] = useState<string | undefined>(undefined);

  // Sync with window hash if present
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as PageTab;
      if (hash === 'works') {
        setCurrentTab('home');
        setTimeout(() => {
          const el = document.getElementById('selected-works');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (['home', 'ai-ideation', 'showreel', 'ucg-ads', 'about'].includes(hash)) {
        setCurrentTab(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleTabChange = useCallback((tab: PageTab) => {
    if (tab === 'works') {
      if (currentTab === 'home') {
        const worksElement = document.getElementById('selected-works');
        if (worksElement) {
          worksElement.scrollIntoView({ behavior: 'smooth' });
          window.location.hash = 'works';
          return;
        }
      } else {
        setCurrentTab('home');
        window.location.hash = 'works';
        setTimeout(() => {
          const worksElement = document.getElementById('selected-works');
          if (worksElement) {
            worksElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 120);
        return;
      }
    }
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Section navigation (ArrowUp / ArrowDown)
  const handleSectionNav = useCallback((direction: 'up' | 'down') => {
    if (currentTab === 'home') {
      const currentScroll = window.scrollY;
      const sections = HOME_SECTIONS.map((sec) => {
        const el = document.getElementById(sec.id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          ...sec,
          top: Math.max(0, rect.top + window.scrollY - 72),
        };
      }).filter(Boolean) as { id: string; label: string; top: number }[];

      if (direction === 'down') {
        const next = sections.find((s) => s.top > currentScroll + 50);
        if (next) {
          window.scrollTo({ top: next.top, behavior: 'smooth' });
          setCurrentSectionLabel(next.label);
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      } else {
        const prevList = sections.filter((s) => s.top < currentScroll - 50);
        if (prevList.length > 0) {
          const prev = prevList[prevList.length - 1];
          window.scrollTo({ top: prev.top, behavior: 'smooth' });
          setCurrentSectionLabel(prev.label);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setCurrentSectionLabel(HOME_SECTIONS[0].label);
        }
      }
    } else {
      const delta = window.innerHeight * 0.75;
      window.scrollBy({
        top: direction === 'down' ? delta : -delta,
        behavior: 'smooth',
      });
    }
  }, [currentTab]);

  // View navigation (ArrowLeft / ArrowRight)
  const handleViewNav = useCallback((direction: 'prev' | 'next') => {
    const currentIndex = ALL_VIEWS.findIndex((v) => v.id === currentTab);
    let nextIndex: number;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % ALL_VIEWS.length;
    } else {
      nextIndex = (currentIndex - 1 + ALL_VIEWS.length) % ALL_VIEWS.length;
    }
    const targetView = ALL_VIEWS[nextIndex];
    handleTabChange(targetView.id);
    setCurrentSectionLabel(`View: ${targetView.label}`);
  }, [currentTab, handleTabChange]);

  // Keyboard navigation event handler
  useEffect(() => {
    let keyTimeout: NodeJS.Timeout;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in inputs or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      // If activeVideo modal is open, let Escape close it and don't hijack arrows
      if (activeVideo) {
        if (e.key === 'Escape') {
          setActiveVideo(null);
        }
        return;
      }

      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        clearTimeout(keyTimeout);

        if (e.key === 'ArrowDown') {
          setActiveNavKey('down');
          handleSectionNav('down');
        } else if (e.key === 'ArrowUp') {
          setActiveNavKey('up');
          handleSectionNav('up');
        } else if (e.key === 'ArrowRight') {
          setActiveNavKey('right');
          handleViewNav('next');
        } else if (e.key === 'ArrowLeft') {
          setActiveNavKey('left');
          handleViewNav('prev');
        }

        keyTimeout = setTimeout(() => {
          setActiveNavKey(null);
        }, 400);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(keyTimeout);
    };
  }, [handleSectionNav, handleViewNav, activeVideo]);

  // Dynamically update active section label based on scroll position
  useEffect(() => {
    if (currentTab !== 'home') {
      const view = ALL_VIEWS.find((v) => v.id === currentTab);
      setCurrentSectionLabel(view ? view.label : undefined);
      return;
    }

    const onScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (let i = HOME_SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(HOME_SECTIONS[i].id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPos >= top) {
            setCurrentSectionLabel(HOME_SECTIONS[i].label);
            return;
          }
        }
      }
      setCurrentSectionLabel(HOME_SECTIONS[0].label);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentTab]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#090a0c] text-[#e6e8eb] overflow-x-hidden selection:bg-[#d85d3a]/30 selection:text-white">
      {/* Interactive Constellation Web Canvas (pure luminous dots and links all over) */}
      <InteractiveCanvas />

      {/* Top Architectural Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onOpenContact={() => handleTabChange('about')}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* 1. Clean, Figma-grade Hero Section with disciplined width & smooth animations */}
              <div id="hero-section">
                <HeroSection
                  onTabChange={handleTabChange}
                  onPlayShowreel={() => setActiveVideo(SHOWREEL_VIDEO)}
                />
              </div>

              {/* 2. Infinite Kinetic Marquee Ribbon */}
              <MarqueeTicker />

              {/* 3. 01 WORKS (Dedicated Portfolio Works Section brought to Home directly after Introduction) */}
              <section id="selected-works" className="border-t border-neutral-800/80">
                <WorksView
                  onSelectVideo={(video) => setActiveVideo(video)}
                  onNavigate={handleTabChange}
                />
              </section>

              {/* 4. Portfolio Pillars (Four Core Disciplines) */}
              <FeaturedCards onSelectTab={handleTabChange} />

              {/* 5. Master Showreel Cinematic Theater Dock on Home */}
              <section id="featured-showreel" className="relative py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 border-t border-neutral-800/80 overflow-hidden">
                {/* Subtle, slow-floating geometric background shapes */}
                <ShowreelGeometricShapes />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-4 space-y-4">
                    <div className="font-mono text-[11px] tracking-[0.25em] text-[#d85d3a] uppercase font-semibold">
                      Featured Showreel
                    </div>
                    <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase leading-tight">
                      Broadcast Motion &amp; Visual Momentum
                    </h2>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      A high-retention showcase capturing 15+ years of broadcast commercials, kinetic typography, motion graphics, and agency brand films engineered for maximum screen impact.
                    </p>
                    <div className="pt-2 font-mono text-xs space-y-1.5 text-neutral-300">
                      <div><span className="text-neutral-500">RUNTIME:</span> 01:48</div>
                      <div><span className="text-neutral-500">FORMAT:</span> 4K Ultra HD • 60 FPS</div>
                      <div><span className="text-neutral-500">PIPELINE:</span> After Effects • Premiere Pro • DaVinci • AI</div>
                    </div>
                    <div className="pt-3">
                      <button
                        onClick={() => handleTabChange('showreel')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold text-white bg-[#d85d3a] hover:bg-[#c24e2d] transition-colors shadow-lg shadow-[#d85d3a]/25"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>EXPAND SHOWREEL PAGE</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-8">
                    <div className="relative rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-2xl group">
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
                  </div>
                </div>
              </section>

              {/* 6. Monumental Contact & Commission Send-off */}
              <section id="commission-contact" className="py-24 md:py-32 border-t border-neutral-800/80 bg-gradient-to-b from-transparent to-neutral-950/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center space-y-8">
                  <div className="text-xs uppercase tracking-[0.2em] text-[#d85d3a] font-light">
                    Available for Freelance &amp; Contract Commissions
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight uppercase max-w-4xl mx-auto leading-[1.05]">
                    Let's Shape Visual Motion Together
                  </h2>

                  <p className="text-sm sm:text-base text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
                    Bringing 15+ years of UAE agency rigor and cutting-edge generative AI cinematics to your next commercial, brand anthem, or motion identity.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4 text-xs font-light">
                    <KineticPillButton
                      variant="email"
                      onClick={handleCopyEmail}
                      copied={copiedEmail}
                      icon={
                        copiedEmail ? (
                          <Check className="w-4 h-4 text-emerald-100" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )
                      }
                    >
                      {copiedEmail ? 'EMAIL COPIED TO CLIPBOARD' : PERSONAL_INFO.email}
                    </KineticPillButton>

                    <KineticPillButton
                      variant="linkedin"
                      href={PERSONAL_INFO.linkedin}
                      icon={<ArrowUpRight className="w-4 h-4 text-[#d85d3a]" />}
                    >
                      LINKEDIN PROFILE
                    </KineticPillButton>

                    <KineticPillButton
                      variant="canva"
                      href={PERSONAL_INFO.canvaPortfolio}
                      icon={<ArrowUpRight className="w-4 h-4 text-[#d85d3a]" />}
                    >
                      CANVA PORTFOLIO
                    </KineticPillButton>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {currentTab === 'works' && (
            <WorksView
              key="works"
              onSelectVideo={(video) => setActiveVideo(video)}
              onNavigate={handleTabChange}
            />
          )}

          {currentTab === 'ai-ideation' && (
            <AIIdeationView key="ai-ideation" onSelectVideo={(video) => setActiveVideo(video)} />
          )}

          {currentTab === 'showreel' && (
            <ShowreelView key="showreel" onTabChange={handleTabChange} />
          )}

          {currentTab === 'ucg-ads' && (
            <UgcAdsView key="ucg-ads" onSelectVideo={(video) => setActiveVideo(video)} />
          )}

          {currentTab === 'about' && <AboutView key="about" />}
        </AnimatePresence>
      </main>

      {/* Floating Keyboard Navigation HUD Guide */}
      <KeyboardNavHUD
        currentSectionLabel={currentSectionLabel}
        activeKey={activeNavKey}
        onNavigateSection={handleSectionNav}
        onNavigateView={handleViewNav}
      />

      {/* Video Lightbox Modal */}
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />

      {/* Global Minimalist Footer */}
      <Footer onTabChange={handleTabChange} />
    </div>
  );
}
