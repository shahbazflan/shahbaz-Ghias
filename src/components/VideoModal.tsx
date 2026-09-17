import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Film, ExternalLink, ChevronDown, Video, Link2, Check, Copy, RefreshCw } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

type ParsedVideoSource =
  | { type: 'youtube'; embedUrl: string; directUrl: string }
  | { type: 'vimeo'; embedUrl: string; directUrl: string }
  | { type: 'html5'; url: string; directUrl: string }
  | { type: 'wistia'; id: string; embedUrl: string; directUrl: string }
  | { type: 'iframe'; embedUrl: string; directUrl: string };

function parseVideoSource(raw?: string, fallbackId?: string): ParsedVideoSource {
  const target = (raw || fallbackId || '').trim();

  // YouTube detection
  const ytMatch = target.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
      directUrl: `https://youtu.be/${ytMatch[1]}`,
    };
  }

  // Vimeo detection
  const vimeoMatch = target.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0`,
      directUrl: `https://vimeo.com/${vimeoMatch[1]}`,
    };
  }

  // Direct HTML5 Video (.mp4, .webm, .ogg, .mov, data, or Wistia bin deliveries)
  if (
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(target) ||
    target.includes('.bin') ||
    target.startsWith('blob:') ||
    target.startsWith('data:video/')
  ) {
    return {
      type: 'html5',
      url: target,
      directUrl: target,
    };
  }

  // Wistia Share URL (/s/<id>)
  const wistiaShareMatch = target.match(/wistia\.com\/s\/([a-zA-Z0-9]+)/i);
  if (wistiaShareMatch) {
    const shareKey = wistiaShareMatch[1];
    // Known share key mappings
    const resolvedId = shareKey === 'tjufffl5ujbbfjj' ? 'hrda6ver65' : shareKey;
    return {
      type: 'wistia',
      id: resolvedId,
      embedUrl: `https://fast.wistia.net/embed/iframe/${resolvedId}?autoplay=1&autoPlay=true&web_component=true&seo=true&videoFoam=true`,
      directUrl: `https://shahbazflan.wistia.com/s/${shareKey}`,
    };
  }

  // Wistia URL
  const wistiaMatch = target.match(/(?:wistia\.(?:com|net)\/(?:embed\/iframe|medias)\/)([a-zA-Z0-9]+)/i);
  if (wistiaMatch) {
    let wistiaId = wistiaMatch[1];
    if (wistiaId === 'tjufffl5ujbbfjj') {
      wistiaId = 'hrda6ver65';
    }
    let embedUrl = target.includes('fast.wistia.net/embed/iframe/')
      ? (target.includes('tjufffl5ujbbfjj') ? target.replace('tjufffl5ujbbfjj', 'hrda6ver65') : target)
      : `https://fast.wistia.net/embed/iframe/${wistiaId}?web_component=true&seo=true&videoFoam=true`;
    if (!embedUrl.includes('autoplay=1') && !embedUrl.includes('autoPlay=')) {
      embedUrl += (embedUrl.includes('?') ? '&' : '?') + 'autoplay=1&autoPlay=true';
    }
    return {
      type: 'wistia',
      id: wistiaId,
      embedUrl,
      directUrl: target.startsWith('http') ? target : `https://fast.wistia.net/embed/iframe/${wistiaId}`,
    };
  }

  // Generic full URL iframe
  if (target.startsWith('http://') || target.startsWith('https://')) {
    return {
      type: 'iframe',
      embedUrl: target,
      directUrl: target,
    };
  }

  // Default to Wistia hashed ID
  const cleanId = target || '1ia8jflogs';
  return {
    type: 'wistia',
    id: cleanId,
    embedUrl: `https://fast.wistia.net/embed/iframe/${cleanId}?autoplay=1&autoPlay=true&web_component=true&seo=true`,
    directUrl: `https://fast.wistia.net/embed/iframe/${cleanId}`,
  };
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [activeUrl, setActiveUrl] = useState<string>('');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync state whenever active video changes
  useEffect(() => {
    if (video) {
      const initial = video.videoUrl || video.id || '';
      setActiveUrl(initial);
      setCustomVideoUrl('');
      setIsEditingUrl(false);
      setCopiedCode(false);
    }
  }, [video]);

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

  const currentSource = useMemo(() => {
    return parseVideoSource(activeUrl, video?.id);
  }, [activeUrl, video?.id]);

  const handleApplyCustomUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (customVideoUrl.trim()) {
      setActiveUrl(customVideoUrl.trim());
    }
  };

  const handleCopyConfig = () => {
    const snippet = `videoUrl: '${activeUrl}',`;
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
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
              if (info.offset.y > 75 || info.velocity.y > 320 || info.offset.y < -120 || info.velocity.y < -400) {
                onClose();
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className={`relative z-10 w-full bg-[#111317] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
              video.aspect === '9:16' ? 'max-w-md max-h-[94vh]' : 'max-w-4xl'
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
              <div className="flex items-center gap-1 text-[10px] text-neutral-400 tracking-wider uppercase mt-1 font-light">
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
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-light tracking-wider uppercase bg-[#d85d3a]/20 text-[#d85d3a] border border-[#d85d3a]/30">
                  {video.category}
                </span>
                <h3 className="font-normal text-sm sm:text-base text-white truncate">
                  {video.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingUrl(!isEditingUrl)}
                  className={`px-2.5 py-1 rounded text-[11px] font-light flex items-center gap-1.5 transition-colors ${
                    isEditingUrl
                      ? 'bg-[#d85d3a] text-white'
                      : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                  }`}
                  title="Replace or test another video link (YouTube, Vimeo, MP4, Wistia)"
                >
                  <Link2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Add/Test Video</span>
                </button>
                <button
                  id="video-modal-close-btn"
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors focus:outline-none shrink-0"
                  aria-label="Close video modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Expandable Video Link Tester Drawer */}
            <AnimatePresence>
              {isEditingUrl && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#181b22] border-b border-neutral-800 px-5 py-3.5 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs text-neutral-300">
                    <span className="font-medium flex items-center gap-1.5 text-white">
                      <Video className="w-3.5 h-3.5 text-[#d85d3a]" />
                      Custom Video Source Link / Embed
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                      Supports: YouTube • Vimeo • MP4 • Wistia
                    </span>
                  </div>

                  <form onSubmit={handleApplyCustomUrl} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Paste YouTube, Vimeo, direct .mp4 URL, or Wistia ID..."
                      value={customVideoUrl}
                      onChange={(e) => setCustomVideoUrl(e.target.value)}
                      className="flex-1 px-3.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d85d3a]"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={!customVideoUrl.trim()}
                        className="px-3 py-1.5 bg-[#d85d3a] hover:bg-[#c24e2d] disabled:opacity-50 text-white text-xs rounded-lg transition-colors font-medium shrink-0"
                      >
                        Play Video
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyConfig}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg transition-colors flex items-center gap-1 shrink-0"
                        title="Copy configuration snippet for portfolioData.ts"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video Player Frame */}
            <div
              className={`w-full bg-black relative flex items-center justify-center ${
                video.aspect === '9:16' ? 'aspect-[9/16] max-h-[68vh]' : 'aspect-video'
              }`}
            >
              {currentSource.type === 'html5' ? (
                <video
                  key={currentSource.url}
                  src={currentSource.url}
                  poster={video.thumbnail}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Your browser does not support HTML5 video playback.
                </video>
              ) : (
                <iframe
                  key={currentSource.embedUrl}
                  src={currentSource.embedUrl}
                  title={video.title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0 absolute inset-0"
                />
              )}
            </div>

            {/* Footer details */}
            <div className="p-4 sm:p-5 bg-[#111317] space-y-3">
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                {video.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800/60">
                {video.tools && video.tools.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-light text-neutral-500 mr-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#d85d3a]" /> Pipeline:
                    </span>
                    {video.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-light bg-neutral-800/80 text-neutral-300 border border-neutral-700/60"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 ml-auto">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-light">
                    Format: <span className="text-[#d85d3a]">{currentSource.type.toUpperCase()}</span>
                  </span>
                  <a
                    href={currentSource.directUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-light text-neutral-400 hover:text-[#d85d3a] transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Direct Player</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

