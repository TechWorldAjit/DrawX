import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  History as HistoryIcon,
  Search,
  Filter,
  CheckCircle2,
  SkipForward,
  Calendar,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award
} from 'lucide-react';

export default function History() {
  const { isAuthenticated, openAuth } = useAuth();

  // Tab: 'records' | 'unique'
  const [activeTab, setActiveTab] = useState('records');

  // Filter states for records
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'completed', 'skipped'
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', '7days', '30days'
  const [listFilter, setListFilter] = useState('all');
  const [userLists, setUserLists] = useState([]);

  // Data states
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, totalPages: 1, total: 0 });
  const [uniqueObjects, setUniqueObjects] = useState([]);
  const [uniqueTotalCount, setUniqueTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    loadUserLists();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === 'records') {
      loadRecords(pagination.page);
    } else {
      loadUniqueCompleted();
    }
  }, [isAuthenticated, activeTab, statusFilter, dateFilter, listFilter, pagination.page]);

  // Debounced search
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setTimeout(() => {
      if (activeTab === 'records') {
        loadRecords(1);
      } else {
        loadUniqueCompleted();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadUserLists = async () => {
    try {
      const res = await api.getLists();
      setUserLists(res.lists || []);
    } catch (e) {
      // ignore
    }
  };

  const loadRecords = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 25,
        status: statusFilter,
        dateRange: dateFilter,
        listId: listFilter,
        search: search.trim()
      };
      const res = await api.getHistory(params);
      setRecords(res.records || []);
      setPagination(res.pagination || { page: 1, limit: 25, totalPages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUniqueCompleted = async () => {
    try {
      setLoading(true);
      const res = await api.getUniqueCompleted({ search: search.trim() });
      setUniqueObjects(res.uniqueObjects || []);
      setUniqueTotalCount(res.totalCount || 0);
    } catch (err) {
      console.error('Failed to load unique completed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <HistoryIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in to view your drawing history</h2>
        <p className="text-slate-400 text-sm mb-6">
          Review every completed sketch, track dates and categories, and inspect your full drawing portfolio.
        </p>
        <button
          onClick={() => openAuth('login')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">
            Practice History & Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete historical audit of every drawing session, completed sketch, and skipped object.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-[#111827] border border-slate-800 rounded-xl">
          <button
            onClick={() => { setActiveTab('records'); setPagination(prev => ({ ...prev, page: 1 })); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === 'records'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Practice Log
          </button>
          <button
            onClick={() => setActiveTab('unique')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'unique'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Completed Objects</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by object name (e.g. Water bottle, Chair)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Filters (Active only in Practice Log) */}
        {activeTab === 'records' && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed Only</option>
              <option value="skipped">Skipped Only</option>
            </select>

            {/* Date Range Filter */}
            <select
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Past 7 Days</option>
              <option value="30days">Past 30 Days</option>
            </select>

            {/* List Filter */}
            <select
              value={listFilter}
              onChange={(e) => { setListFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 max-w-[140px] truncate"
            >
              <option value="all">All Lists</option>
              {userLists.map((l) => (
                <option key={l._id} value={l._id}>{l.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'records' ? (
        /* View 1: Practice Log Table */
        <div className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-xs text-slate-400">Loading history records...</span>
            </div>
          ) : records.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px] bg-slate-900/40">
                      <th className="py-3.5 px-4 sm:px-6">Object Name</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">List / Category</th>
                      <th className="py-3.5 px-4">Points</th>
                      <th className="py-3.5 px-4">Date & Time</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Indicator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {records.map((r) => {
                      const isCompleted = r.status === 'completed';
                      const dateObj = new Date(r.timestamp);
                      const formattedDate = dateObj.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      });
                      const formattedTime = dateObj.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      return (
                        <tr key={r.id} className="hover:bg-slate-900/40 transition">
                          {/* Object Name */}
                          <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">
                            {r.objectName}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700/60">
                                <SkipForward className="w-3.5 h-3.5" />
                                Skipped
                              </span>
                            )}
                          </td>

                          {/* List */}
                          <td className="py-3.5 px-4 text-slate-400">
                            {r.listName || 'Practice'}
                          </td>

                          {/* Points */}
                          <td className="py-3.5 px-4 font-bold">
                            {isCompleted ? (
                              <span className="text-emerald-400">+1</span>
                            ) : (
                              <span className="text-slate-500">0</span>
                            )}
                          </td>

                          {/* Date & Time */}
                          <td className="py-3.5 px-4 text-slate-400 text-xs">
                            <div>{formattedDate}</div>
                            <div className="text-[11px] text-slate-500">{formattedTime}</div>
                          </td>

                          {/* Previously Completed Indicator */}
                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            {r.wasCompletedBefore ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400/90 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                                ✓ Drawn Before
                              </span>
                            ) : isCompleted ? (
                              <span className="text-[11px] text-indigo-400/80">
                                First Completion
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-600">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 text-xs text-slate-400">
                <div>
                  Showing {records.length} of {pagination.total} records
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                    disabled={pagination.page <= 1}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-medium text-slate-300">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, pagination.totalPages) }))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs">
              No matching practice records found.
            </div>
          )}
        </div>
      ) : (
        /* View 2: All Completed Objects */
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <span>All Completed Objects Library</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Total unique subjects successfully drawn: <strong className="text-indigo-300">{uniqueTotalCount}</strong>
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-xs text-slate-400">Loading completed objects...</span>
            </div>
          ) : uniqueObjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniqueObjects.map((item) => {
                const firstDate = new Date(item.firstCompletedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                const latestDate = new Date(item.latestCompletedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <div
                    key={item.normalizedName}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-bold text-white text-sm sm:text-base">
                        {item.objectName}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shrink-0">
                        {item.timesCompleted} {item.timesCompleted === 1 ? 'time' : 'times'}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
                      <div className="flex justify-between">
                        <span>First Drawn:</span>
                        <span className="text-slate-300 font-medium">{firstDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Most Recent:</span>
                        <span className="text-slate-300 font-medium">{latestDate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs">
              No completed drawings yet. Start practicing to populate your library!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
