import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowUpRight, ChevronLeft, ChevronRight, Sparkles, Filter, LayoutGrid, List, Sliders } from 'lucide-react';
import { VideoItem } from '../types';
import { ScrambleText } from './ScrambleText';

interface WorksSliderProps {
  videos: VideoItem[];
  onSelectVideo: (video: VideoItem) => void;
  onSwitchToArchive?: () => void;
}

export const WorksSlider: React.FC<WorksSliderProps> = ({
  videos,
  onSelectVideo,
  onSwitchToArchive,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const lastWheelTime = useRef(0);

  const total = videos.length;

  // Keep activeIndex within bounds when the videos array changes
  useEffect(() => {
    if (activeIndex >= total && total > 0) {
      setActiveIndex(0);
    }
  }, [total, activeIndex]);

  const safeIndex = total > 0 ? Math.min(Math.max(0, activeIndex), total - 1) : 0;
  const activeVideo = total > 0 ? (videos[safeIndex] || videos[0] || null) : null;

  const goToNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation (Quentin Hocde style)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'KeyD') {
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'KeyA') {
        goToPrev();
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (activeVideo) onSelectVideo(activeVideo);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, activeVideo, onSelectVideo]);

  // Wheel listener: translate vertical trackpad/mouse scroll to horizontal card switch
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 350) return;

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 25) {
      lastWheelTime.current = now;
      if (delta > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // Mouse & Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (!isDragging) return;
    const diff = e.clientX - dragStartX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -60) {
      goToNext();
    } else if (dragOffset > 60) {
      goToPrev();
    }
    setDragOffset(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - dragStartX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -50) {
      goToNext();
    } else if (dragOffset > 50) {
      goToPrev();
    }
    setDragOffset(0);
  };

  if (total === 0 || !activeVideo) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center text-center p-8 bg-[#090a0c] text-neutral-400 font-mono text-xs">
        <p className="text-base text-neutral-200 font-bold mb-2">No projects found in this filter</p>
        <p className="text-neutral-500">Please choose another category or click "ALL".</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsDragging(false);
        setIsHovered(false);
        setDragOffset(0);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-[82vh] lg:min-h-[88vh] flex flex-col justify-between select-none overflow-hidden bg-[#090a0c] pt-4 pb-8"
      style={{ perspective: '1400px' }}
    >
      {/* Quentin Hocde Interactive Custom Cursor Drag Pill */}
      {isHovered && (
        <motion.div
          animate={{
            x: mousePos.x + 16,
            y: mousePos.y - 20,
            scale: isDragging ? 1.15 : 1,
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 32, mass: 0.2 }}
          className="pointer-events-none fixed z-50 hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d85d3a] text-white font-syne text-[10px] font-extrabold tracking-widest shadow-xl shadow-[#d85d3a]/30 uppercase"
        >
          {hoveredCardIndex === activeIndex ? (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span>PLAY REEL</span>
            </>
          ) : (
            <>
              <span>DRAG</span>
              <span>↔</span>
            </>
          )}
        </motion.div>
      )}

      {/* PERSPECTIVE CAROUSEL TRACK (Quentin Hocde signature perspective) */}
      <div
        ref={trackRef}
        className="relative w-full h-[380px] sm:h-[440px] lg:h-[500px] flex items-center justify-center my-auto cursor-grab active:cursor-grabbing"
      >
        {videos.map((video, idx) => {
          // Calculate relative distance from active card
          let diff = idx - activeIndex;

          // Wrap-around math for circular feeling
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;

          const isCenter = diff === 0;
          const isAdjacent = Math.abs(diff) === 1;
          const isVisible = Math.abs(diff) <= 2; // Render up to 2 items each side

          if (!isVisible) return null;

          // Dynamic perspective transforms based on offset
          const baseOffset = 460; // Card spacing in px
          const translateX = diff * baseOffset + dragOffset;
          const rotateY = diff * -14;
          const scale = isCenter ? 1 : isAdjacent ? 0.82 : 0.68;
          const opacity = isCenter ? 1 : isAdjacent ? 0.6 : 0.25;
          const zIndex = 30 - Math.abs(diff) * 10;

          return (
            <motion.div
              key={video.id}
              animate={{
                x: translateX,
                scale,
                rotateY,
                opacity,
              }}
              whileHover={{
                scale: isCenter ? 1.028 : isAdjacent ? 0.85 : 0.71,
                transition: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 24,
                  mass: 0.6,
                },
              }}
              whileTap={{
                scale: isCenter ? 0.985 : isAdjacent ? 0.80 : 0.66,
                transition: {
                  type: 'spring',
                  stiffness: 500,
                  damping: 28,
                },
              }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 28,
                mass: 0.8,
              }}
              onClick={() => {
                if (isCenter) {
                  onSelectVideo(video);
                } else {
                  setActiveIndex(idx);
                }
              }}
              onMouseEnter={() => setHoveredCardIndex(idx)}
              onMouseLeave={() => setHoveredCardIndex(null)}
              className="absolute w-[310px] sm:w-[500px] lg:w-[680px] aspect-[16/9.5] rounded-2xl overflow-hidden cursor-pointer shadow-2xl transition-shadow will-change-transform"
              style={{
                zIndex,
                transformStyle: 'preserve-3d',
                boxShadow: isCenter
                  ? (hoveredCardIndex === idx
                    ? '0 30px 60px -10px rgba(216, 93, 58, 0.35), 0 0 0 1.5px rgba(216, 93, 58, 0.85)'
                    : '0 25px 50px -12px rgba(216, 93, 58, 0.25), 0 0 0 1px rgba(216, 93, 58, 0.6)')
                  : (hoveredCardIndex === idx
                    ? '0 25px 45px -8px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.2)'
                    : '0 20px 35px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)'),
              }}
            >
              {/* Card Media (Video poster thumbnail) */}
              <div className="relative w-full h-full bg-black overflow-hidden group">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isCenter ? 'group-hover:scale-105' : 'filter brightness-75'
                  }`}
                />

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Center Play Button for Active Card */}
                {isCenter && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#d85d3a]/90 hover:bg-[#d85d3a] text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transition-colors border border-white/20"
                    >
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-1" />
                    </motion.div>
                  </div>
                )}

                {/* Top Corner Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-light text-neutral-200 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-neutral-800">
                    [{String(idx + 1).padStart(2, '0')}]
                  </span>
                  <span className="text-[10px] tracking-wider uppercase bg-[#d85d3a]/90 text-white font-light px-2.5 py-0.5 rounded shadow-sm">
                    {video.year || '2025'}
                  </span>
                </div>

                {/* Bottom Tag Preview for Inactive Cards */}
                {!isCenter && (
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <p className="text-xs font-light text-neutral-300 truncate">
                      {video.title}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Floating Left/Right Arrow Controls */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          className="absolute left-2 sm:left-6 lg:left-12 z-40 w-11 h-11 rounded-full bg-neutral-900/85 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          aria-label="Previous work"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-2 sm:right-6 lg:right-12 z-40 w-11 h-11 rounded-full bg-neutral-900/85 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          aria-label="Next work"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* QUENTIN HOCDE SIGNATURE BOTTOM METADATA DOCK (c-slider_content) */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 z-20 pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVideo.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {/* Title with link & arrow */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-800/80 pb-4">
              <button
                onClick={() => onSelectVideo(activeVideo)}
                className="group text-left focus:outline-none flex items-center gap-3"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white group-hover:text-[#d85d3a] tracking-tight uppercase transition-colors">
                  <ScrambleText text={activeVideo.title} />
                </h2>
                <div className="w-8 h-8 rounded-full bg-neutral-900 group-hover:bg-[#d85d3a] border border-neutral-800 group-hover:border-[#d85d3a] flex items-center justify-center text-neutral-400 group-hover:text-white transition-all flex-shrink-0">
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>

              <p className="text-xs text-neutral-400 max-w-md font-light leading-relaxed">
                {activeVideo.description}
              </p>
            </div>

            {/* Quentin Hocde 5-Column Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-4 lg:gap-6 text-xs uppercase tracking-wider font-light">
              {/* 1. ROLE (col-span-2) */}
              <div className="lg:col-span-3 space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-light">
                  Role
                </p>
                <p className="text-neutral-200 font-light normal-case">
                  {activeVideo.role || 'Senior Visual Director & Lead Motion'}
                </p>
              </div>

              {/* 2. RECOGNITIONS / CATEGORY (col-span-3) */}
              <div className="lg:col-span-3 space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-light">
                  Category / Focus
                </p>
                <p className="text-neutral-200 font-light normal-case">
                  {activeVideo.recognitions || activeVideo.category}
                </p>
              </div>

              {/* 3. CONTEXT (col-span-3) */}
              <div className="lg:col-span-3 space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-light">
                  Context
                </p>
                <p className="text-neutral-200 font-light normal-case">
                  {activeVideo.context || '15+ Years UAE Agency & Commercial Compilation'}
                </p>
              </div>

              {/* 4. PIPELINE (col-span-2) */}
              <div className="lg:col-span-2 space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-light">
                  Pipeline
                </p>
                <p className="text-neutral-200 font-light truncate normal-case" title={activeVideo.tools?.join(', ')}>
                  {activeVideo.tools?.slice(0, 3).join(', ') || 'After Effects, Premiere Pro'}
                </p>
              </div>

              {/* 5. YEAR (col-span-1 text-right) */}
              <div className="lg:col-span-1 text-left sm:text-right space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-light">
                  Year
                </p>
                <p className="text-[#d85d3a] font-normal">
                  {activeVideo.year || '2025'}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom scrub timeline / progress pill track */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-neutral-900 text-[11px] text-neutral-500 uppercase tracking-wider font-light">
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-md scrollbar-none py-1">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex
                    ? 'w-8 bg-[#d85d3a]'
                    : 'w-2 bg-neutral-800 hover:bg-neutral-600'
                }`}
                title={`Jump to project ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectVideo(activeVideo)}
              className="inline-flex items-center gap-1.5 text-xs font-light text-white bg-[#d85d3a] hover:bg-[#c24e2d] px-3.5 py-1.5 rounded-full transition-colors shadow-md shadow-[#d85d3a]/25"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>WATCH REEL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
