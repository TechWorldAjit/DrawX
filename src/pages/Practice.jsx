import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  SkipForward,
  RotateCcw,
  Sparkles,
  Play,
  ListOrdered,
  PlusCircle,
  Award,
  Clock,
  ArrowRight,
  Check,
  Flame,
  AlertCircle
} from 'lucide-react';

export default function Practice({ onSessionStateChange, setCurrentView }) {
  const { isAuthenticated, openAuth } = useAuth();

  // Active session state
  const [activeSession, setActiveSession] = useState(null);
  const [currentObject, setCurrentObject] = useState('');
  const [isPreviouslyCompleted, setIsPreviouslyCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submittingAction, setSubmittingAction] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null); // 'completed' | 'skipped'

  // Session complete summary modal state
  const [finishedSummary, setFinishedSummary] = useState(null);

  // Setup / Start view states (when no active session exists)
  const [userLists, setUserLists] = useState([]);
  const [builtInCategories, setBuiltInCategories] = useState([]);
  const [masterCategory, setMasterCategory] = useState(null);
  const [selectedListId, setSelectedListId] = useState('builtin:all');
  const [quickPasteText, setQuickPasteText] = useState('');
  const [startingSession, setStartingSession] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // AI Tag Generator states (Inside Start Drawing Practice)
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');

  // Ref to prevent double-submitting clicks
  const submittingRef = useRef(false);

  // Fetch active session and lists on mount
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    loadActiveSession();
    loadLists();
    loadBuiltInLists();
  }, [isAuthenticated]);

  const loadActiveSession = async () => {
    try {
      setLoading(true);
      const res = await api.getActiveSession();
      if (res.activeSession) {
        setActiveSession(res.activeSession);
        setCurrentObject(res.activeSession.currentObject);
        setIsPreviouslyCompleted(res.activeSession.isPreviouslyCompleted);
        if (onSessionStateChange) onSessionStateChange(true);
      } else {
        setActiveSession(null);
        setCurrentObject('');
        if (onSessionStateChange) onSessionStateChange(false);
      }
    } catch (err) {
      console.error('Failed to load active session:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLists = async () => {
    try {
      const res = await api.getLists();
      setUserLists(res.lists || []);
    } catch (err) {
      console.warn('Failed to load lists:', err);
    }
  };

  const loadBuiltInLists = async () => {
    try {
      const res = await api.getBuiltInLists();
      if (res.categories) {
        setBuiltInCategories(res.categories);
      }
      if (res.master) {
        setMasterCategory(res.master);
        // Default to Master Library if nothing selected yet
        setSelectedListId('builtin:all');
      }
    } catch (err) {
      console.warn('Failed to load built-in lists:', err);
    }
  };

  // AI Tag Generator: generates 100-200 comma-separated drawing objects
  const handleGenerateAITags = async () => {
    if (!aiPromptInput.trim()) {
      setAiError('Please enter a word, topic, or prompt to generate drawing objects.');
      return;
    }

    setAiGenerating(true);
    setAiError('');
    setAiSuccessMsg('');

    try {
      const res = await api.generateAIPrompts({
        prompt: aiPromptInput.trim()
      });

      if (res.text) {
        // Automatically insert the generated comma-separated tags into the practice-list input field
        setQuickPasteText(res.text);
        setAiSuccessMsg(`✓ Generated ${res.count || '100+'} objects for "${aiPromptInput.trim()}". You can review and edit below.`);
        setTimeout(() => setAiSuccessMsg(''), 6000);
      } else if (res.prompts && res.prompts.length > 0) {
        setQuickPasteText(res.prompts.join(', '));
        setAiSuccessMsg(`✓ Generated ${res.prompts.length} objects for "${aiPromptInput.trim()}". You can review and edit below.`);
        setTimeout(() => setAiSuccessMsg(''), 6000);
      } else {
        setAiError('No objects could be generated. Please try a different prompt.');
      }
    } catch (err) {
      console.error('AI tag generation failed:', err);
      // Keep existing list intact, show concise error
      setAiError(err.message || 'Failed to generate objects with AI. Please check your network or try again.');
    } finally {
      setAiGenerating(false);
    }
  };

  const fireGentleConfetti = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#6366F1', '#A855F7', '#38BDF8'],
        disableForReducedMotion: true
      });
    } catch (e) {
      // ignore
    }
  };

  // Handle Completed or Skip action
  const handleAction = async (actionType) => {
    if (!activeSession || submittingRef.current || !currentObject) return;

    submittingRef.current = true;
    setSubmittingAction(true);
    setActionFeedback(actionType);

    if (actionType === 'completed') {
      fireGentleConfetti();
    }

    try {
      const res = await api.sessionAction(activeSession.id, actionType, currentObject);

      if (res.isSessionFinished) {
        // Session ended
        setFinishedSummary({
          listName: activeSession.listName,
          totalProcessed: activeSession.initialCount,
          completedCount: res.session.completedCount,
          skippedCount: res.session.skippedCount,
          pointsEarned: res.session.completedCount
        });
        setActiveSession(null);
        setCurrentObject('');
        if (onSessionStateChange) onSessionStateChange(false);
      } else {
        // Next object
        setActiveSession(res.session);
        setCurrentObject(res.session.currentObject);
        setIsPreviouslyCompleted(res.session.isPreviouslyCompleted);
      }
    } catch (err) {
      console.error('Action error:', err);
      // If object was already processed or out of sync, reload session
      loadActiveSession();
    } finally {
      submittingRef.current = false;
      setSubmittingAction(false);
      setTimeout(() => setActionFeedback(null), 500);
    }
  };

  // Start a new practice session
  const handleStartSession = async (fromQuickPaste = false) => {
    setErrorMsg('');
    setStartingSession(true);

    try {
      let payload = {};
      if (fromQuickPaste) {
        if (!quickPasteText.trim()) {
          setErrorMsg('Please paste at least one drawing object.');
          setStartingSession(false);
          return;
        }
        payload = {
          customName: 'Quick Session',
          customSubjects: quickPasteText
        };
      } else {
        if (!selectedListId) {
          setErrorMsg('Please select a drawing list to begin.');
          setStartingSession(false);
          return;
        }
        payload = { listId: selectedListId };
      }

      const res = await api.startSession(payload);
      setActiveSession(res.session);
      setCurrentObject(res.session.currentObject);
      setIsPreviouslyCompleted(res.session.isPreviouslyCompleted);
      setFinishedSummary(null);
      if (onSessionStateChange) onSessionStateChange(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to start session.');
    } finally {
      setStartingSession(false);
    }
  };

  // Cancel / Pause session
  const handleEndSession = async () => {
    if (!activeSession) return;
    if (window.confirm('Are you sure you want to pause and end this practice session?')) {
      try {
        await api.cancelSession(activeSession.id);
        setActiveSession(null);
        setCurrentObject('');
        if (onSessionStateChange) onSessionStateChange(false);
      } catch (err) {
        console.error('Failed to end session:', err);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
          Sign In to Practice Drawing
        </h2>
        <p className="text-slate-400 max-w-md mx-auto mb-8">
          Sign in or create a free DrawX account to track every completed sketch, build daily streaks, and watch your drawing library grow.
        </p>
        <button
          onClick={() => openAuth('signup')}
          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition inline-flex items-center gap-2"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Get Started Free</span>
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Loading your drawing session...</span>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // Active Practice Game View
  // ----------------------------------------------------------------------
  if (activeSession && currentObject) {
    const processed = activeSession.completedCount + activeSession.skippedCount;
    const progressPercent = activeSession.initialCount > 0
      ? Math.round((processed / activeSession.initialCount) * 100)
      : 0;

    return (
      <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-[75vh]">
        {/* Top Session Progress Bar & Controls */}
        <div className="w-full mb-8 flex items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
              {activeSession.listName}
            </span>
            <span>
              Object {processed + 1} of {activeSession.initialCount}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <Check className="w-3.5 h-3.5" /> {activeSession.completedCount}
              </span>
              <span className="text-slate-600">•</span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <SkipForward className="w-3.5 h-3.5" /> {activeSession.skippedCount}
              </span>
            </div>

            <button
              onClick={handleEndSession}
              className="px-2.5 py-1 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition"
              title="Pause and exit session"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Progress bar track */}
        <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden mb-12">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Center Drawing Challenge Card */}
        <div className="w-full bg-[#111827] border border-slate-800 rounded-3xl p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden transition-all duration-300">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header prompt label */}
          <p className="text-xs sm:text-sm uppercase tracking-widest font-semibold text-slate-400 mb-4">
            Your drawing challenge
          </p>

          {/* Prominent Object Name */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 font-['Outfit'] select-none">
            {currentObject}
          </h1>

          {/* Section 6: Previously Completed Object Label */}
          <div className="min-h-[32px] flex items-center justify-center mb-8">
            {isPreviouslyCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-sm animate-pulse-subtle">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                Completed Before
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium text-slate-400 bg-slate-900 border border-slate-800">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                First time in your library
              </span>
            )}
          </div>

          {/* Exactly Two Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
            {/* Completed Button */}
            <button
              onClick={() => handleAction('completed')}
              disabled={submittingAction}
              className={`py-4 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 shadow-lg ${
                actionFeedback === 'completed'
                  ? 'bg-emerald-500 text-white scale-105 shadow-emerald-500/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 hover:shadow-emerald-500/35'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              <span>Completed</span>
            </button>

            {/* Skip Button */}
            <button
              onClick={() => handleAction('skip')}
              disabled={submittingAction}
              className={`py-4 px-6 rounded-2xl font-semibold text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 border ${
                actionFeedback === 'skip'
                  ? 'bg-slate-700 text-white border-slate-600 scale-95'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Skip</span>
            </button>
          </div>
        </div>

        {/* Minimal Footer Hint */}
        <p className="mt-8 text-xs text-slate-400 text-center select-none">
          Draw with pen, pencil, or tablet on paper. Click <span className="text-emerald-400 font-semibold">Completed</span> when finished or <span className="text-slate-300 font-semibold">Skip</span> to pass.
        </p>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // Session Complete Summary Modal (Finished Screen)
  // ----------------------------------------------------------------------
  if (finishedSummary) {
    const rate = finishedSummary.totalProcessed > 0
      ? Math.round((finishedSummary.completedCount / finishedSummary.totalProcessed) * 100)
      : 0;

    return (
      <div className="max-w-lg mx-auto py-12 px-4 animate-fade-in">
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight font-['Outfit'] mb-2">
            Session Complete!
          </h2>
          <p className="text-sm text-slate-400 mb-8">
            Awesome practice! You finished all objects in <span className="text-slate-200 font-medium">"{finishedSummary.listName}"</span>.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-2xl font-bold text-emerald-400 font-['Outfit']">
                {finishedSummary.completedCount}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">Completed</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-2xl font-bold text-slate-300 font-['Outfit']">
                {finishedSummary.skippedCount}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">Skipped</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-2xl font-bold text-indigo-400 font-['Outfit']">
                +{finishedSummary.pointsEarned}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">Points Earned</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setFinishedSummary(null);
                handleStartSession();
              }}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Another Session</span>
            </button>

            <button
              onClick={() => {
                setFinishedSummary(null);
                if (setCurrentView) setCurrentView('dashboard');
              }}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium rounded-xl border border-slate-800 transition"
            >
              View Updated Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // No Active Session: Start Practice Screen
  // ----------------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-['Outfit'] mb-2">
          Start Drawing Practice
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Choose a saved drawing list or quickly paste prompts to begin an uninterrupted drawing session.
        </p>
      </div>

      {errorMsg && (
        <div className="max-w-xl mx-auto mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Option 1: Practice with Built-in 1,000+ Library or Saved List */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5 text-indigo-400">
                <ListOrdered className="w-5 h-5" />
                <h2 className="text-lg font-bold text-white font-['Outfit']">Practice Built-in & Saved Lists</h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                1,000+ Objects
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Select a category or practice the complete master library. Objects are queued in random order.
            </p>

            <div className="space-y-2 mb-6">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Library or Category
              </label>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {/* 1. Master Library (All 1,000+ Objects) */}
                <div
                  onClick={() => setSelectedListId('builtin:all')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    selectedListId === 'builtin:all'
                      ? 'bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border-indigo-500/50 text-white shadow-md'
                      : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                      ★
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-1.5">
                        <span>Master Drawing Library</span>
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-indigo-500 text-white rounded">
                          All 1,000+
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {masterCategory ? masterCategory.subjects.length : '1,000+'} distinct objects across all 20 categories
                      </div>
                    </div>
                  </div>
                  {selectedListId === 'builtin:all' && (
                    <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Built-in Categories Header */}
                <div className="pt-2 pb-1 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Built-in Categories (20)
                </div>

                {/* 2. Built-in Categories */}
                {builtInCategories.map((cat) => {
                  const catKey = `builtin:${cat.id}`;
                  const isSelected = selectedListId === catKey;
                  return (
                    <div
                      key={catKey}
                      onClick={() => setSelectedListId(catKey)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600/15 border-indigo-500/40 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs sm:text-sm">{cat.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {cat.subjects.length} objects • {cat.description}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* User's Custom Lists (if any) */}
                {userLists.length > 0 && (
                  <>
                    <div className="pt-3 pb-1 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      My Custom Lists ({userLists.length})
                    </div>
                    {userLists.map((list) => {
                      const isSelected = selectedListId === list._id;
                      return (
                        <div
                          key={list._id}
                          onClick={() => setSelectedListId(list._id)}
                          className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-600/15 border-indigo-500/40 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-xs sm:text-sm">{list.name}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {list.subjects?.length || 0} drawing prompts
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleStartSession(false)}
            disabled={startingSession}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {startingSession ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Practice Session</span>
              </>
            )}
          </button>
        </div>

        {/* Option 2: AI Tag Generator & Quick Paste Section */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2.5 text-emerald-400 mb-2">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                AI Tag Generator & Quick Draw
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Type any word or topic to generate 100–200 drawing objects with AI, or paste your own comma-separated list.
            </p>

            {/* Feature 1: Simple AI Tag Generator Input */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4 space-y-2.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Generate with AI
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={aiPromptInput}
                  onChange={(e) => setAiPromptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleGenerateAITags();
                    }
                  }}
                  placeholder="Enter any topic or prompt (e.g. vintage office, ocean life, tools)..."
                  className="flex-1 px-3.5 py-2.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm transition"
                />

                <button
                  type="button"
                  onClick={handleGenerateAITags}
                  disabled={aiGenerating || !aiPromptInput.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {aiGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                      <span>Generate with AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status / Error feedback for AI Generation */}
              {aiGenerating && (
                <div className="text-[11px] text-indigo-300 flex items-center gap-1.5 animate-pulse">
                  <span>Gemini is generating 100–200 specific drawing objects for "{aiPromptInput}"...</span>
                </div>
              )}

              {aiSuccessMsg && (
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{aiSuccessMsg}</span>
                </div>
              )}

              {aiError && (
                <div className="text-[11px] text-rose-400 font-medium flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{aiError}</span>
                </div>
              )}
            </div>

            {/* Editable Comma-Separated Practice List Field */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Practice Objects List (Editable)
                </label>
                <span className="text-[11px] font-semibold text-emerald-400">
                  {quickPasteText ? quickPasteText.split(',').filter(x => x.trim()).length : 0} objects ready
                </span>
              </div>

              <textarea
                rows={6}
                value={quickPasteText}
                onChange={(e) => setQuickPasteText(e.target.value)}
                placeholder="Comma-separated object names will appear here automatically. You can also paste or edit objects manually anytime..."
                className="w-full px-3.5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs sm:text-sm transition resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                <span>Edit or add items separated by commas</span>
                {quickPasteText && (
                  <button
                    type="button"
                    onClick={() => setQuickPasteText('')}
                    className="text-slate-500 hover:text-slate-300 text-[11px]"
                  >
                    Clear list
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleStartSession(true)}
            disabled={startingSession || !quickPasteText.trim()}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {startingSession ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Practice with These Objects</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
