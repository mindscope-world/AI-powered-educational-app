import { GoogleGenAI, Type } from "@google/genai";

// Check if API key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. Some features may not work as expected.');
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getLessonSummary = async (lessonTitle: string, context: string, language: string = 'English', level: string = 'Intermediate') => {
  if (!ai) {
    console.warn('Gemini API is not configured. Using fallback content.');
    return `Welcome to "${lessonTitle}". ${context}`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a concise, engaging professional lesson summary for a course titled "${lessonTitle}". 
      The content context is: "${context}". 
      Target Language: ${language}.
      Target Learner Level: ${level}.
      Write it in a friendly tone as if you were the instructor, Natalie Storm. 
      Keep it under 100 words.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Welcome to "${lessonTitle}". ${context}`;
  }
};

// Similar update for getLessonQuiz
export const getLessonQuiz = async (lessonTitle: string) => {
  if (!ai) {
    console.warn('Gemini API is not configured. Using fallback quiz data.');
    return [
      {
        question: `What is the main topic of "${lessonTitle}"?`,
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswer: 0
      }
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create 3 multiple choice quiz questions for the lesson: "${lessonTitle}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER, description: 'index of the correct option' }
            },
            required: ["question", "options", "correctAnswer"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      {
        question: `What is the main topic of "${lessonTitle}"?`,
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswer: 0
      }
    ];
  }
};