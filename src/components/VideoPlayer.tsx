import React, { useState } from 'react';
import { audioService } from '../audioService';

interface VideoPlayerProps {
  content: string;
  title: string;
  language?: string;
  level?: string;
  audioModel?: 'browser' | 'elevenlabs';
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  content,
  title,
  language = 'English',
  level = 'Intermediate',
  audioModel = 'browser'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      audioService.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      try {
        await audioService.speak(content, {
          language,
          model: audioModel as 'browser' | 'elevenlabs'
        });
        setIsPlaying(false);
        setProgress(100);
      } catch (error) {
        console.error("Speech playback error:", error);
        setIsPlaying(false);
      }
    }
  };

  const handleStop = () => {
    audioService.stop();
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="relative w-full rounded-[2.5rem] overflow-hidden group bg-slate-900 border border-slate-800 shadow-2xl">
      {/* Visual Placeholder (Could be the Avatar in Premium) */}
      <div className="aspect-[21/9] flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-900 overflow-hidden relative">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.2),transparent_70%)]" />
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent" />
        </div>

        <div className="text-center z-10 p-10">
          <h3 className="text-indigo-400 font-black text-[10px] uppercase tracking-[4px] mb-3">Zinara Audio Lesson</h3>
          <h2 className="text-white text-3xl font-bold mb-4 tracking-tight line-clamp-2 max-w-2xl">{title}</h2>
          <div className="flex justify-center gap-3">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-wider">{language}</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-wider">{level}</span>
          </div>
        </div>

        {/* Animated Sound Waves (Visible when playing) */}
        {isPlaying && (
          <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-1.5 opacity-60">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-indigo-500 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 40 + 10}px`,
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: '0.5s'
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-black/5 flex items-center justify-center transition-all group-hover:bg-black/20">
        <button
          onClick={handleTogglePlay}
          className="w-24 h-24 bg-indigo-600/90 text-white rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/20 hover:scale-110 active:scale-95 transition-all outline-none"
        >
          {isPlaying ? (
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          ) : (
            <svg className="w-10 h-10 ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
      </div>

      {/* Playback Controls Bar */}
      <div className="p-8 bg-slate-900 border-t border-slate-800 flex items-center gap-8">
        <div className="flex items-center gap-5">
          <button className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" /></svg>
          </button>
          <button onClick={handleTogglePlay} className="p-3 bg-indigo-500/10 rounded-full text-indigo-400 hover:bg-indigo-500/20 transition-all outline-none">
            {isPlaying ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
          </button>
          <button className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zm7.934 0a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" /></svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-[2px]">
            <span>0:00</span>
            <span className="text-indigo-400">Audio Ready</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full w-full overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-slate-500 hover:text-white transition-colors text-xs font-black tracking-widest">1.0x</button>
          <button className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;