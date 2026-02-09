
import React from 'react';

const CalendarView: React.FC = () => {
  const schedule = [
    { time: '09:00 AM', title: 'UX Design Workshop', type: 'Live Class', color: 'bg-indigo-500' },
    { time: '11:30 AM', title: 'Mentorship Session', type: '1-on-1', color: 'bg-emerald-500' },
    { time: '02:00 PM', title: 'Design Critique', type: 'Group', color: 'bg-amber-500' },
    { time: '04:30 PM', title: 'Brand Identity Recap', type: 'Webinar', color: 'bg-indigo-400' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Schedule</h1>
      <p className="text-slate-500 mb-10">Stay on top of your live sessions and deadlines.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-slate-900">May 2024</h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-50 rounded-lg"><svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={2}/></svg></button>
                <button className="p-2 hover:bg-slate-50 rounded-lg"><svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={2}/></svg></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-4 mb-4 text-center">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                <span key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-4 text-center">
              {Array.from({ length: 31 }).map((_, i) => (
                <div key={i} className={`p-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${i === 14 ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Timeline</h3>
          {schedule.map((item, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${item.color} mt-1.5`} />
                {idx !== schedule.length - 1 && <div className="w-0.5 h-full bg-slate-100 my-1" />}
              </div>
              <div className="pb-8">
                <p className="text-[10px] font-bold text-slate-400 mb-1">{item.time}</p>
                <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                <span className="text-[10px] font-bold text-indigo-500 uppercase">{item.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
