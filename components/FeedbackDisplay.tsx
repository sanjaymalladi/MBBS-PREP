import React from 'react';
import type { Feedback } from '../types';

interface FeedbackDisplayProps {
  feedback: Feedback;
}

const FeedbackSection: React.FC<{ title: string; color: 'green' | 'red' | 'blue' | 'yellow'; children: React.ReactNode }> = ({ title, color, children }) => {
  const colors = {
    green: 'border-green-500 bg-green-50 dark:bg-green-900/30',
    red: 'border-red-500 bg-red-50 dark:bg-red-900/30',
    blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/30',
    yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30',
  };

  return (
    <div className={`mt-4 p-4 border-l-4 rounded-r-lg ${colors[color]}`}>
      <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h4>
      {children}
    </div>
  );
};

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Feedback Analysis</h3>
        {typeof feedback.scorePercent === 'number' && (
          <div className="ml-4 px-3 py-1 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 text-sm font-semibold">
            Score: {Math.round(feedback.scorePercent)}%
          </div>
        )}
      </div>
      
      <FeedbackSection title="Key Concepts Covered (Strengths)" color="green">
        <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
          {feedback.keyConceptsCovered.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </FeedbackSection>

      <FeedbackSection title="Areas for Improvement (Gaps Identified)" color="red">
        <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
          {feedback.areasForImprovement.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </FeedbackSection>
      
      <FeedbackSection title="Clarity & Structure" color="blue">
        <p className="text-slate-700 dark:text-slate-300">{feedback.clarityAndStructureScore}</p>
      </FeedbackSection>
      
      <FeedbackSection title="Suggestions" color="yellow">
        <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
            {feedback.suggestions.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </FeedbackSection>
    </div>
  );
};

export default FeedbackDisplay;