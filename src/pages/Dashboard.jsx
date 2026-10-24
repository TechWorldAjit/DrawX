import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  CheckCircle2,
  SkipForward,
  Layers,
  Sparkles,
  Percent,
  Play,
  RotateCcw,
  Calendar,
  Clock,
  ArrowRight,
  PlusCircle,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function Dashboard({ setCurrentView }) {
  const { user, isAuthenticated, openAuth } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    loadDashboard();
  }, [isAuthenticated]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getDashboardStats();
      setStats(res.stats);
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <Activity className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Outfit'] mb-3">
          Your Personal Drawing Studio
        </h1>
        <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm">
          Track completed drawings, monitor daily activity streaks, and review unique objects in your repertoire.
        </p>
        <button
          onClick={() => openAuth('signup')}
          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition inline-flex items-center gap-2"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Sign In / Create Account</span>
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Loading your drawing analytics...</span>
      </div>
    );
  }

  const {
    totalCompleted = 0,
    totalSkipped = 0,
    totalUniqueCompleted = 0,
    totalSessions = 0,
    completionRate = 0,
    pieData = [],
    dailyChartData = [],
    recentActivity = [],
    activeSession = null
  } = stats || {};

  const PIE_COLORS = ['#10B981', '#64748B'];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">
            Welcome back, {user?.username}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here is your drawing activity overview and progress tracker.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('practice')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/25 transition flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Practice Now</span>
          </button>
          <button
            onClick={() => setCurrentView('lists')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-medium rounded-xl border border-slate-800 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add List</span>
          </button>
        </div>
      </div>

      {/* Active Session Notification Banner (if any) */}
      {activeSession && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0 mt-0.5">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">
                  Active Session in Progress
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h2 className="text-base font-semibold text-white mt-0.5">
                {activeSession.listName} — Next up:{' '}
                <span className="text-indigo-300 font-bold">"{activeSession.currentObject}"</span>
              </h2>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                <span>{activeSession.completedCount} completed</span>
                <span>•</span>
                <span>{activeSession.skippedCount} skipped</span>
                <span>•</span>
                <span>{activeSession.remainingCount + 1} remaining</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('practice')}
            className="self-start sm:self-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <span>Resume Drawing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top 5 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Completed Drawings */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Completed
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            {totalCompleted}
          </div>
          <div className="text-[11px] text-emerald-400/90 font-medium mt-1">
            +1 pt per drawing
          </div>
        </div>

        {/* Skipped Objects */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Skipped
            </span>
            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
              <SkipForward className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-300 font-['Outfit']">
            {totalSkipped}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Skipped prompts
          </div>
        </div>

        {/* Unique Objects Completed */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Unique Objects
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-300 font-['Outfit']">
            {totalUniqueCompleted}
          </div>
          <div className="text-[11px] text-indigo-400/90 font-medium mt-1">
            Distinct subjects drawn
          </div>
        </div>

        {/* Total Sessions */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sessions
            </span>
            <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            {totalSessions}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Practice runs started
          </div>
        </div>

        {/* Overall Completion Rate */}
        <div className="col-span-2 lg:col-span-1 bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Completion Rate
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            {completionRate}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts Section: Pie Chart & 14-Day Activity Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart: Completed vs Skipped */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <span>Ratio: Completed vs Skipped</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown of total processed drawing subjects
            </p>
          </div>

          <div className="h-56 w-full my-4 flex items-center justify-center">
            {totalCompleted + totalSkipped > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-500 text-xs">
                No practice records yet. Complete your first drawing to view chart!
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-center">
            <div className="p-2 rounded-xl bg-slate-900/60">
              <div className="text-emerald-400 font-bold text-sm">{totalCompleted}</div>
              <div className="text-[11px] text-slate-400">Completed</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60">
              <div className="text-slate-400 font-bold text-sm">{totalSkipped}</div>
              <div className="text-[11px] text-slate-400">Skipped</div>
            </div>
          </div>
        </div>

        {/* Bar Chart: Daily Drawing Activity (14 Days) */}
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Daily Practice Activity</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Completed vs skipped drawing activity over the last 14 days
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Last 14 Days
            </span>
          </div>

          <div className="h-64 w-full my-4">
            {dailyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#1E293B' }}
                  />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#1E293B' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px'
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '12px' }}
                  />
                  <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="skipped" name="Skipped" fill="#64748B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                No activity records recorded yet.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Consistent daily sketching builds confidence and muscle memory.</span>
            <button
              onClick={() => setCurrentView('history')}
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white font-['Outfit']">Recent Practice Activity</h2>
            <p className="text-xs text-slate-400">Latest completed and skipped drawings</p>
          </div>
          <button
            onClick={() => setCurrentView('history')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentActivity.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">List</th>
                  <th className="py-3 px-3">Points</th>
                  <th className="py-3 px-3">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentActivity.map((rec) => {
                  const isCompleted = rec.status === 'completed';
                  const dateObj = new Date(rec.timestamp);
                  const formattedDate = dateObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  });
                  const formattedTime = dateObj.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={rec.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-3 px-3 font-semibold text-white">
                        {rec.objectName}
                      </td>
                      <td className="py-3 px-3">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700/60">
                            <SkipForward className="w-3 h-3" />
                            Skipped
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {rec.listName || 'Practice'}
                      </td>
                      <td className="py-3 px-3 font-medium">
                        {isCompleted ? (
                          <span className="text-emerald-400">+1 pt</span>
                        ) : (
                          <span className="text-slate-500">0</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {formattedDate} at {formattedTime}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-slate-500 text-xs">
            No drawing activity yet. Start your first session to populate your history!
          </div>
        )}
      </div>
    </div>
  );
}
