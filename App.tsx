
import React, { useState, useEffect } from 'react';
import Sidebar, { ViewType } from './components/Sidebar';
import CourseHeader from './components/CourseHeader';
import VideoPlayer from './components/VideoPlayer';
import CurriculumSidebar from './components/CurriculumSidebar';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import ChatView from './components/ChatView';
import AwardsView from './components/AwardsView';
import SettingsView from './components/SettingsView';
import CreationView from './components/CreationView';
import { MOCK_COURSES } from './constants';
import { Course } from './types';
import { getLessonSummary } from './geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course>(MOCK_COURSES[0]);
  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'quiz'>('notes');
  const [summary, setSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const currentLesson = selectedCourse.chapters[2] || selectedCourse.chapters[0];

  useEffect(() => {
    if (view === 'course') {
      const fetchSummary = async () => {
        setIsLoadingSummary(true);
        const content = await getLessonSummary(currentLesson.title, currentLesson.content);
        if (content) {
          setSummary(content);
        } else {
          setSummary("Welcome back to Zinara. This chapter covers the foundational principles of the masterclass. We'll dive deep into core concepts, practical applications, and industry secrets as shared by your instructor.");
        }
        setIsLoadingSummary(false);
      };
      fetchSummary();
    }
  }, [currentLesson, view]);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setView('course');
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard onSelectCourse={handleSelectCourse} />;
      case 'course':
        return (
          <div className="flex">
            <main className="flex-1 mr-[380px] p-12 max-w-6xl mx-auto">
              <CourseHeader 
                title={currentLesson.title} 
                subtitle={`${selectedCourse.instructor.name}, ${selectedCourse.instructor.role}`} 
                chapterIndex={3}
                totalChapters={selectedCourse.chapters.length}
              />

              <div className="mb-10">
                <VideoPlayer />
              </div>

              <div className="flex gap-12 items-start">
                <div className="flex-1">
                  <div className="flex gap-8 border-b border-slate-200 mb-8">
                    {['Notes', 'Resources', 'Quiz (3)'].map((tab) => {
                      const tabKey = tab.toLowerCase().split(' ')[0] as 'notes' | 'resources' | 'quiz';
                      const isActive = activeTab === tabKey;
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tabKey)}
                          className={`pb-4 text-sm font-bold transition-all relative ${
                            isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {tab}
                          {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="prose prose-slate max-w-none">
                    {isLoadingSummary ? (
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      </div>
                    ) : (
                      <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {summary}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-80">
                  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">About Instructor</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={selectedCourse.instructor.avatar} 
                        alt={selectedCourse.instructor.name} 
                        className="w-10 h-10 rounded-full object-cover" 
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{selectedCourse.instructor.name}</h4>
                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">{selectedCourse.instructor.role}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      {selectedCourse.instructor.bio}
                    </p>
                  </div>
                </div>
              </div>
            </main>
            <CurriculumSidebar />
          </div>
        );
      case 'calendar':
        return <CalendarView />;
      case 'chat':
        return <ChatView />;
      case 'awards':
        return <AwardsView />;
      case 'settings':
        return <SettingsView />;
      case 'creation':
        return <CreationView />;
      default:
        return <Dashboard onSelectCourse={handleSelectCourse} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      <Sidebar 
        activeView={view} 
        onViewChange={setView} 
        isExpanded={isExpanded} 
        setIsExpanded={setIsExpanded} 
      />
      <div 
        className={`flex-1 transition-all duration-300 ${
          isExpanded ? 'ml-64' : 'ml-20'
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
