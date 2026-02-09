
import React from 'react';

const SettingsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-10">Settings</h1>

      <div className="space-y-12">
        <section>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Profile Settings</h3>
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex items-center gap-8">
            <div className="relative group">
              <img src="https://picsum.photos/seed/user/200" className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-inner" />
              <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth={2}/></svg>
              </button>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Full Name</label>
                <input type="text" defaultValue="Alex Johnson" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Email Address</label>
                <input type="email" defaultValue="alex@zinara.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Preferences</h3>
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-6 border-b border-slate-50">
              <div>
                <h4 className="font-bold text-slate-900">Email Notifications</h4>
                <p className="text-xs text-slate-500">Receive weekly digests and course updates.</p>
              </div>
              <div className="w-12 h-6 bg-indigo-600 rounded-full p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full ml-auto" />
              </div>
            </div>
            <div className="flex justify-between items-center pb-6 border-b border-slate-50">
              <div>
                <h4 className="font-bold text-slate-900">Dark Mode</h4>
                <p className="text-xs text-slate-500">Enable an eye-friendly dark interface.</p>
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded-full p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-900">Instructor Mode</h4>
                <p className="text-xs text-slate-500">Toggle between student and teacher view.</p>
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded-full p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button className="px-8 py-3 text-sm font-bold text-slate-400 hover:text-slate-600">Cancel</button>
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
