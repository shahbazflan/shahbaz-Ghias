import React from 'react';
import { motion } from 'motion/react';
import { Play, ArrowUpRight } from 'lucide-react';
import { VideoItem } from '../types';
import { ScrambleText } from './ScrambleText';

interface VideoCardProps {
  video: VideoItem;
  onClick: () => void;
  index?: number;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{
        scale: 1.028,
        y: -4,
        transition: {
          type: 'spring',
          stiffness: 420,
          damping: 24,
          mass: 0.6,
        },
      }}
      whileTap={{
        scale: 0.98,
        transition: {
          type: 'spring',
          stiffness: 500,
          damping: 28,
        },
      }}
      transition={{ duration: 0.45, delay: index !== undefined ? (index % 6) * 0.05 : 0 }}
      onClick={onClick}
      className="group cursor-pointer rounded-xl overflow-hidden bg-neutral-900/60 border border-neutral-800 hover:border-[#d85d3a]/70 hover:shadow-2xl hover:shadow-[#d85d3a]/15 transition-[border-color,box-shadow] duration-300 flex flex-col justify-between will-change-transform"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <img
          src={video.thumbnail}
          alt={video.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#d85d3a]/90 group-hover:bg-[#d85d3a] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        </div>
        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-black/75 backdrop-blur-md text-[#d85d3a] border border-[#d85d3a]/30">
          {video.category}
        </span>
        {video.year && (
          <span className="absolute top-3 right-3 font-mono text-[10px] text-neutral-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-neutral-800">
            {video.year}
          </span>
        )}
      </div>

      <div className="p-5 space-y-2 bg-[#090a0c]/90 border-t border-neutral-800/80">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-syne text-base font-bold text-white group-hover:text-[#d85d3a] transition-colors truncate">
            <ScrambleText text={video.title} hoverOnly />
          </h3>
          <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-[#d85d3a] transition-colors flex-shrink-0" />
        </div>
        {video.role && (
          <p className="font-mono text-[11px] text-neutral-400">
            {video.role}
          </p>
        )}
        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
          {video.description}
        </p>
      </div>
    </motion.div>
  );
};
