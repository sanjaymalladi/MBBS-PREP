
export enum Subject {
  Anatomy = "Anatomy",
  Physiology = "Physiology",
  Biochemistry = "Biochemistry",
}

export interface MCQ {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface ShortQuestion {
  id: string;
  question: string;
  marks: number;
}

export interface PracticeSession {
  subject: string;
  topic: string;
  longEssayQuestion: ShortQuestion;
  multipleChoiceQuestions: MCQ[];
  shortAnswerQuestions: ShortQuestion[];
  reasoningQuestions: ShortQuestion[];
}

export interface Feedback {
  keyConceptsCovered: string[];
  areasForImprovement: string[];
  clarityAndStructureScore: string;
  suggestions: string[];
}

export interface AnalysisState {
  isLoading: boolean;
  feedback: Feedback | null;
  error: string | null;
}
