import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { audioService } from '../audioService';

interface StudioConfig {
  resolution: '720p' | '1080p';
  aspectRatio: '16:9' | '9:16';
  visualStyle: 'Cinematic' | 'Minimalist' | 'Hyper-realistic' | 'Studio 3D' | 'Hand-drawn';
  guidanceLevel: 'Low' | 'Medium' | 'High';
  language: string;
  learnerLevel: 'Beginner' | 'Intermediate' | 'Professional';
  audioModel: 'browser' | 'elevenlabs';
}

const CreationView: React.FC = () => {
  const [content, setContent] = useState('');
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [visualReference, setVisualReference] = useState<string | null>(null);
  const [visualType, setVisualType] = useState<'image' | 'video' | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [config, setConfig] = useState<StudioConfig>({
    resolution: '720p',
    aspectRatio: '16:9',
    visualStyle: 'Cinematic',
    guidanceLevel: 'Medium',
    language: 'English',
    learnerLevel: 'Intermediate',
    audioModel: 'browser'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const visualInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfName(file.name);
      setStatusMessage(`Ready with ${file.name}`);
    }
  };

  const handleVisualReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      setVisualType(type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVisualReference(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;
    setIsDownloading(true);
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zinara-studio-export-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback
      window.open(videoUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("Please provide some educational content or a prompt.");
      return;
    }

    setIsGenerating(true);
    setVideoUrl(null);
    setStatusMessage("Authenticating...");

    try {
      const aiStudio = (window as any).aistudio;
      const hasKey = await aiStudio.hasSelectedApiKey();
      if (!hasKey) {
        await aiStudio.openSelectKey();
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      setStatusMessage("Synthesizing script...");

      const stylePrompt = `Style: ${config.visualStyle}. Guidance: ${config.guidanceLevel}. Language: ${config.language}. Learner Level: ${config.learnerLevel}.`;
      const prompt = `Educational video based on: ${content}. ${pdfName ? `Context from ${pdfName}.` : ''} ${stylePrompt} 
      High quality, cinematic educational visualization, professional masterclass style. 
      The visual metaphors should be adapted for a ${config.learnerLevel} level learner. 
      Important: Any on-screen text or narration hints should be in ${config.language}.`;

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: (visualReference && visualType === 'image') ? {
          imageBytes: (visualReference as string).split(',')[1],
          mimeType: (visualReference as string).split(';')[0].split(':')[1]
        } : undefined,
        config: {
          numberOfVideos: 1,
          resolution: config.resolution,
          aspectRatio: config.aspectRatio
        }
      });

      const messages = ["Directing visual metaphors...", "Rendering cinematic frames...", "Applying studio lighting...", "Finalizing export..."];
      let msgIdx = 0;

      while (!operation.done) {
        setStatusMessage(messages[msgIdx % messages.length]);
        msgIdx++;
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setVideoUrl(`${downloadLink}&key=${process.env.API_KEY}`);
        setStatusMessage("Creation complete.");
      }
    } catch (error: any) {
      console.error(error);
      setStatusMessage("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAudioGeneration = async () => {
    if (!content.trim()) {
      alert("Please provide some educational content.");
      return;
    }

    if (isAudioPlaying) {
      audioService.stop();
      if (visualType === 'video' && previewVideoRef.current) {
        previewVideoRef.current.pause();
      }
      setIsAudioPlaying(false);
      setStatusMessage("Audio stopped.");
      return;
    }

    try {
      if (visualType === 'video' && previewVideoRef.current) {
        previewVideoRef.current.currentTime = 0;
        previewVideoRef.current.play();
      }
      setIsAudioPlaying(true);
      setStatusMessage("Synthesizing audio lesson...");
      await audioService.speak(content, {
        language: config.language,
        model: config.audioModel
      });
      setStatusMessage("Audio lesson complete.");
    } catch (error) {
      console.error("Audio generation failed:", error);
      setStatusMessage("Audio synthesis failed.");
    } finally {
      setIsAudioPlaying(false);
      if (visualType === 'video' && previewVideoRef.current) {
        previewVideoRef.current.pause();
      }
    }
  };

  const toggleFullscreen = () => {
    if (!fullscreenContainerRef.current) return;

    if (!document.fullscreenElement) {
      fullscreenContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#fcfdfe] relative">
      {/* Studio Settings Slide-over */}
      {showSettings && (
        <>
          <div
            className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm z-40 animate-in fade-in duration-300"
            onClick={() => setShowSettings(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-500 flex flex-col border-l border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Studio Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <section>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Rendering Quality</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['720p', '1080p'] as const).map(res => (
                    <button
                      key={res}
                      onClick={() => setConfig({ ...config, resolution: res })}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${config.resolution === res ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'
                        }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['16:9', '9:16'] as const).map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => setConfig({ ...config, aspectRatio: ratio })}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${config.aspectRatio === ratio ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'
                        }`}
                    >
                      {ratio === '16:9' ? 'Landscape (16:9)' : 'Portrait (9:16)'}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Visual Art Style</label>
                <div className="space-y-2">
                  {(['Cinematic', 'Minimalist', 'Hyper-realistic', 'Studio 3D', 'Hand-drawn'] as const).map(style => (
                    <button
                      key={style}
                      onClick={() => setConfig({ ...config, visualStyle: style })}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${config.visualStyle === style ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                        }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">AI Creativity Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Low', 'Medium', 'High'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setConfig({ ...config, guidanceLevel: level })}
                      className={`px-2 py-2 rounded-xl text-[10px] font-bold transition-all border ${config.guidanceLevel === level ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Target Language</label>
                <select
                  value={config.language}
                  onChange={(e) => setConfig({ ...config, language: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-xs font-bold bg-white border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-600 appearance-none"
                >
                  {['English', 'Spanish', 'French', 'German', 'Swahili', 'Mandarin', 'Arabic', 'Hindi'].map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </section>

              <section>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Learner Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Professional'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setConfig({ ...config, learnerLevel: level })}
                      className={`px-1 py-2 rounded-xl text-[10px] font-bold transition-all border ${config.learnerLevel === level ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-slate-500 border-slate-100'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Audio Generation Engine</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['browser', 'elevenlabs'] as const).map(model => (
                    <button
                      key={model}
                      onClick={() => setConfig({ ...config, audioModel: model })}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${config.audioModel === model ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'
                        }`}
                    >
                      {model === 'browser' ? 'Browser (Free)' : 'ElevenLabs (Premium)'}
                    </button>
                  ))}
                </div>
                {config.audioModel === 'elevenlabs' && (
                  <p className="text-[9px] text-slate-400 mt-2 italic px-1">Uses high-quality multilingual neural voices.</p>
                )}
              </section>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-3 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
              >
                Save & Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* Header - Compact */}
      <header className="px-8 py-4 flex justify-between items-center border-b border-slate-100 bg-white">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Zinara <span className="text-indigo-600">Studio</span></h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI Video Curriculum Architect</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">Drafts</button>
          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeWidth={2} /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth={2} /></svg>
            Studio Settings
          </button>
        </div>
      </header>

      {/* Main Content Area - Layout to fit screen */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Side: Inputs */}
        <div className="w-[450px] flex flex-col border-r border-slate-100 bg-white/50 overflow-y-auto custom-scrollbar p-6 gap-6">

          {/* Section 1: Knowledge Input */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Knowledge Input</h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-bold text-indigo-600 hover:underline uppercase flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={2.5} /></svg>
                {pdfName ? 'Update PDF' : 'Add PDF Source'}
              </button>
              <input type="file" ref={fileInputRef} onChange={handlePdfUpload} accept=".pdf" className="hidden" />
            </div>

            <div className="relative group flex flex-col gap-2">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                {pdfName && (
                  <div className="mb-3 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold flex items-center justify-between">
                    <span className="truncate max-w-[200px]">{pdfName}</span>
                    <button onClick={() => setPdfName(null)} className="hover:text-rose-500">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                )}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste script, lesson concepts or course syllabus here..."
                  className="w-full h-40 bg-transparent text-sm text-slate-600 resize-none focus:outline-none placeholder:text-slate-300 custom-scrollbar"
                />
              </div>
              <p className="text-[10px] text-slate-300 font-medium italic text-right px-1">AI will synthesize visual metaphors based on this text.</p>
            </div>
          </div>

          {/* Section 2: Visual Guidance */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Visual Direction</h3>
            <div
              onClick={() => visualInputRef.current?.click()}
              className="group relative h-32 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all overflow-hidden"
            >
              {visualReference ? (
                <>
                  {visualType === 'video' ? (
                    <video src={visualReference} className="w-full h-full object-cover opacity-80" muted />
                  ) : (
                    <img src={visualReference} className="w-full h-full object-cover opacity-80" alt="Reference" />
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold uppercase">Change Visual</span>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2} /></svg>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Style Reference</span>
                </div>
              )}
              <input type="file" ref={visualInputRef} onChange={handleVisualReferenceUpload} accept="image/*,video/*" className="hidden" />
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-auto pt-6 border-t border-slate-100">
            <button
              disabled={isGenerating}
              onClick={handleSubmit}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all relative overflow-hidden ${isGenerating ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200'
                }`}
            >
              {isGenerating && <div className="absolute left-0 top-0 h-full bg-indigo-600/10 animate-[pulse_2s_infinite]" style={{ width: '100%' }} />}
              {isGenerating ? (
                <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2} /></svg>
              )}
              {isGenerating ? 'Architecting...' : 'Build Video Asset'}
            </button>

            <button
              onClick={handleAudioGeneration}
              className={`w-full mt-3 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all border-2 ${isAudioPlaying
                ? 'border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100'
                : 'border-indigo-100 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-50 shadow-sm'
                }`}
            >
              {isAudioPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" strokeWidth={2} /></svg>
              )}
              {isAudioPlaying ? 'Stop Audio' : 'Generate Audio Lesson'}
            </button>

            {statusMessage && <p className="mt-3 text-center text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{statusMessage}</p>}
          </div>
        </div>

        {/* Right Side: Output Preview */}
        <div className="flex-1 bg-slate-50 flex flex-col p-10 justify-center items-center relative">
          <div className="w-full max-w-4xl flex flex-col gap-6">
            <div className="flex justify-between items-baseline px-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Studio Preview</h2>
              {isAudioPlaying && <span className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Audio Lesson Demo</span>}
            </div>

            <div
              ref={fullscreenContainerRef}
              className={`aspect-video bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200 relative overflow-hidden group transition-all duration-500 ${config.aspectRatio === '9:16' ? 'max-h-[70vh] aspect-[9/16] mx-auto' : ''} ${isFullscreen ? 'w-screen h-screen rounded-none z-[100]' : ''}`}
            >
              {visualReference ? (
                <div className="w-full h-full relative">
                  {visualType === 'video' ? (
                    <video
                      ref={previewVideoRef}
                      src={visualReference}
                      className="w-full h-full object-cover"
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img src={visualReference} className="w-full h-full object-cover" alt="Visual Reference" />
                  )}

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                      onClick={handleAudioGeneration}
                      className="w-16 h-16 bg-white/90 text-indigo-600 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                    >
                      {isAudioPlaying ? (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                      ) : (
                        <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      )}
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="absolute bottom-6 right-6 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
                      title={isFullscreen ? "Exit Fullscreen" : "Maximize"}
                    >
                      {isFullscreen ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 9L4 4m0 0l5 0m-5 0l0 5m11 0l5-5m0 0l-5 0m5 0l0 5m-5 11l5 5m0 0l-5 0m5 0l0-5m-11 0l-5 5m0 0l5 0m-5 0l0-5" strokeWidth={2} /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" strokeWidth={2} /></svg>
                      )}
                    </button>
                  </div>

                  {/* Visual Feedback Overlays */}
                  {isAudioPlaying && (
                    <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-1.5 opacity-60">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-white rounded-full animate-[pulse_0.4s_infinite]"
                          style={{
                            height: `${Math.random() * 30 + 10}px`,
                            animationDelay: `${i * 0.05}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : videoUrl ? (
                <>
                  <video key={videoUrl} controls autoPlay className="w-full h-full object-cover">
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                  <button
                    onClick={handleDownload}
                    className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
                    title="Quick Download"
                  >
                    {isDownloading ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2.5} /></svg>
                    )}
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                  {isGenerating ? (
                    <div className="space-y-6 flex flex-col items-center">
                      <div className="w-16 h-16 relative">
                        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">Generating Curriculum Visuals</h4>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto mt-2">Our AI is processing your knowledge base into cinematic educational content using the {config.visualStyle} style.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center mb-6 text-slate-200">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" strokeWidth={2} /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} /></svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 mb-2">Awaiting Architect Input</h3>
                      <p className="text-xs text-slate-400 max-w-sm">Provide content on the left and upload a visual reference to preview your masterclass assets. ({config.resolution}, {config.visualStyle} style)</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Action Bar - Only visible when video is present */}
            {videoUrl && (
              <div className="flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <button
                  disabled={isDownloading}
                  onClick={handleDownload}
                  className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                >
                  {isDownloading ? (
                    <svg className="animate-spin h-4 w-4 text-slate-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2} /></svg>
                  )}
                  {isDownloading ? 'Preparing MP4...' : 'Export MP4'}
                </button>
                <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth={2} /></svg>
                  Publish to Curriculum
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreationView;