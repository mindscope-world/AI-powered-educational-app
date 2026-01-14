
import { Course, Comment } from './types';

export const MOCK_COURSES: Course[] = [
  {
    id: 'masterclass-web-design',
    title: 'Masterclass: Designing for web',
    instructor: {
      name: 'Natalie Storm',
      role: 'Design Department',
      avatar: 'https://picsum.photos/seed/natalie/200',
      bio: 'Natalie is a freelance designer who occasionally dabbles with graphic design, motion and development.'
    },
    chapters: [
      { id: '1', title: 'What is Interaction Design', duration: '12:45', isCompleted: true, isLocked: false, content: 'Intro to UX patterns.' },
      { id: '2', title: 'Motion in UI Design', duration: '15:20', isCompleted: true, isLocked: false, content: 'Principles of animation.' },
      { id: '3', title: 'Fundamentals of Web Design', duration: '22:10', isCompleted: false, isLocked: false, content: 'Deep dive into grids and typography.' },
      { id: '4', title: 'Improving Visual Skills', duration: '18:05', isCompleted: false, isLocked: true, content: 'Visual exercises.' },
      { id: '5', title: 'Finding inspiration', duration: '10:30', isCompleted: false, isLocked: true, content: 'Curating your feed.' },
    ]
  },
  {
    id: 'intro-to-ai',
    title: 'Generative AI for Creatives',
    instructor: {
      name: 'Alex Chen',
      role: 'AI Research',
      avatar: 'https://picsum.photos/seed/alex/200',
      bio: 'Alex explores the intersection of machine learning and digital art.'
    },
    chapters: [
      { id: '1', title: 'Intro to LLMs', duration: '10:00', isCompleted: false, isLocked: false, content: 'Understanding large language models.' },
      { id: '2', title: 'Prompt Engineering', duration: '25:00', isCompleted: false, isLocked: false, content: 'Mastering the art of prompting.' },
    ]
  },
  {
    id: 'branding-101',
    title: 'Modern Brand Identity',
    instructor: {
      name: 'Sarah Jenkins',
      role: 'Creative Director',
      avatar: 'https://picsum.photos/seed/sarah/200',
      bio: 'Sarah has built identities for top silicon valley startups.'
    },
    chapters: [
      { id: '1', title: 'The Power of Logos', duration: '15:00', isCompleted: false, isLocked: false, content: 'Why logos matter.' },
    ]
  }
];

export const MOCK_COURSE = MOCK_COURSES[0];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: 'Robin Sherbatsky',
    avatar: 'https://picsum.photos/seed/robin/100',
    timestamp: '2 hours ago',
    content: "Cool stuff tutor! I'm wondering where I can find the list of recommended resources..",
    replies: []
  },
  {
    id: 'c2',
    author: 'Jason Statham',
    role: 'Motion in UI • 2:35',
    avatar: 'https://picsum.photos/seed/jason/100',
    timestamp: '5 hours ago',
    content: '',
    voiceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    replies: [
      {
        id: 'c3',
        author: 'Natalie Rider',
        avatar: 'https://picsum.photos/seed/rider/100',
        timestamp: '1 hour ago',
        content: 'Yeah sure, I have made a pdf with all the links to the resources which she has provided is of outstanding quality',
      }
    ]
  }
];
