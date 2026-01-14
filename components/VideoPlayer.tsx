
import React from 'react';

const VideoPlayer: React.FC = () => {
  return (
    <div className="relative group rounded-3xl overflow-hidden bg-slate-100 aspect-video shadow-sm">
      <img
        src="https://picsum.photos/1200/800?grayscale&seed=learn"
        alt="Video Placeholder"
        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/20 transition-all cursor-pointer">
        <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-white ml-1 fill-white" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4">
        <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-indigo-500 rounded-full" />
        </div>
        <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded">22:10</span>
      </div>
    </div>
  );
};

export default VideoPlayer;
