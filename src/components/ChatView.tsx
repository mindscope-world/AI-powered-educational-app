
import React from 'react';

const ChatView: React.FC = () => {
  const contacts = [
    { name: 'Natalie Storm', avatar: 'https://picsum.photos/seed/natalie/100', lastMsg: 'I checked your portfolio, looks great!', time: '12m', unread: 2 },
    { name: 'Robin Sherbatsky', avatar: 'https://picsum.photos/seed/robin/100', lastMsg: 'Thanks for the resource links.', time: '2h', unread: 0 },
    { name: 'Design Group', avatar: 'https://picsum.photos/seed/group/100', lastMsg: 'Who is going to the Figma meetup?', time: '5h', unread: 0 },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Messages</h2>
          <div className="relative">
            <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-xs focus:outline-none" />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {contacts.map((contact, idx) => (
            <div key={idx} className={`flex gap-3 p-6 hover:bg-slate-50 cursor-pointer transition-colors ${contact.unread ? 'bg-indigo-50/30' : ''}`}>
              <img src={contact.avatar} className="w-10 h-10 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{contact.name}</h4>
                  <span className="text-[10px] text-slate-400">{contact.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{contact.lastMsg}</p>
              </div>
              {contact.unread > 0 && <div className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">{contact.unread}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-slate-50 flex flex-col">
        <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={contacts[0].avatar} className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="font-bold text-slate-900">Natalie Storm</h3>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth={2}/></svg></button>
            <button className="p-2 text-slate-400 hover:text-indigo-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" strokeWidth={2}/></svg></button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto space-y-6 custom-scrollbar">
          <div className="flex justify-center"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Today</span></div>
          <div className="flex gap-3 max-w-lg">
            <img src={contacts[0].avatar} className="w-8 h-8 rounded-full mt-auto" />
            <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-100">
              <p className="text-sm text-slate-600">Hey Alex! How is the web design module going for you? Any roadblocks?</p>
            </div>
          </div>
          <div className="flex gap-3 max-w-lg ml-auto">
            <div className="bg-indigo-600 p-4 rounded-2xl rounded-br-none shadow-lg shadow-indigo-100">
              <p className="text-sm text-white">Hey Natalie! It is going great. I'm just struggling a bit with visual hierarchy in mobile layouts.</p>
            </div>
            <img src="https://picsum.photos/seed/user/100" className="w-8 h-8 rounded-full mt-auto" />
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-200">
          <div className="flex gap-4 items-center bg-slate-50 p-2 rounded-2xl border border-slate-100">
             <button className="p-2 text-slate-400 hover:text-indigo-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" strokeWidth={2}/></svg></button>
             <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent text-sm focus:outline-none" />
             <button className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2}/></svg>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
