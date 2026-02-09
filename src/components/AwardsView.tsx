
import React from 'react';

const AwardsView: React.FC = () => {
  const achievements = [
    { title: 'Quick Learner', desc: 'Completed 5 lessons in one day', icon: '⚡', color: 'bg-amber-100 text-amber-600', unlocked: true },
    { title: 'Top Contributor', desc: '10+ helpful replies in discussions', icon: '💬', color: 'bg-indigo-100 text-indigo-600', unlocked: true },
    { title: 'Designer Pro', desc: 'Finished Web Design Masterclass', icon: '🎨', color: 'bg-emerald-100 text-emerald-600', unlocked: false },
    { title: 'Early Bird', desc: 'Join a live session before 9 AM', icon: '🌅', color: 'bg-orange-100 text-orange-600', unlocked: true },
    { title: 'Streak Master', desc: 'Login for 7 consecutive days', icon: '🔥', color: 'bg-rose-100 text-rose-600', unlocked: false },
    { title: 'Resource Hunter', desc: 'Downloaded 20+ PDFs', icon: '📁', color: 'bg-blue-100 text-blue-600', unlocked: true },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Achievements</h1>
          <p className="text-slate-500">Track your progress and unlock exclusive rewards.</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-indigo-600">2,450</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total XP Earned</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((item, idx) => (
          <div key={idx} className={`p-8 rounded-[2rem] border transition-all ${item.unlocked ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50/50 border-dashed border-slate-200 opacity-60'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 ${item.color}`}>
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
            <p className="text-sm text-slate-500 mb-6">{item.desc}</p>
            {item.unlocked ? (
              <div className="flex items-center gap-2 text-emerald-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">Unlocked</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth={2}/></svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">Locked</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 bg-indigo-600 rounded-[2.5rem] p-12 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl shadow-indigo-200">
        <div>
          <h2 className="text-3xl font-bold mb-4">Complete your next module!</h2>
          <p className="text-indigo-100 opacity-80 max-w-md">You're just 200 XP away from unlocking the "Mastermind" badge and a 15% discount on the next course.</p>
        </div>
        <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-colors">Continue Learning</button>
      </div>
    </div>
  );
};

export default AwardsView;
