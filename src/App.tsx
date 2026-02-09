
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
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const currentLesson = selectedCourse.chapters[activeChapterIndex] || selectedCourse.chapters[0];

  // Add this state to track if the Gemini API is available
  const [isGeminiAvailable, setIsGeminiAvailable] = useState(true);

  // Update the useEffect hook
  useEffect(() => {
    if (view === 'course') {
      const fetchSummary = async () => {
        setIsLoadingSummary(true);
        try {
          const content = await getLessonSummary(currentLesson.title, currentLesson.content);
          if (content) {
            setSummary(content);
          } else {
            setSummary(`Welcome back to Zinara. This chapter covers: ${currentLesson.content}`);
            setIsGeminiAvailable(false);
          }
        } catch (error) {
          console.error('Error fetching lesson summary:', error);
          setSummary(`Welcome back to Zinara. This chapter covers: ${currentLesson.content}`);
          setIsGeminiAvailable(false);
        } finally {
          setIsLoadingSummary(false);
        }
      };
      fetchSummary();
    }
  }, [currentLesson, view]);

  // useEffect(() => {
  //   if (view === 'course') {
  //     const fetchSummary = async () => {
  //       setIsLoadingSummary(true);
  //       const content = await getLessonSummary(currentLesson.title, currentLesson.content);
  //       if (content) {
  //         setSummary(content);
  //       } else {
  //         setSummary("Welcome back to Zinara. This chapter covers the foundational principles of the masterclass. We'll dive deep into core concepts, practical applications, and industry secrets as shared by your instructor.");
  //       }
  //       setIsLoadingSummary(false);
  //     };
  //     fetchSummary();
  //   }
  // }, [currentLesson, view]);

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
          // In App.tsx, update the course view section
          <div className="flex w-full">
            <div className="flex-1">
              <div className="max-w-6xl mx-auto px-10 py-8">
                {/* Course Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{selectedCourse.title}</h1>
                    <p className="text-slate-400 font-medium text-sm mt-1">{selectedCourse.instructor.name}, {selectedCourse.instructor.role}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Chapter {activeChapterIndex + 1}/{selectedCourse.chapters.length}</span>
                    <div className="flex gap-2">
                      <button
                        disabled={activeChapterIndex === 0}
                        onClick={() => setActiveChapterIndex(prev => prev - 1)}
                        className={`p-2 rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button
                        disabled={activeChapterIndex === selectedCourse.chapters.length - 1}
                        onClick={() => setActiveChapterIndex(prev => prev + 1)}
                        className={`p-2 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video Player Section */}
                <div className="mb-8">
                  <VideoPlayer
                    content={summary || currentLesson.content}
                    title={currentLesson.title}
                    language={selectedCourse.language}
                    level={selectedCourse.learnerLevel}
                    audioModel={selectedCourse.audioModel}
                  />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2">
                    {/* Tabs */}
                    <div className="border-b border-slate-100 mb-8">
                      <div className="flex space-x-10">
                        {['Notes', 'Resources', 'Quiz (3)'].map((tab) => (
                          <button
                            key={tab}
                            className={`pb-4 text-sm font-bold relative ${tab === 'Notes' ? 'text-indigo-600' : 'text-slate-400'}`}
                          >
                            {tab}
                            {tab === 'Notes' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-500 leading-relaxed">
                      Hi there! I'm Natalie Storm, and today we're mastering the backbone of beautiful web design: grids and typography. We'll explore...
                    </p>
                  </div>

                  {/* About Instructor Card */}
                  <div className="lg:col-span-1">
                    <div className="bg-[#f8fafc] rounded-2xl p-6">
                      <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[2px] mb-5">About Instructor</h3>
                      <div className="flex gap-4">
                        <img src="https://i.pravatar.cc/150?u=natalie" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Natalie Storm</h4>
                          <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mb-2">Design Department</p>
                          <p className="text-xs text-slate-400 leading-normal">Natalie is a freelance designer specializing in UI/UX and brand identity.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
    <div className="min-h-screen bg-white">
      <div className="flex">
        <Sidebar
          activeView={view}
          onViewChange={setView}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />

        <div className={`flex-1 transition-all duration-300 ${isExpanded ? 'ml-64' : 'ml-20'
          }`}>
          {view === 'course' ? (
            <div className="flex">
              <div className="flex-1">
                {renderContent()}
              </div>
              <div className="hidden xl:block w-80 flex-shrink-0 border-l border-slate-200 overflow-y-auto h-screen sticky top-0">
                <div className="p-6">
                  <CurriculumSidebar />
                </div>
              </div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
