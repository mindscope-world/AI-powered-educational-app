
import React, { useState } from 'react';
import { MOCK_COURSE, MOCK_COMMENTS } from '../constants';
import { Comment } from '../types';

const DiscussionItem: React.FC<{ comment: Comment; isReply?: boolean }> = ({ comment, isReply }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={`flex gap-3 ${isReply ? 'mt-4 ml-6 pl-4 border-l-2 border-slate-100' : 'mt-6'}`}>
      <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <div className="flex justify-between items-baseline mb-1">
          <h4 className="text-sm font-bold text-slate-800">{comment.author}</h4>
          {comment.timestamp && <span className="text-[10px] text-slate-400 uppercase font-bold">{comment.timestamp}</span>}
        </div>
        {comment.role && <p className="text-[10px] text-emerald-500 font-bold uppercase mb-1">{comment.role}</p>}
        
        {comment.voiceUrl ? (
          <div className="bg-indigo-50/50 p-2 rounded-xl flex items-center gap-3 mt-1">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 hover:bg-indigo-700"
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <div className="flex-1 h-1.5 bg-indigo-100 rounded-full relative overflow-hidden">
               <div className={`h-full bg-indigo-500 transition-all ${isPlaying ? 'w-2/3' : 'w-1/4'}`} />
            </div>
            <span className="text-[10px] font-bold text-indigo-400">1:39</span>
          </div>
        ) : (
          <p className="text-sm text-slate-600 leading-relaxed">{comment.content}</p>
        )}

        <div className="mt-2 flex items-center gap-4">
          <button className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 flex items-center gap-1 uppercase">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5" strokeWidth={2}/></svg>
            Reply
          </button>
          {comment.replies && comment.replies.length > 0 && (
            <button className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 uppercase">
              Show {comment.replies.length} replies
            </button>
          )}
        </div>

        {comment.replies?.map(reply => (
          <DiscussionItem key={reply.id} comment={reply} isReply />
        ))}
      </div>
    </div>
  );
};

const CurriculumSidebar: React.FC = () => {
  return (
    <div className="w-[380px] h-screen bg-white border-l border-slate-200 fixed right-0 top-0 overflow-y-auto custom-scrollbar p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Masterclass: Designing for web</h2>
      
      <div className="mb-8">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">2/5 Completed</span>
          <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        </div>
        <div className="h-1 bg-slate-100 rounded-full w-full">
          <div className="h-full bg-emerald-400 rounded-full w-[40%]" />
        </div>
      </div>

      <div className="space-y-4 mb-10">
        {MOCK_COURSE.chapters.map((lesson, idx) => (
          <div 
            key={lesson.id} 
            className={`group flex items-center gap-4 cursor-pointer p-1 rounded-xl transition-all ${lesson.id === '3' ? 'text-emerald-500' : 'text-slate-400'}`}
          >
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
              lesson.isCompleted ? 'bg-emerald-50 border-emerald-500 text-emerald-500' : 
              lesson.id === '3' ? 'border-emerald-500 bg-emerald-50' :
              'border-slate-100 text-slate-300'
            }`}>
              {lesson.isCompleted ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              ) : idx + 1}
            </div>
            <span className="flex-1 text-sm font-semibold">{lesson.title}</span>
            {lesson.isLocked ? (
              <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/></svg>
            ) : (
              <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/></svg>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 pt-8">
        <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Discussion</h3>
        <div className="space-y-6">
          {MOCK_COMMENTS.map(comment => (
            <DiscussionItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurriculumSidebar;
