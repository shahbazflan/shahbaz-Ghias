import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Film, ExternalLink, ChevronDown } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (video) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [video, onClose]);

  // Mobile touch gesture handlers for direct swipe-to-dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;
    const deltaTime = Math.max(1, Date.now() - touchStartTime.current);
    const velocityY = deltaY / deltaTime; // px per ms

    // If dragged downward by > 65px or flicked down with velocity
    if (deltaY > 65 || (deltaY > 25 && velocityY > 0.35)) {
      onClose();
    }
    touchStartY.current = null;
  };

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          id="video-lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/90 backdrop-blur-md"
        >
          <motion.div
            id="video-lightbox-container"
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 60 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.1, bottom: 0.85 }}
            dragSnapToOrigin
            onDragEnd={(_, info) => {
              // Dismiss on downward drag (> 75px or downward velocity > 320px/s)
              // or upward drag if intentionally swiped away
              if (info.offset.y > 75 || info.velocity.y > 320 || info.offset.y < -120 || info.velocity.y < -400) {
                onClose();
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className={`relative z-10 w-full bg-[#111317] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
              video.aspect === '9:16' ? 'max-w-md max-h-[92vh]' : 'max-w-4xl'
            }`}
          >
            {/* Mobile Top Grab Pill Bar for Swipe-to-Dismiss */}
            <div
              className="w-full flex flex-col items-center justify-center pt-2 pb-1.5 bg-[#16181d] sm:hidden border-b border-neutral-800/60 cursor-grab active:cursor-grabbing select-none touch-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              aria-label="Swipe down to dismiss"
            >
              <div className="w-12 h-1.5 rounded-full bg-neutral-600 active:bg-[#d85d3a] transition-colors" />
              <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400 tracking-wider uppercase mt-1">
                <ChevronDown className="w-3 h-3 text-[#d85d3a]" />
                <span>Swipe down to close</span>
              </div>
            </div>

            {/* Header bar */}
            <div
              className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800/80 bg-neutral-900/60 cursor-grab active:cursor-grabbing select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex items-center gap-2.5 truncate mr-3 pointer-events-none">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#d85d3a]/20 text-[#d85d3a] border border-[#d85d3a]/30">
                  {video.category}
                </span>
                <h3 className="font-display font-semibold text-sm sm:text-base text-white truncate">
                  {video.title}
                </h3>
              </div>
              <button
                id="video-modal-close-btn"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors focus:outline-none shrink-0"
                aria-label="Close video modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Frame */}
            <div
              className={`w-full bg-black relative ${
                video.aspect === '9:16' ? 'aspect-[9/16] max-h-[68vh]' : 'aspect-video'
              }`}
            >
              <iframe
                src={`https://fast.wistia.net/embed/iframe/${video.id}?autoplay=1&autoPlay=true&web_component=true&seo=true`}
                title={video.title}
                allow="autoplay; fullscreen"
                allowFullScreen
                className="w-full h-full border-0 absolute inset-0"
              />
            </div>

            {/* Footer details */}
            <div className="p-4 sm:p-5 bg-[#111317] space-y-3">
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {video.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800/60">
                {video.tools && video.tools.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-medium text-neutral-500 mr-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#d85d3a]" /> Pipeline:
                    </span>
                    {video.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-800/80 text-neutral-300 border border-neutral-700/60"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}

                <a
                  href={`https://fast.wistia.net/embed/iframe/${video.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-[#d85d3a] transition-colors ml-auto"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Direct Player</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
