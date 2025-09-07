import React from 'react';
import type { PracticeSession as PracticeSessionType, AnalysisState } from '../types';
import QuestionCard from './QuestionCard';

interface PracticeSessionProps {
  session: PracticeSessionType;
  onAnalyzeAnswer: (questionId: string, questionText: string, imageBase64: string) => void;
  analysisStates: Record<string, AnalysisState>;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-12">
    <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200 border-b-2 border-blue-200 dark:border-slate-700 pb-2 mb-6">{title}</h3>
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

const PracticeSession: React.FC<PracticeSessionProps> = ({ session, onAnalyzeAnswer, analysisStates }) => {
  return (
    <div className="mt-10">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{session.subject}</h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 mt-1">{session.topic}</p>
      </header>

      <Section title="Long Essay Question (10 Marks)">
        <QuestionCard 
          question={session.longEssayQuestion} 
          type="essay" 
          onAnalyzeAnswer={onAnalyzeAnswer}
          analysisState={analysisStates[session.longEssayQuestion.id]}
        />
      </Section>

      <Section title="Multiple Choice Questions (20 x 1 Mark)">
        {session.multipleChoiceQuestions.map(mcq => (
          <QuestionCard
            key={mcq.id}
            question={mcq}
            type="mcq"
            onAnalyzeAnswer={onAnalyzeAnswer}
            analysisState={analysisStates[mcq.id]}
            subject={session.subject}
            topic={session.topic}
          />
        ))}
      </Section>

      <Section title="Short Notes / Applied Questions (11 x 5 Marks)">
        {session.shortAnswerQuestions.map(q => (
          <QuestionCard 
            key={q.id} 
            question={q} 
            type="short"
            onAnalyzeAnswer={onAnalyzeAnswer}
            analysisState={analysisStates[q.id]}
          />
        ))}
      </Section>

       <Section title="Reasoning Questions (5 x 3 Marks)">
        {session.reasoningQuestions.map(q => (
          <QuestionCard 
            key={q.id} 
            question={q} 
            type="reasoning"
            onAnalyzeAnswer={onAnalyzeAnswer}
            analysisState={analysisStates[q.id]}
          />
        ))}
      </Section>
    </div>
  );
};

export default PracticeSession;