import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Command, X } from 'lucide-react';

interface KeyboardNavHUDProps {
  currentSectionLabel?: string;
  activeKey: 'up' | 'down' | 'left' | 'right' | null;
  onNavigateSection: (direction: 'up' | 'down') => void;
  onNavigateView: (direction: 'prev' | 'next') => void;
}

export const KeyboardNavHUD: React.FC<KeyboardNavHUDProps> = ({
  currentSectionLabel,
  activeKey,
  onNavigateSection,
  onNavigateView,
}) => {
  const [isMinimized, setIsMinimized] = React.useState(false);

  return (
    <aside
      aria-label="Keyboard Navigation Controls"
      className="fixed bottom-5 right-5 z-40 select-none pointer-events-auto"
    >
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.button
            key="minimized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-[#d85d3a]/60 text-neutral-400 hover:text-white text-[11px] font-mono shadow-2xl backdrop-blur-md transition-all duration-200"
            title="Show keyboard navigation guide"
          >
            <Command className="w-3 h-3 text-[#d85d3a]" />
            <span>KEYS</span>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`p-2.5 rounded-2xl bg-neutral-950/90 border backdrop-blur-md shadow-2xl transition-all duration-300 ${
              activeKey
                ? 'border-[#d85d3a]/70 shadow-[#d85d3a]/15 ring-1 ring-[#d85d3a]/30'
                : 'border-neutral-800/80 hover:border-neutral-700'
            }`}
          >
            {/* Header / Active feedback */}
            <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-neutral-800/80 text-[10px] font-mono">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d85d3a] animate-pulse" />
                <span className="text-neutral-300 font-medium">KEYBOARD NAV</span>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 -mr-1 rounded hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-colors"
                title="Minimize keyboard helper"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Quick Status / Announcement */}
            {currentSectionLabel && (
              <div className="pb-2 mb-2 border-b border-neutral-800/60 text-[10px] font-mono text-neutral-300 truncate max-w-[200px]">
                <span className="text-[#d85d3a]">ACTIVE:</span> {currentSectionLabel}
              </div>
            )}

            {/* Keys grid */}
            <div className="flex items-center gap-3">
              {/* Vertical Scroll Section Navigation */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onNavigateSection('up')}
                  className={`p-1.5 rounded-lg border text-xs font-mono transition-all duration-200 ${
                    activeKey === 'up'
                      ? 'bg-[#d85d3a] border-[#d85d3a] text-white scale-95 shadow-md shadow-[#d85d3a]/30'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white'
                  }`}
                  title="Scroll to previous section (Up Arrow)"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onNavigateSection('down')}
                  className={`p-1.5 rounded-lg border text-xs font-mono transition-all duration-200 ${
                    activeKey === 'down'
                      ? 'bg-[#d85d3a] border-[#d85d3a] text-white scale-95 shadow-md shadow-[#d85d3a]/30'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white'
                  }`}
                  title="Scroll to next section (Down Arrow)"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <span className="text-[10px] font-mono text-neutral-400 pl-1">SECTIONS</span>
              </div>

              <div className="w-[1px] h-4 bg-neutral-800" />

              {/* Lateral View Navigation */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onNavigateView('prev')}
                  className={`p-1.5 rounded-lg border text-xs font-mono transition-all duration-200 ${
                    activeKey === 'left'
                      ? 'bg-[#d85d3a] border-[#d85d3a] text-white scale-95 shadow-md shadow-[#d85d3a]/30'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white'
                  }`}
                  title="Switch to previous view (Left Arrow)"
                >
                  <ArrowLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onNavigateView('next')}
                  className={`p-1.5 rounded-lg border text-xs font-mono transition-all duration-200 ${
                    activeKey === 'right'
                      ? 'bg-[#d85d3a] border-[#d85d3a] text-white scale-95 shadow-md shadow-[#d85d3a]/30'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white'
                  }`}
                  title="Switch to next view (Right Arrow)"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
                <span className="text-[10px] font-mono text-neutral-400 pl-1">VIEWS</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
