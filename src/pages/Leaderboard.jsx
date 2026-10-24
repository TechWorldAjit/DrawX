import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Crown, Sparkles, User, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Leaderboard({ setCurrentView }) {
  const { user, isAuthenticated } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [currentUserStats, setCurrentUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getLeaderboard();
      setLeaderboard(res.leaderboard || []);
      setCurrentUserRank(res.currentUserRank);
      setCurrentUserStats(res.currentUserStats);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setError(err.message || 'Error loading leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3 shadow-inner">
          <Trophy className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Outfit'] mb-2">
          Artists Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Ranked by total drawing points (+1 pt per completed sketch) and unique subjects mastered.
        </p>
      </div>

      {/* Current User Rank Highlight Card */}
      {isAuthenticated && currentUserStats && (
        <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-md">
              #{currentUserRank || '—'}
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                Your Current Standing
              </div>
              <div className="text-base font-bold text-white">
                {currentUserStats.username}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-right">
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-indigo-300 font-['Outfit']">
                {currentUserStats.totalPoints}
              </div>
              <div className="text-[11px] text-slate-400">Points</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
                {currentUserStats.totalDrawingsCompleted}
              </div>
              <div className="text-[11px] text-slate-400">Completed</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-['Outfit']">
                {currentUserStats.uniqueObjectsCompleted}
              </div>
              <div className="text-[11px] text-slate-400">Unique</div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium (if >= 3 participants) */}
      {top3.length >= 2 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto pt-4">
          {/* #2 Silver */}
          <div className="flex flex-col items-center justify-end">
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-slate-300 mb-2 shadow-lg">
              <Medal className="w-6 h-6 text-slate-300" />
            </div>
            <div className="w-full bg-[#111827] border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">#2 Rank</span>
              <div className="font-bold text-white text-sm truncate mt-0.5">
                {top3[1]?.username}
              </div>
              <div className="text-lg font-extrabold text-indigo-300 font-['Outfit'] mt-1">
                {top3[1]?.totalPoints} pts
              </div>
            </div>
          </div>

          {/* #1 Gold */}
          <div className="flex flex-col items-center justify-end -translate-y-2">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-2 shadow-lg shadow-amber-500/20">
              <Crown className="w-7 h-7" />
            </div>
            <div className="w-full bg-[#111827] border border-amber-500/30 rounded-2xl p-5 text-center shadow-xl">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">#1 Champion</span>
              <div className="font-bold text-white text-base truncate mt-0.5">
                {top3[0]?.username}
              </div>
              <div className="text-2xl font-extrabold text-amber-400 font-['Outfit'] mt-1">
                {top3[0]?.totalPoints} pts
              </div>
            </div>
          </div>

          {/* #3 Bronze */}
          <div className="flex flex-col items-center justify-end">
            <div className="w-12 h-12 rounded-full bg-amber-900/30 border-2 border-amber-700/60 flex items-center justify-center text-amber-600 mb-2 shadow-lg">
              <Medal className="w-6 h-6 text-amber-600" />
            </div>
            <div className="w-full bg-[#111827] border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">#3 Rank</span>
              <div className="font-bold text-white text-sm truncate mt-0.5">
                {top3[2]?.username || '—'}
              </div>
              <div className="text-lg font-extrabold text-indigo-300 font-['Outfit'] mt-1">
                {top3[2]?.totalPoints || 0} pts
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ranked Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-['Outfit']">Global Standings</h2>
          <span className="text-xs text-slate-400">
            {leaderboard.length} registered artists
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-xs text-slate-400">Loading standings...</span>
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px] bg-slate-900/40">
                  <th className="py-3.5 px-4 sm:px-6 w-16">Rank</th>
                  <th className="py-3.5 px-4">Artist</th>
                  <th className="py-3.5 px-4 text-center">Total Points</th>
                  <th className="py-3.5 px-4 text-center">Drawings Completed</th>
                  <th className="py-3.5 px-4 text-center">Unique Objects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leaderboard.map((entry) => {
                  const isCurrent = entry.isCurrentUser;
                  const isTop1 = entry.rank === 1;
                  const isTop2 = entry.rank === 2;
                  const isTop3 = entry.rank === 3;

                  return (
                    <tr
                      key={entry.userId}
                      className={`transition ${
                        isCurrent
                          ? 'bg-indigo-600/10 font-medium'
                          : 'hover:bg-slate-900/40'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 sm:px-6">
                        {isTop1 ? (
                          <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center shadow-md shadow-amber-400/20">
                            1
                          </span>
                        ) : isTop2 ? (
                          <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-950 font-extrabold text-xs flex items-center justify-center shadow-md">
                            2
                          </span>
                        ) : isTop3 ? (
                          <span className="w-7 h-7 rounded-full bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                            3
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold pl-2 text-xs">
                            #{entry.rank}
                          </span>
                        )}
                      </td>

                      {/* Username */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs uppercase border border-slate-700">
                            {entry.username.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{entry.username}</span>
                              {isCurrent && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Total Points */}
                      <td className="py-4 px-4 text-center font-extrabold text-indigo-400 font-['Outfit'] text-sm sm:text-base">
                        {entry.totalPoints}
                      </td>

                      {/* Drawings Completed */}
                      <td className="py-4 px-4 text-center text-slate-300 font-semibold">
                        {entry.totalDrawingsCompleted}
                      </td>

                      {/* Unique Objects */}
                      <td className="py-4 px-4 text-center text-emerald-400 font-semibold">
                        {entry.uniqueObjectsCompleted}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-500 text-xs">
            No public participants yet.
          </div>
        )}

        {/* Privacy Note & Settings Link */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Leaderboard only displays public usernames and statistics. Personal emails and history are private.</span>
          </div>
          <button
            onClick={() => setCurrentView && setCurrentView('settings')}
            className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
          >
            <span>Manage Privacy in Settings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
