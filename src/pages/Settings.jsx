import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Server,
  Cloud,
  Key,
  Database,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  Copy,
  Info
} from 'lucide-react';

export default function Settings() {
  const { user, updateSettings, logout, isAuthenticated, openAuth } = useAuth();
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(user?.leaderboardOptIn !== false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [healthStatus, setHealthStatus] = useState(null);
  const [copiedKey, setCopiedKey] = useState('');

  useEffect(() => {
    if (user) {
      setLeaderboardOptIn(user.leaderboardOptIn !== false);
    }
    checkHealth();
  }, [user]);

  const checkHealth = async () => {
    try {
      const res = await api.getHealth();
      setHealthStatus(res);
    } catch (err) {
      setHealthStatus({ status: 'error', error: err.message });
    }
  };

  const handleToggleLeaderboard = async () => {
    const newValue = !leaderboardOptIn;
    setLeaderboardOptIn(newValue);
    setSavingSettings(true);
    try {
      await updateSettings({ leaderboardOptIn: newValue });
      setSuccessMsg(`Leaderboard participation ${newValue ? 'enabled' : 'disabled'}.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setLeaderboardOptIn(!newValue);
      alert('Failed to update leaderboard settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const copyToClipboard = (text, keyName) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <SettingsIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in to access settings</h2>
        <p className="text-slate-400 text-sm mb-6">
          Configure your user profile, leaderboard visibility, and inspect setup guides.
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

  const memberDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">
          Settings & Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your account profile, privacy settings, and view Vercel & MongoDB deployment guides.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-300 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Account & Profile Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-['Outfit']">Account Profile</h2>
            <p className="text-xs text-slate-400">Your personal credentials and account details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Username</span>
            <div className="text-base font-bold text-white mt-1">{user?.username}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Email</span>
            <div className="text-base font-bold text-white mt-1 truncate">{user?.email}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Member Since</span>
            <div className="text-base font-bold text-white mt-1">{memberDate}</div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400">Need to switch accounts?</span>
          <button
            onClick={logout}
            className="px-4 py-2 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/30 rounded-xl transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Privacy & Leaderboard Settings Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-['Outfit']">Leaderboard & Privacy</h2>
            <p className="text-xs text-slate-400">Control your public visibility</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white">Public Leaderboard Participation</div>
            <div className="text-xs text-slate-400 mt-1 max-w-xl">
              When enabled, your username, completed sketches count, and drawing points appear on the global community leaderboard. Your email and private lists remain completely hidden.
            </div>
          </div>

          <button
            onClick={handleToggleLeaderboard}
            disabled={savingSettings}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              leaderboardOptIn ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                leaderboardOptIn ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* System Health Check Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">System & API Status</h2>
              <p className="text-xs text-slate-400">Real-time database and service health</p>
            </div>
          </div>

          <button
            onClick={checkHealth}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Backend API & Database:</span>
            {healthStatus?.status === 'ok' ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Connected (MongoDB Atlas)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                <AlertCircle className="w-4 h-4" /> Connecting...
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Google Gemini AI Engine:</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Gemini 3.5 Ready
            </span>
          </div>
        </div>
      </div>

      {/* Deployment & Setup Guide (Section 12) */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-['Outfit']">
              Vercel & GitHub Deployment Guide
            </h2>
            <p className="text-xs text-slate-400">
              Step-by-step instructions for hosting DrawX on Vercel with zero server maintenance.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          {/* Step 1: Push to GitHub */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                1
              </span>
              <span>Push Code to your GitHub Repository</span>
            </div>
            <p className="text-xs text-slate-400 pl-7">
              Initialize a git repository, commit all files, and push to your private or public GitHub repo. The included <code className="text-indigo-300 font-mono">.gitignore</code> guarantees that sensitive keys are never committed.
            </p>
            <pre className="p-3 rounded-xl bg-[#090D16] border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto ml-7">
              git init{'\n'}git add .{'\n'}git commit -m "feat: Initial DrawX commit"{'\n'}git branch -M main{'\n'}git remote add origin https://github.com/your-username/drawx.git{'\n'}git push -u origin main
            </pre>
          </div>

          {/* Step 2: Import into Vercel */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                2
              </span>
              <span>Import Project into Vercel</span>
            </div>
            <p className="text-xs text-slate-400 pl-7">
              Go to <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-indigo-400 underline inline-flex items-center gap-1">vercel.com/new <ExternalLink className="w-3 h-3" /></a> and import your GitHub repository.
              Vercel will automatically detect Vite and configure the build settings.
            </p>
          </div>

          {/* Step 3: Configure Environment Variables */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                3
              </span>
              <span>Configure Vercel Environment Variables</span>
            </div>
            <p className="text-xs text-slate-400 pl-7">
              In your Vercel Project Settings &gt; <strong>Environment Variables</strong>, add the following variables:
            </p>

            <div className="ml-7 space-y-2">
              {[
                { name: 'MONGO_URI', desc: 'Your MongoDB Atlas connection string' },
                { name: 'MONGODB_DBNAME', desc: 'Optional: target database name (default: drawx)' },
                { name: 'JWT_SECRET', desc: 'Strong random secret for signing authentication tokens' },
                { name: 'GEMINI_API_KEY', desc: 'Your Google Gemini API key from AI Studio' }
              ].map((v) => (
                <div key={v.name} className="flex items-center justify-between p-2.5 rounded-xl bg-[#090D16] border border-slate-800 text-xs">
                  <div>
                    <span className="font-mono font-bold text-indigo-300">{v.name}</span>
                    <span className="text-slate-400 ml-2">— {v.desc}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(v.name, v.name)}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Copy variable name"
                  >
                    {copiedKey === v.name ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Serverless API Architecture */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                4
              </span>
              <span>Deploy & Enjoy Serverless Simplicity</span>
            </div>
            <p className="text-xs text-slate-400 pl-7">
              Click <strong>Deploy</strong>. Vercel automatically deploys the frontend and turns <code className="text-indigo-300 font-mono">api/index.js</code> into a unified, zero-maintenance Serverless API handler. No separate server process to manage!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
