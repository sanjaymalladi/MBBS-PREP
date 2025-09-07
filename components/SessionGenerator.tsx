import React, { useState, useMemo } from 'react';
import { Subject } from '../types';
import { TOPICS } from '../constants';

interface SessionGeneratorProps {
  onGenerate: (subject: Subject, topic: string) => void;
  disabled: boolean;
}

const SessionGenerator: React.FC<SessionGeneratorProps> = ({ onGenerate, disabled }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.Anatomy);
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPICS[Subject.Anatomy][0]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubject = e.target.value as Subject;
    setSelectedSubject(newSubject);
    setSelectedTopic(TOPICS[newSubject][0]);
  };
  
  const topicsForSelectedSubject = useMemo(() => TOPICS[selectedSubject], [selectedSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTopic) {
      onGenerate(selectedSubject, selectedTopic);
    }
  };

  return (
    <section className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Create a New Practice Session</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Subject</label>
          <select
            id="subject"
            value={selectedSubject}
            onChange={handleSubjectChange}
            disabled={disabled}
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          >
            {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Topic</label>
          <select
            id="topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            disabled={disabled}
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          >
            {topicsForSelectedSubject.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button
          type="submit"
          disabled={disabled}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {disabled ? 'Generating...' : 'Generate Session'}
        </button>
      </form>
    </section>
  );
};

export default SessionGenerator;