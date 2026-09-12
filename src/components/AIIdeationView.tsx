import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Sparkles, Search, Filter, Layers, ExternalLink, ArrowUpRight } from 'lucide-react';
import { AI_IDEATION_VIDEOS } from '../data/portfolioData';
import { VideoItem } from '../types';
import { ScrambleText } from './ScrambleText';

interface AIIdeationViewProps {
  onSelectVideo: (video: VideoItem) => void;
}

export const AIIdeationView: React.FC<AIIdeationViewProps> = ({ onSelectVideo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(AI_IDEATION_VIDEOS.map((v) => v.category))];
    return cats;
  }, []);

  // Filtered videos
  const filteredVideos = useMemo(() => {
    return AI_IDEATION_VIDEOS.filter((video) => {
      const matchesCat = selectedCategory === 'All' || video.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.tools?.some((t) => t.toLowerCase().includes(query));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d85d3a]/15 text-[#d85d3a] border border-[#d85d3a]/30 text-xs uppercase tracking-wider font-light">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Concept Lab</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
            AI Ideation &amp; Synthetic Motion
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-light">
            Exploring generative commercial cinematography, high-speed fluid simulations, macro textures, and dynamic automotive tracking.
          </p>
        </div>

        {/* Total count badge */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-light">
            <span className="text-[#d85d3a] font-normal text-base mr-1.5">{AI_IDEATION_VIDEOS.length}</span>
            Commercial Concepts
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none text-xs font-light">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#d85d3a] text-white font-normal shadow-md shadow-[#d85d3a]/25'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search concepts or tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-light text-white placeholder-neutral-500 focus:outline-none focus:border-[#d85d3a] transition-colors"
          />
        </div>
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-neutral-900/30 rounded-2xl border border-neutral-800/80">
          <p className="text-neutral-400 text-sm font-light">No concept matching your search was found.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-full text-xs font-light text-white bg-[#d85d3a] hover:bg-[#c24e2d] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onSelectVideo(video)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-neutral-900/70 border border-neutral-800 hover:border-[#d85d3a]/70 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#d85d3a]/90 group-hover:bg-[#d85d3a] text-white flex items-center justify-center shadow-xl shadow-black/60 group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-light uppercase tracking-wider bg-black/80 backdrop-blur-md text-[#d85d3a] border border-[#d85d3a]/40">
                    {video.category}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#090a0c]/80 border-t border-neutral-800/80">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-normal text-white group-hover:text-[#d85d3a] transition-colors line-clamp-1">
                      <ScrambleText text={video.title} hoverOnly />
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-[#d85d3a] transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-light">
                    {video.description}
                  </p>
                </div>

                {/* Pipeline Tags */}
                <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-light">
                  <div className="flex flex-wrap gap-1">
                    {video.tools?.slice(0, 2).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-light bg-neutral-800/90 text-neutral-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-[#d85d3a] font-normal group-hover:underline">
                    PLAY REEL ↗
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
