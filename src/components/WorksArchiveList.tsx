import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowUpRight, Sparkles, Film, ExternalLink } from 'lucide-react';
import { VideoItem, PageTab } from '../types';
import { ScrambleText } from './ScrambleText';

interface WorksArchiveListProps {
  videos: VideoItem[];
  onSelectVideo: (video: VideoItem) => void;
  onViewAll?: () => void;
}

export const WorksArchiveList: React.FC<WorksArchiveListProps> = ({
  videos,
  onSelectVideo,
  onViewAll,
}) => {
  const [hoveredVideo, setHoveredVideo] = useState<VideoItem | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Floating Cursor Preview (Locomotive / Quentin Hocde style) */}
      <AnimatePresence>
        {hoveredVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: mousePos.x + 24,
              y: mousePos.y - 120,
            }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 28,
              mass: 0.5,
            }}
            className="pointer-events-none fixed top-0 left-0 z-50 hidden lg:block w-72 rounded-xl overflow-hidden bg-neutral-900/95 border border-neutral-700 shadow-2xl backdrop-blur-md"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <img
                src={hoveredVideo.thumbnail}
                alt={hoveredVideo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#d85d3a]/90 flex items-center justify-center text-white shadow-lg">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-black/80 text-[#d85d3a] border border-[#d85d3a]/30">
                {hoveredVideo.category}
              </span>
            </div>
            <div className="p-3 bg-neutral-950/90 border-t border-neutral-800">
              <p className="font-display text-xs font-bold text-white truncate">
                {hoveredVideo.title}
              </p>
              <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                {hoveredVideo.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editorial Table Header (Quentin Hocde style) */}
      <div className="grid grid-cols-12 gap-4 pb-3 border-b border-neutral-800 font-mono text-[11px] uppercase tracking-widest text-neutral-400 select-none">
        <div className="col-span-1">No.</div>
        <div className="col-span-6 sm:col-span-4 lg:col-span-4">Project / Title</div>
        <div className="hidden sm:block col-span-3 lg:col-span-3">Role / Focus</div>
        <div className="hidden lg:block col-span-3">Pipeline & Tools</div>
        <div className="col-span-5 sm:col-span-4 lg:col-span-1 text-right">Year</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-neutral-800/70">
        {videos.map((video, index) => {
          const formattedIndex = String(index + 1).padStart(2, '0');
          const pipeline = video.tools?.slice(0, 3).join(', ') || 'After Effects, Premiere Pro';

          return (
            <div
              key={video.id}
              id={`archive-row-${video.id}`}
              onClick={() => onSelectVideo(video)}
              onMouseEnter={() => setHoveredVideo(video)}
              onMouseLeave={() => setHoveredVideo(null)}
              className="group grid grid-cols-12 gap-4 py-4 sm:py-4.5 items-center cursor-pointer transition-colors duration-200 hover:bg-neutral-900/50 px-2 rounded-lg"
            >
              {/* Index Number */}
              <div className="col-span-1 font-mono text-xs text-neutral-500 group-hover:text-[#d85d3a] transition-colors">
                {formattedIndex}
              </div>

              {/* Title */}
              <div className="col-span-6 sm:col-span-4 lg:col-span-4 flex flex-col justify-center">
                <span className="font-syne text-sm sm:text-base font-bold text-neutral-200 group-hover:text-white transition-colors flex items-center gap-1.5">
                  <ScrambleText text={video.title} hoverOnly />
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#d85d3a] transition-opacity" />
                </span>
                <span className="sm:hidden font-mono text-[10px] text-neutral-400 mt-0.5">
                  {video.category} • {video.year || '2025'}
                </span>
              </div>

              {/* Role / Focus */}
              <div className="hidden sm:flex col-span-3 lg:col-span-3 flex-col justify-center">
                <span className="font-mono text-xs text-neutral-300 group-hover:text-white transition-colors">
                  {video.role || 'Visual Director & Animator'}
                </span>
                <span className="font-mono text-[10px] text-neutral-500">
                  {video.category}
                </span>
              </div>

              {/* Pipeline Engine */}
              <div className="hidden lg:block col-span-3 font-mono text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors truncate">
                {pipeline}
              </div>

              {/* Year & Action */}
              <div className="col-span-5 sm:col-span-4 lg:col-span-1 text-right flex items-center justify-end gap-2 font-mono text-xs">
                <span className="text-neutral-400 group-hover:text-[#d85d3a] font-bold">
                  {video.year || '2025'}
                </span>
                <div className="w-6 h-6 rounded-full bg-neutral-900 group-hover:bg-[#d85d3a] text-neutral-400 group-hover:text-white flex items-center justify-center transition-colors">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
