
import React from 'react';
import { MOCK_COURSES } from '../constants';
import { Course } from '../types';

interface DashboardProps {
  onSelectCourse: (course: Course) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectCourse }) => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-8">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Hello, Alex! 👋</h1>
          <p className="text-slate-500 font-medium">Ready to continue your learning journey today?</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for courses..." 
            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </header>

      <section className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider text-xs">Continue Watching</h2>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_COURSES.slice(0, 1).map(course => (
            <div 
              key={course.id} 
              onClick={() => onSelectCourse(course)}
              className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-100">
                <img src={`https://picsum.photos/seed/${course.id}/600/400`} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
                    <svg className="w-6 h-6 text-white ml-0.5 fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-full tracking-wider">In Progress</span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase">22:10 Left</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                <p className="text-xs text-slate-400 font-medium mb-6">by {course.instructor.name}</p>
                
                <div className="mt-auto">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Lesson 3/5</span>
                    <span className="text-[10px] font-bold text-indigo-500">40%</span>
                  </div>
                  <div className="h-1.5 bg-slate-50 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-[40%]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider text-xs">Recommended for you</h2>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">Explore</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_COURSES.map(course => (
            <div 
              key={`rec-${course.id}`} 
              onClick={() => onSelectCourse(course)}
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-50 relative">
                 <img src={`https://picsum.photos/seed/rec-${course.id}/400/400`} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-xl text-slate-900 shadow-sm">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                 </div>
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{course.title}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">{course.instructor.name}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span className="text-[10px] font-bold text-slate-600">4.9</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase">12 Lessons</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
