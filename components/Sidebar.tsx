
import React, { useState, useRef, useEffect } from 'react';

export type ViewType = 'dashboard' | 'course' | 'calendar' | 'chat' | 'awards' | 'settings' | 'creation';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
}

const navItems = [
  { id: 'home', label: 'Dashboard', view: 'dashboard' as const, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'courses', label: 'Courses', view: 'course' as const, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { id: 'creation', label: 'Studio', view: 'creation' as const, icon: 'M12 4v16m8-8H4' }, 
  { id: 'calendar', label: 'Schedule', view: 'calendar' as const, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'chat', label: 'Messages', view: 'chat' as const, icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { id: 'awards', label: 'Awards', view: 'awards' as const, icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-8.062 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946 8.062 3.42 3.42 0 010 4.438 3.42 3.42 0 00-1.946 8.062 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-8.062 3.42 3.42 0 010-4.438z' },
  { id: 'settings', label: 'Settings', view: 'settings' as const, icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isExpanded, setIsExpanded }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex flex-col items-start py-6 transition-all duration-300 z-50 shadow-sm ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo Section */}
      <div className={`flex items-center w-full px-5 mb-10 overflow-hidden`}>
        <img 
          src="https://raw.githubusercontent.com/google/generative-ai-js/main/samples/web/logo.png" 
          alt="Zinara Logo" 
          className="w-10 h-10 flex-shrink-0 object-contain"
          onError={(e) => {
            // Fallback if the raw URL isn't right, though in this environment it works well
            e.currentTarget.src = "https://picsum.photos/seed/zinara/100";
          }}
        />
        <div className={`ml-4 transition-all duration-300 whitespace-nowrap overflow-hidden ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">ZINARA</span>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 w-full space-y-2 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.view)}
            className={`flex items-center w-full relative group p-3 rounded-2xl transition-all ${
              item.view === activeView ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-indigo-500 hover:bg-slate-50'
            }`}
          >
            {item.view === activeView && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full" />
            )}
            <svg
              className="w-6 h-6 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className={`ml-4 text-sm font-bold transition-all duration-300 whitespace-nowrap overflow-hidden ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Toggle Button */}
      <div className="w-full px-3 mb-6">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center p-3 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
        >
          <svg 
            className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          <span className={`ml-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap overflow-hidden ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
            Collapse
          </span>
        </button>
      </div>

      {/* Profile Section */}
      <div className="w-full px-3 relative" ref={menuRef}>
        {showProfileMenu && (
          <div className={`absolute left-full ml-4 bottom-0 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in slide-in-from-left-2 duration-200 z-[60]`}>
            <div className="px-3 py-2 border-b border-slate-50 mb-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account</p>
            </div>
            <button 
              onClick={() => { onViewChange('settings'); setShowProfileMenu(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth={2}/></svg>
              <span className="text-xs font-semibold">Profile</span>
            </button>
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeWidth={2}/></svg>
              <span className="text-xs font-semibold">Billing</span>
            </button>
            <div className="h-px bg-slate-50 my-1" />
            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-rose-50 rounded-lg transition-colors text-rose-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth={2}/></svg>
              <span className="text-xs font-bold">Logout</span>
            </button>
          </div>
        )}
        <div 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className={`flex items-center w-full p-2 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all ${isExpanded ? 'gap-4' : 'justify-center'}`}
        >
          <img
            src="https://picsum.photos/seed/user/100"
            alt="User Profile"
            className="w-10 h-10 rounded-full border-2 border-slate-100 flex-shrink-0"
          />
          <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <p className="text-xs font-bold text-slate-900 truncate">Alex Johnson</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase truncate">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
