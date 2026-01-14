
export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  content: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  chapters: Lesson[];
}

export interface Comment {
  id: string;
  author: string;
  role?: string;
  avatar: string;
  timestamp: string;
  content: string;
  voiceUrl?: string;
  replies?: Comment[];
}
