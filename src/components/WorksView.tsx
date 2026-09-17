import React from 'react';
import { VideoItem, PageTab } from '../types';
import { ALL_PORTFOLIO_WORKS } from '../data/portfolioData';
import { WorksSlider } from './WorksSlider';

interface WorksViewProps {
  onSelectVideo: (video: VideoItem) => void;
  onNavigate: (tab: PageTab) => void;
}

export const WorksView: React.FC<WorksViewProps> = ({ onSelectVideo, onNavigate }) => {
  return (
    <div className="w-full min-h-screen text-neutral-100 flex flex-col">
      {/* Clean headline with disciplined spacing so 3D carousel dominates viewport */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 pt-10 sm:pt-14 pb-3 sm:pb-5">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#d85d3a] mb-2 font-light">
          <span>Featured Portfolio</span>
        </div>
        <h2 className="font-name-zalando text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold uppercase leading-[0.9] tracking-tight text-white hover:text-[#f59e0b] hover:drop-shadow-[0_0_35px_rgba(245,158,11,0.45)] transition-all duration-300 select-none cursor-default">
          SELECTED<br />WORKS
        </h2>
      </div>

      {/* Main Showcase Slider */}
      <div className="flex-1 w-full">
        <WorksSlider
          videos={ALL_PORTFOLIO_WORKS}
          onSelectVideo={onSelectVideo}
        />
      </div>

      {/* Footer Navigation Pillar Strip */}
      <div className="border-t border-neutral-900 bg-neutral-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 uppercase tracking-wider font-light">
          <div>
            <span className="font-normal text-neutral-300">Explore Specific Categories:</span>
            <div className="flex items-center gap-4 mt-2 font-light text-neutral-200">
              <button
                onClick={() => onNavigate('ai-ideation')}
                className="hover:text-[#d85d3a] transition-colors"
              >
                AI Concept Lab →
              </button>
              <button
                onClick={() => onNavigate('showreel')}
                className="hover:text-[#d85d3a] transition-colors"
              >
                Master Showreel →
              </button>
              <button
                onClick={() => onNavigate('ucg-ads')}
                className="hover:text-[#d85d3a] transition-colors"
              >
                UGC &amp; 9:16 Ads →
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="text-neutral-500 text-[11px] font-light">
              Motion Graphics & Visual Portfolio
            </p>
            <p className="text-white hover:text-[#f59e0b] transition-colors duration-300 cursor-default font-normal">Shahbaz Ahmed • UAE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

