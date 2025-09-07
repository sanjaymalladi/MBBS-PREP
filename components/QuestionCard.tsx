import React, { useState, useRef } from 'react';
import type { MCQ, ShortQuestion, AnalysisState } from '../types';
import { Spinner } from './Spinner';
import FeedbackDisplay from './FeedbackDisplay';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

type QuestionType = 'mcq' | 'essay' | 'short' | 'reasoning';

interface QuestionCardProps {
  question: MCQ | ShortQuestion;
  type: QuestionType;
  onAnalyzeAnswer: (questionId: string, questionText: string, imageBase64: string) => void;
  analysisState?: AnalysisState;
  subject?: string;
  topic?: string;
}

const MCQOptions: React.FC<{
  mcq: MCQ,
  onSelect: (isCorrect: boolean) => void,
  subject?: string,
  topic?: string
}> = ({ mcq, onSelect, subject, topic }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const saveMCQAttempt = useMutation(api.errorLogs.saveMCQAttempt);

  const handleSelect = async (optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (selected) return; // Prevent changing answer
    setSelected(optionKey);
    const correct = optionKey === mcq.correctOption;
    setIsCorrect(correct);
    onSelect(correct);

    // Save to error log if subject and topic are provided
    if (subject && topic) {
      try {
        await saveMCQAttempt({
          mcqId: mcq.id,
          question: mcq.question,
          options: mcq.options,
          correctOption: mcq.correctOption,
          explanation: mcq.explanation,
          userAnswer: optionKey,
          isCorrect: correct,
          subject,
          topic,
        });
      } catch (error) {
        console.error('Failed to save MCQ attempt:', error);
      }
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {Object.entries(mcq.options).map(([key, value]) => {
        const optionKey = key as 'A' | 'B' | 'C' | 'D';
        const isSelected = selected === optionKey;
        const isTheCorrectAnswer = mcq.correctOption === optionKey;

        let baseStyle = "dark:text-slate-200";
        let bgColor = "bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600";
        if (isSelected) {
          bgColor = isCorrect ? "bg-green-100 dark:bg-green-900/50 border-green-500" : "bg-red-100 dark:bg-red-900/50 border-red-500";
        } else if (selected && isTheCorrectAnswer) {
          bgColor = "bg-green-100 dark:bg-green-900/50 border-green-500";
        }

        return (
          <button
            key={key}
            onClick={() => handleSelect(optionKey)}
            disabled={!!selected}
            className={`w-full text-left p-3 border dark:border-slate-600 rounded-lg transition ${bgColor} ${!selected ? 'cursor-pointer' : 'cursor-default'} ${baseStyle}`}
          >
            <span className="font-semibold mr-2">{key}.</span>{value}
          </button>
        );
      })}
      {selected !== null && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="dark:text-slate-200"><span className="font-bold">Explanation:</span> {mcq.explanation}</p>
        </div>
      )}
    </div>
  );
};

const AnswerUploader: React.FC<{ onUpload: (base64: string) => void }> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-teal-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-600 transition"
      >
        Upload Handwritten Answer
      </button>
       <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Practice writing your answer by hand, take a photo, and upload it for AI-powered feedback.</p>
    </div>
  );
};


const QuestionCard: React.FC<QuestionCardProps> = ({ question, type, onAnalyzeAnswer, analysisState, subject, topic }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const { id, question: questionText } = question;

  const handleUpload = (base64: string) => {
      const justBase64 = base64.split(',')[1];
      onAnalyzeAnswer(id, questionText, justBase64);
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-shadow hover:shadow-lg">
      <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{questionText}</p>

      {type === 'mcq' && <MCQOptions mcq={question as MCQ} onSelect={() => {}} subject={subject} topic={topic} />}

      {type !== 'mcq' && type !== 'essay' && (
        <>
            <AnswerUploader onUpload={handleUpload} />
            {analysisState?.isLoading && (
              <div className="flex items-center mt-4 text-slate-600 dark:text-slate-300">
                  <Spinner />
                  <span className="ml-2">Analyzing your answer...</span>
              </div>
            )}
            {analysisState?.error && <p className="mt-4 text-red-500">{analysisState.error}</p>}
            {analysisState?.feedback && <FeedbackDisplay feedback={analysisState.feedback} />}
        </>
      )}

      {type === 'essay' && (
         <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">This question is for offline practice to improve your long-form answer writing. No answer upload or model answer is provided for this format.</p>
      )}

    </div>
  );
};

export default QuestionCard;