import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useUser } from '@clerk/clerk-react';
import type { Subject } from '../types';

interface ErrorLogEntry {
  _id: string;
  mcqId: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  userAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  subject: string;
  topic: string;
  timestamp: number;
}

const ErrorLog: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const [filterSubject, setFilterSubject] = useState<string>('');
  const [filterCorrectness, setFilterCorrectness] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Only query if user is signed in
  const errorLogs = useQuery(api.errorLogs.getErrorLogs, 
    isSignedIn ? { limit: 100 } : "skip"
  );

  const stats = useQuery(api.errorLogs.getErrorLogStats, 
    isSignedIn ? {} : "skip"
  );
  const clearLogs = useMutation(api.errorLogs.clearErrorLogs);

  // Simplified filtering for now
  const filteredLogs = useMemo(() => {
    if (!errorLogs) return [];

    let logs = [...errorLogs];

    // Apply client-side filtering
    if (filterCorrectness !== 'all') {
      const isCorrectFilter = filterCorrectness === 'correct';
      logs = logs.filter(log => log.isCorrect === isCorrectFilter);
    }

    if (filterSubject) {
      logs = logs.filter(log => log.subject === filterSubject);
    }

    return logs;
  }, [errorLogs, filterCorrectness, filterSubject]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleClearLogs = async () => {
    if (window.confirm('Are you sure you want to clear all error logs? This action cannot be undone.')) {
      try {
        await clearLogs();
      } catch (error) {
        console.error('Failed to clear error logs:', error);
        alert('Failed to clear error logs. Please try again.');
      }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOptionStyle = (optionKey: string, userAnswer: string, correctAnswer: string) => {
    if (optionKey === correctAnswer) {
      return 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200';
    }
    if (optionKey === userAnswer && optionKey !== correctAnswer) {
      return 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200';
    }
    return 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600';
  };

  // Handle authentication state
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-blue-500 text-lg mb-2">Please sign in</div>
          <div className="text-slate-600 dark:text-slate-300">
            You need to be signed in to view your error logs.
          </div>
        </div>
      </div>
    );
  }

  // Handle loading states
  if (errorLogs === undefined || stats === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-slate-600 dark:text-slate-300">Loading error logs...</span>
      </div>
    );
  }

  // Handle error states
  if (errorLogs === null || stats === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Failed to load error logs</div>
          <div className="text-slate-600 dark:text-slate-300">
            There was an error loading your error logs. Please try refreshing the page.
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">Error Log</h2>
        <p className="text-slate-600 dark:text-slate-300">Review your MCQ attempts and track your progress</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalAttempts}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Total Attempts</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.correctAttempts}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Correct Answers</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.incorrectAttempts}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Incorrect Answers</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.accuracy}%</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Accuracy Rate</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Subject
            </label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value="">All Subjects</option>
              <option value="Anatomy">Anatomy</option>
              <option value="Physiology">Physiology</option>
              <option value="Biochemistry">Biochemistry</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={filterCorrectness}
              onChange={(e) => setFilterCorrectness(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Answers</option>
              <option value="correct">Correct Only</option>
              <option value="incorrect">Incorrect Only</option>
            </select>
          </div>

          <div className="ml-auto">
            <button
              onClick={handleClearLogs}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors"
              disabled={stats.totalAttempts === 0}
            >
              Clear All Logs
            </button>
          </div>
        </div>
      </div>

      {/* Error Log Items */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-500 dark:text-slate-400 text-lg">
              {stats.totalAttempts === 0 ? 'No error logs yet. Start practicing!' : 'No logs match your filters.'}
            </div>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log._id}
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.isCorrect
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                    }`}>
                      {log.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {log.subject} • {log.topic}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium mb-4">
                    {log.question}
                  </p>
                </div>
                <button
                  onClick={() => toggleExpanded(log._id)}
                  className="ml-4 p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {expandedItems.has(log._id) ? '▼' : '▶'}
                </button>
              </div>

              {expandedItems.has(log._id) && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {Object.entries(log.options).map(([key, value]) => (
                      <div
                        key={key}
                        className={`p-3 border rounded-md ${getOptionStyle(key, log.userAnswer, log.correctOption)}`}
                      >
                        <span className="font-semibold mr-2">{key}.</span>
                        {value}
                        {key === log.userAnswer && key !== log.correctOption && (
                          <span className="ml-2 text-xs">(Your answer)</span>
                        )}
                        {key === log.correctOption && (
                          <span className="ml-2 text-xs">(Correct answer)</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Explanation</h4>
                    <p className="text-slate-700 dark:text-slate-300">{log.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ErrorLog;
