import React, { useEffect, useState } from 'react';
import { getDrillResults } from '../../services/drillService';
import { Award, Users, CheckCircle, Clock, PieChart } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DrillStats = () => {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    totalDrills: 0,
    avgScore: 0,
    topDrill: 'N/A',
    categoryAggregates: {}
  });

  useEffect(() => {
    // Use the callback version for real-time updates
    const unsubscribe = getDrillResults((data) => {
      setResults(data);

      if (data.length > 0) {
        const total = data.length;
        const avg = data.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0) / total;
        
        // Find most popular drill
        const drillCounts = {};
        const catAggs = {};

        data.forEach(r => {
          drillCounts[r.drillTitle] = (drillCounts[r.drillTitle] || 0) + 1;
          
          // Aggregate Category Scores
          if (r.categoryScores) {
            Object.entries(r.categoryScores).forEach(([cat, score]) => {
              catAggs[cat] = (catAggs[cat] || 0) + score;
            });
          }
        });

        const topDrill = Object.keys(drillCounts).length > 0 
          ? Object.keys(drillCounts).reduce((a, b) => drillCounts[a] > drillCounts[b] ? a : b)
          : 'N/A';

        setStats({
          totalDrills: total,
          avgScore: Math.round(avg),
          topDrill,
          categoryAggregates: catAggs
        });
      } else {
        setStats({
           totalDrills: 0,
           avgScore: 0,
           topDrill: 'N/A',
           categoryAggregates: {}
        });
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const chartData = {
    labels: Object.keys(stats.categoryAggregates),
    datasets: [
      {
        data: Object.values(stats.categoryAggregates),
        backgroundColor: [
          '#3b82f6', // Blue
          '#10b981', // Green
          '#8b5cf6', // Purple
          '#f59e0b', // Orange
        ],
        borderColor: '#1e293b',
        borderWidth: 2,
      },
    ],
  };

  const formatTime = (seconds) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">Total Drills</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalDrills}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Award className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">Avg. Pass Rate</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.avgScore}%</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">Top Drill</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white truncate">{stats.topDrill}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">Avg Time</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {stats.totalDrills > 0 
              ? formatTime(Math.round(results.reduce((acc, r) => acc + (r.timeTaken || 0), 0) / stats.totalDrills)) 
              : '-'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Community Preparedness Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col transition-colors">
          <h3 className="text-slate-900 dark:text-white font-bold mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-500" />
            Community Preparedness
          </h3>
          <div className="flex-1 relative flex items-center justify-center">
            {Object.keys(stats.categoryAggregates).length > 0 ? (
              <Doughnut data={chartData} options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8', padding: 20 }
                  }
                }
              }} />
            ) : (
              <div className="text-slate-500 text-center">No data available</div>
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden transition-colors">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-slate-900 dark:text-white font-bold">Recent Activity Log</h3>
          </div>
          <div className="overflow-y-auto flex-1 p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-xs font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">User</th>
                  <th className="p-3 text-xs font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">Drill Type</th>
                  <th className="p-3 text-xs font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">Score</th>
                  <th className="p-3 text-xs font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">Time</th>
                  <th className="p-3 text-xs font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-3 text-sm text-slate-900 dark:text-white font-medium">{result.userName}</td>
                    <td className="p-3 text-sm text-slate-600 dark:text-slate-300">{result.drillTitle}</td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        (result.score / result.totalQuestions) >= 0.8 ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 
                        (result.score / result.totalQuestions) >= 0.5 ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' : 
                        'bg-red-500/20 text-red-600 dark:text-red-400'
                      }`}>
                        {result.score}/{result.totalQuestions}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-400 font-mono">
                      {formatTime(result.timeTaken)}
                    </td>
                    <td className="p-3 text-sm text-slate-500 dark:text-slate-400 font-mono">
                      {new Date(result.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      No drill data available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
