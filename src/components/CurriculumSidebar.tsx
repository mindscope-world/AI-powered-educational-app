// src/components/CurriculumSidebar.tsx
import React from 'react';

const CurriculumSidebar: React.FC = () => {
  return (
    <div className="px-2">
      <h2 className="text-xl font-extrabold text-slate-800 mb-6">Masterclass: Designing for web</h2>
      
      <div className="mb-8">
        <div className="flex justify-between items-center text-[10px] font-black mb-2">
          <span className="text-emerald-500">2/5 COMPLETED</span>
          <span className="text-emerald-500">★</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full">
          <div className="h-full bg-emerald-400 rounded-full w-[40%]" />
        </div>
      </div>

      <div className="space-y-2 mb-12">
        {/* Example of Current Lesson (#3) */}
        <div className="flex items-center gap-4 p-3 border-2 border-transparent">
           <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500 text-[10px] font-bold">3</div>
           <span className="text-sm font-bold text-emerald-500">Fundamentals of Web Design</span>
           <svg className="ml-auto w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
        </div>
        {/* Locked items would use a lock icon and text-slate-300 */}
      </div>

      <div className="pt-8 border-t border-slate-100">
        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[2px] mb-6">Discussion</h3>
        <div className="space-y-8">
          {/* Robin's Comment */}
          <div className="group">
            <div className="flex gap-3 mb-2">
              <img src="https://i.pravatar.cc/150?u=robin" className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h5 className="text-xs font-bold text-slate-800">Robin Sherbatsky</h5>
                  <span className="text-[9px] font-bold text-slate-300 uppercase">2 hours ago</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Cool stuff tutor! I'm wondering where I can find the list of recommended resources...</p>
                <button className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Reply</button>
              </div>
            </div>
          </div>
          
          {/* Jason's Audio Comment */}
          <div className="flex gap-3">
            <img src="https://i.pravatar.cc/150?u=jason" className="w-8 h-8 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-xs font-bold text-slate-800">Jason Statham</h5>
                <span className="text-[9px] font-bold text-slate-300 uppercase">5 hours ago</span>
              </div>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Motion in UI • 2:35</p>
              <div className="bg-indigo-50 rounded-full py-2 px-4 flex items-center gap-3">
                <button className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                   <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </button>
                <div className="flex-1 h-1 bg-indigo-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-1/3" />
                </div>
                <span className="text-[9px] font-bold text-indigo-400">1:39</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CurriculumSidebar;