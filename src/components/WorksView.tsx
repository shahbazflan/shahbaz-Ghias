import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, LayoutGrid, List, Sparkles, Film, ArrowUpRight, Play, Eye } from 'lucide-react';
import { VideoItem, PageTab } from '../types';
import { ALL_PORTFOLIO_WORKS } from '../data/portfolioData';
import { WorksSlider } from './WorksSlider';
import { WorksArchiveList } from './WorksArchiveList';
import { VideoCard } from './VideoCard';
import { ScrambleText } from './ScrambleText';

interface WorksViewProps {
  onSelectVideo: (video: VideoItem) => void;
  onNavigate: (tab: PageTab) => void;
}

type DisplayMode = 'slider' | 'archive' | 'grid';

export const WorksView: React.FC<WorksViewProps> = ({ onSelectVideo, onNavigate }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('slider');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    ALL_PORTFOLIO_WORKS.forEach((v) => set.add(v.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'all') return ALL_PORTFOLIO_WORKS;
    return ALL_PORTFOLIO_WORKS.filter((v) => v.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="w-full min-h-screen text-neutral-100 flex flex-col">
      {/* Top Header Bar */}
      <div className="border-b border-neutral-900 bg-[#090a0c]/80 backdrop-blur-md sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#d85d3a] animate-pulse" />
              <span className="font-mono text-[11px] tracking-wider text-[#d85d3a] uppercase font-semibold">
                01 Works / Portfolio Showcase
              </span>
            </div>
            <h1 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
              <span>Selected Works</span>
              <span className="text-neutral-500 font-mono text-base font-normal">
                [{filteredVideos.length}]
              </span>
            </h1>
          </div>

          {/* Right Controls: Filter categories + View Mode Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-mono">
              <button
                onClick={() => setDisplayMode('slider')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  displayMode === 'slider'
                    ? 'bg-[#d85d3a] text-white font-bold shadow-md shadow-[#d85d3a]/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>SLIDER</span>
              </button>

              <button
                onClick={() => setDisplayMode('archive')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  displayMode === 'archive'
                    ? 'bg-[#d85d3a] text-white font-bold shadow-md shadow-[#d85d3a]/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>ARCHIVE TABLE</span>
              </button>

              <button
                onClick={() => setDisplayMode('grid')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  displayMode === 'grid'
                    ? 'bg-[#d85d3a] text-white font-bold shadow-md shadow-[#d85d3a]/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>GRID</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider pr-1">Filter:</span>
          {categories.map((cat) => {
            const count =
              cat === 'all'
                ? ALL_PORTFOLIO_WORKS.length
                : ALL_PORTFOLIO_WORKS.filter((v) => v.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap transition-all uppercase ${
                  isSelected
                    ? 'bg-neutral-200 text-neutral-950 font-bold'
                    : 'bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800/80'
                }`}
              >
                {cat === 'all' ? 'All Works' : cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area based on Display Mode */}
      <div className="flex-1 w-full">
        {displayMode === 'slider' && (
          <WorksSlider
            videos={filteredVideos}
            onSelectVideo={onSelectVideo}
            onSwitchToArchive={() => setDisplayMode('archive')}
          />
        )}

        {displayMode === 'archive' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-syne text-xl font-bold text-white uppercase tracking-tight">
                  Archive Index Table
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Hover over any entry for instant floating video preview
                </p>
              </div>
              <button
                onClick={() => setDisplayMode('slider')}
                className="font-mono text-xs text-[#d85d3a] hover:underline flex items-center gap-1"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Return to Slider</span>
              </button>
            </div>

            <WorksArchiveList
              videos={filteredVideos}
              onSelectVideo={onSelectVideo}
            />
          </div>
        )}

        {displayMode === 'grid' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => onSelectVideo(video)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Pillar Strip */}
      <div className="border-t border-neutral-900 bg-neutral-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-400">
          <div>
            <span>Explore Specific Categories:</span>
            <div className="flex items-center gap-4 mt-2 font-bold text-neutral-200">
              <button
                onClick={() => onNavigate('ai-ideation')}
                className="hover:text-[#d85d3a] transition-colors"
              >
                02 AI Concept Lab →
              </button>
              <button
                onClick={() => onNavigate('showreel')}
                className="hover:text-[#d85d3a] transition-colors"
              >
                03 Master Showreel →
              </button>
              <button
                onClick={() => onNavigate('ucg-ads')}
                className="hover:text-[#d85d3a] transition-colors"
              >
                04 UGC & 9:16 Ads →
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="text-neutral-500 font-mono text-[11px]">
              Motion Graphics & Directing Portfolio
            </p>
            <p className="text-white font-semibold">Shahbaz Ahmed • UAE</p>
          </div>
        </div>
      </div>
    </div>
  );
};
