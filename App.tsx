import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SessionGenerator from './components/SessionGenerator';
import PracticeSession from './components/PracticeSession';
import ErrorLog from './components/ErrorLog';
import ErrorBoundary from './components/ErrorBoundary';
import { Spinner } from './components/Spinner';
import { generateSession, analyzeAnswer } from './services/geminiService';
import type { PracticeSession as PracticeSessionType, Subject, Feedback, AnalysisState } from './types';

const App: React.FC = () => {
  const [practiceSession, setPracticeSession] = useState<PracticeSessionType | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisStates, setAnalysisStates] = useState<Record<string, AnalysisState>>({});
  const [showErrorLog, setShowErrorLog] = useState<boolean>(false);

  const handleGenerateSession = useCallback(async (subject: Subject, topic: string) => {
    setIsGenerating(true);
    setError(null);
    setPracticeSession(null);
    setAnalysisStates({});
    setShowErrorLog(false);
    try {
      const session = await generateSession(subject, topic);
      setPracticeSession(session);
    } catch (err) {
      console.error(err);
      setError('Failed to generate practice session. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleAnalyzeAnswer = useCallback(async (questionId: string, questionText: string, imageBase64: string) => {
    setAnalysisStates(prev => ({
      ...prev,
      [questionId]: { isLoading: true, feedback: null, error: null }
    }));
    try {
      const feedback = await analyzeAnswer(questionText, imageBase64);
      setAnalysisStates(prev => ({
        ...prev,
        [questionId]: { isLoading: false, feedback, error: null }
      }));
    } catch (err) {
      console.error(err);
      setAnalysisStates(prev => ({
        ...prev,
        [questionId]: { isLoading: false, feedback: null, error: 'Failed to analyze answer.' }
      }));
    }
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-gray-900 min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Header
        onShowErrorLog={() => setShowErrorLog(!showErrorLog)}
        showErrorLog={showErrorLog}
      />
      <main className="container mx-auto p-4 md:p-8">
        {!showErrorLog && (
          <>
            <SessionGenerator onGenerate={handleGenerateSession} disabled={isGenerating} />
            {isGenerating && (
              <div className="flex flex-col items-center justify-center mt-12">
                <Spinner />
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Generating your practice session... this may take a moment.</p>
              </div>
            )}
            {error && <p className="text-center text-red-500 mt-8">{error}</p>}
            {practiceSession && !isGenerating && (
              <PracticeSession
                session={practiceSession}
                onAnalyzeAnswer={handleAnalyzeAnswer}
                analysisStates={analysisStates}
              />
            )}
          </>
        )}

        {showErrorLog && (
          <ErrorBoundary>
            <ErrorLog />
          </ErrorBoundary>
        )}
      </main>
    </div>
  );
};

export default App;