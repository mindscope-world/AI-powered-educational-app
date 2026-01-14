
import React from 'react';

interface Props {
  title: string;
  subtitle: string;
  chapterIndex: number;
  totalChapters: number;
}

const CourseHeader: React.FC<Props> = ({ title, subtitle, chapterIndex, totalChapters }) => {
  return (
    <div className="mb-8">
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <span className="hover:text-indigo-500 cursor-pointer">Courses</span>
        <span>/</span>
        <span className="hover:text-indigo-500 cursor-pointer">Design</span>
        <span>/</span>
        <span className="text-slate-900 font-medium">Masterclass: Designing for web</span>
      </nav>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
          <p className="text-slate-400 font-medium">{subtitle}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-sm font-bold text-slate-300 tracking-widest uppercase">
            Chapter {chapterIndex}/{totalChapters}
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-full border border-slate-200 text-slate-400 hover:bg-white hover:text-indigo-500 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
