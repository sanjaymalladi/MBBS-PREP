import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

const StatCard: React.FC<{ title: string; value: string | number; subtitle?: string }> = ({ title, value, subtitle }) => (
  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
    <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
    <div className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</div>
    {subtitle && <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>}
  </div>
);

const Pill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-700 px-3 py-1 text-xs text-slate-700 dark:text-slate-200">
    <span className="font-medium">{label}</span>
    <span className="opacity-80">{value}</span>
  </span>
);

const Dashboard: React.FC = () => {
  const stats = useQuery(api.errorLogs.getErrorLogStats, {});

  if (stats === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-slate-600 dark:text-slate-300">Loading dashboard...</span>
      </div>
    );
  }

  if (stats === null) {
    return <div className="text-center py-12 text-slate-500 dark:text-slate-400">No data yet. Start practicing to see your progress!</div>;
  }

  const subjectRows = Object.entries(stats.subjectStats || {}).map(([subject, data]) => ({
    subject,
    total: data.total,
    accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
      {/* Bento Row 1: Big KPIs */}
      <div className="md:col-span-2">
        <StatCard title="Total Attempts" value={stats.totalAttempts} />
      </div>
      <div className="md:col-span-2">
        <StatCard title="Correct" value={stats.correctAttempts} subtitle={`${Math.round((stats.correctAttempts / Math.max(1, stats.totalAttempts)) * 100)}%`} />
      </div>
      <div className="md:col-span-2">
        <StatCard title="Accuracy" value={`${stats.accuracy}%`} subtitle={`${stats.incorrectAttempts} incorrect`} />
      </div>

      {/* Bento Row 2: Strong / Weak Topics */}
      <div className="md:col-span-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Strong Topics</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Top by accuracy (min 3 attempts)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(stats.strongTopics || []).map((t: any, idx: number) => (
            <Pill key={idx} label={`${t.subject} • ${t.topic}`} value={`${Math.round(t.accuracy)}% (${t.total})`} />
          ))}
          {(!stats.strongTopics || stats.strongTopics.length === 0) && (
            <div className="text-sm text-slate-500 dark:text-slate-400">Not enough data yet.</div>
          )}
        </div>
      </div>

      <div className="md:col-span-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Weak Topics</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Lowest by accuracy (min 3 attempts)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(stats.weakTopics || []).map((t: any, idx: number) => (
            <Pill key={idx} label={`${t.subject} • ${t.topic}`} value={`${Math.round(t.accuracy)}% (${t.total})`} />
          ))}
          {(!stats.weakTopics || stats.weakTopics.length === 0) && (
            <div className="text-sm text-slate-500 dark:text-slate-400">Not enough data yet.</div>
          )}
        </div>
      </div>

      {/* Bento Row 3: Subject Overview */}
      <div className="md:col-span-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Subjects Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {subjectRows.map((row) => (
            <div key={row.subject} className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">{row.subject}</div>
              <div className="mt-1 text-xl font-bold text-slate-800 dark:text-slate-100">{row.accuracy}%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{row.total} attempts</div>
            </div>
          ))}
          {subjectRows.length === 0 && <div className="text-sm text-slate-500 dark:text-slate-400">No attempts yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


