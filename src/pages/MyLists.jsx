import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ListOrdered,
  Plus,
  Trash2,
  Edit3,
  Play,
  Sparkles,
  Bot,
  AlertCircle,
  CheckCircle2,
  X,
  Copy,
  PlusCircle,
  RotateCcw,
  BookOpen
} from 'lucide-react';

export default function MyLists({ setCurrentView }) {
  const { isAuthenticated, openAuth } = useAuth();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Manual List Create/Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingList, setEditingList] = useState(null); // null if creating new
  const [listName, setListName] = useState('');
  const [rawSubjectsText, setRawSubjectsText] = useState('');
  const [savingList, setSavingList] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const [deletingList, setDeletingList] = useState(false);

  // AI Prompt Generator Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiCategory, setAiCategory] = useState('everyday objects');
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [aiCount, setAiCount] = useState(10);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState([]);
  const [aiError, setAiError] = useState('');
  const [aiTargetListId, setAiTargetListId] = useState('new'); // 'new' or list._id
  const [aiNewListName, setAiNewListName] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    loadLists();
  }, [isAuthenticated]);

  const loadLists = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getLists();
      setLists(res.lists || []);
    } catch (err) {
      console.error('Failed to load lists:', err);
      setError(err.message || 'Error fetching drawing lists');
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse comma-separated text into deduplicated array
  const parseItems = (text) => {
    if (!text) return [];
    const raw = text.split(/,|\n/);
    const seen = new Set();
    const result = [];
    for (const item of raw) {
      const trimmed = item.trim();
      if (!trimmed) continue;
      const lower = trimmed.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        result.push(trimmed);
      }
    }
    return result;
  };

  const parsedValidItems = parseItems(rawSubjectsText);

  // Open modal for new list
  const openCreateModal = () => {
    setEditingList(null);
    setListName('');
    setRawSubjectsText('');
    setModalOpen(true);
    setError('');
  };

  // Open modal for editing/replacing existing list
  const openEditModal = (list) => {
    setEditingList(list);
    setListName(list.name);
    setRawSubjectsText(list.subjects.join(', '));
    setModalOpen(true);
    setError('');
  };

  // Save List (Create or Update)
  const handleSaveList = async (e) => {
    e.preventDefault();
    if (!listName.trim()) {
      setError('List name is required.');
      return;
    }
    if (parsedValidItems.length === 0) {
      setError('Please provide at least one valid object prompt separated by commas.');
      return;
    }

    setSavingList(true);
    setError('');
    try {
      if (editingList) {
        await api.updateList(editingList._id, {
          name: listName.trim(),
          rawSubjects: rawSubjectsText
        });
        setSuccessMsg(`List '${listName.trim()}' updated successfully.`);
      } else {
        await api.createList({
          name: listName.trim(),
          rawSubjects: rawSubjectsText
        });
        setSuccessMsg(`List '${listName.trim()}' created with ${parsedValidItems.length} objects.`);
      }
      setModalOpen(false);
      loadLists();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save drawing list');
    } finally {
      setSavingList(false);
    }
  };

  // Delete List
  const confirmDelete = async () => {
    if (!listToDelete) return;
    setDeletingList(true);
    try {
      await api.deleteList(listToDelete._id);
      setSuccessMsg(`List '${listToDelete.name}' deleted. Historical practice records remain preserved.`);
      setDeleteModalOpen(false);
      setListToDelete(null);
      loadLists();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete list');
    } finally {
      setDeletingList(false);
    }
  };

  // Seed preset categories
  const handleAddPreset = async (presetKey) => {
    try {
      const res = await api.seedPreset(presetKey);
      setSuccessMsg(`Preset list '${res.list.name}' added successfully!`);
      loadLists();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to add preset list');
    }
  };

  // Start Practice on a specific list
  const handleStartPracticeWithList = async (listId) => {
    try {
      await api.startSession({ listId });
      if (setCurrentView) setCurrentView('practice');
    } catch (err) {
      setError(err.message || 'Failed to start practice session');
    }
  };

  // AI Prompt Generation
  const handleGenerateAI = async () => {
    setAiGenerating(true);
    setAiError('');
    try {
      const res = await api.generateAIPrompts({
        category: aiCategory,
        difficulty: aiDifficulty,
        count: aiCount
      });
      setGeneratedPrompts(res.prompts || []);
      if (!aiNewListName) {
        setAiNewListName(`${aiCategory.charAt(0).toUpperCase() + aiCategory.slice(1)} (${aiDifficulty})`);
      }
    } catch (err) {
      setAiError(err.message || 'AI Generation failed. Check server GEMINI_API_KEY.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSaveAIPrompts = async () => {
    if (generatedPrompts.length === 0) return;
    try {
      if (aiTargetListId === 'new') {
        const nameToUse = aiNewListName.trim() || `${aiCategory} Prompts`;
        await api.createList({
          name: nameToUse,
          subjects: generatedPrompts
        });
        setSuccessMsg(`Created new list '${nameToUse}' with ${generatedPrompts.length} AI prompts.`);
      } else {
        await api.appendPromptsToList({
          listId: aiTargetListId,
          prompts: generatedPrompts
        });
        setSuccessMsg(`Appended ${generatedPrompts.length} AI prompts to your list.`);
      }
      setAiModalOpen(false);
      setGeneratedPrompts([]);
      loadLists();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setAiError(err.message || 'Failed to save generated prompts');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <ListOrdered className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in to manage your drawing lists</h2>
        <p className="text-slate-400 text-sm mb-6">
          Create, edit, and organize custom drawing categories with hundreds of prompts.
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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">
            Drawing Lists & Prompts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize objects into custom categories, paste large comma-separated lists, or generate with AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setAiModalOpen(true);
              setGeneratedPrompts([]);
              setAiError('');
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-violet-600/20 transition flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            <span>Generate with AI</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New List</span>
          </button>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-300 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-rose-300 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preset Starter Lists Quick Add Bar */}
      <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Quick Preset Categories:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'daily', label: 'Daily Objects' },
            { key: 'stationery', label: 'Stationery' },
            { key: 'animals', label: 'Animals' },
            { key: 'human_figures', label: 'Human Figures' },
            { key: 'technical', label: 'Technical' }
          ].map((preset) => (
            <button
              key={preset.key}
              onClick={() => handleAddPreset(preset.key)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Drawing Lists Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-xs text-slate-400">Loading your lists...</span>
        </div>
      ) : lists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => {
            const previewItems = list.subjects.slice(0, 8);
            const extraCount = list.subjects.length - previewItems.length;

            return (
              <div
                key={list._id}
                className="bg-[#111827] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl hover:border-slate-700 transition group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h2 className="text-lg font-bold text-white font-['Outfit'] group-hover:text-indigo-300 transition">
                        {list.name}
                      </h2>
                      <span className="text-xs text-slate-400 font-medium">
                        {list.subjects.length} drawing subjects
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(list)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                        title="Edit / Replace List"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setListToDelete(list);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                        title="Delete List"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Object Preview Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {previewItems.map((subj, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-800/80 text-slate-300"
                      >
                        {subj}
                      </span>
                    ))}
                    {extraCount > 0 && (
                      <span className="px-2.5 py-1 rounded-lg text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium">
                        +{extraCount} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action */}
                <button
                  onClick={() => handleStartPracticeWithList(list._id)}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Practice Session</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Drawing Lists Yet</h2>
          <p className="text-xs text-slate-400 mb-6">
            Create your first drawing list by pasting comma-separated items or use AI to generate fresh subjects.
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={openCreateModal}
              className="py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl"
            >
              Create New List
            </button>
            <button
              onClick={() => handleAddPreset('daily')}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-medium rounded-xl border border-slate-800"
            >
              Add "Daily Objects" Preset
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Create / Edit List Modal */}
      {/* ------------------------------------------------------------------ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#111827] border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-white font-['Outfit'] mb-1">
              {editingList ? 'Edit / Replace Drawing List' : 'Create New Drawing List'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Paste a large paragraph of hundreds of comma-separated objects. Duplicates within the list are automatically ignored.
            </p>

            <form onSubmit={handleSaveList} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  List Name
                </label>
                <input
                  type="text"
                  required
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="e.g. Stationery, Animals, Human Figures, Daily Objects"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Drawing Prompts (Comma-Separated)
                  </label>
                  <span className="text-xs font-semibold text-indigo-400">
                    {parsedValidItems.length} valid objects detected
                  </span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={rawSubjectsText}
                  onChange={(e) => setRawSubjectsText(e.target.value)}
                  placeholder="Water bottle, keychain, wall clock, pencil, eraser, scissors, stapler, headphones, coffee mug, chair, bicycle, human figure, running pose, dog, cat..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition leading-relaxed"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Tip: Original capitalization is preserved. Capitalization differences (e.g. "Cat" and "cat") are deduplicated automatically.
                </p>
              </div>

              {/* Detected Items Preview Chips */}
              {parsedValidItems.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Preview Detected Items ({parsedValidItems.length}):
                  </label>
                  <div className="max-h-36 overflow-y-auto p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-wrap gap-1.5">
                    {parsedValidItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg text-xs bg-slate-800 text-slate-200 border border-slate-700/60"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingList || parsedValidItems.length === 0}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
                >
                  {savingList ? 'Saving...' : editingList ? 'Save Changes' : 'Create List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Delete Confirmation Modal */}
      {/* ------------------------------------------------------------------ */}
      {deleteModalOpen && listToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-white font-['Outfit'] mb-2">
              Delete Drawing List?
            </h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Are you sure you want to delete <span className="text-white font-semibold">"{listToDelete.name}"</span>?
            </p>

            <div className="p-3 mb-6 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs text-left">
              <strong>Safe deletion guaranteed:</strong> Deleting this list will never delete your historical practice records, scores, or completed objects.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="py-2.5 px-4 rounded-xl text-sm font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
              >
                Keep List
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deletingList}
                className="py-2.5 px-4 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white transition disabled:opacity-50 shadow-md shadow-rose-600/20"
              >
                {deletingList ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* AI Prompt Generator Modal */}
      {/* ------------------------------------------------------------------ */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#111827] border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setAiModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-violet-500/15 text-violet-400">
                <Bot className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white font-['Outfit']">
                Generate Drawing Prompts with AI
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Powered by Google Gemini API. Generates tangible drawing subjects optimized for practicing on A4 paper.
            </p>

            {aiError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            <div className="space-y-4 mb-6">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Subject Category
                </label>
                <select
                  value={aiCategory}
                  onChange={(e) => setAiCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                >
                  <option value="everyday objects">Everyday Objects</option>
                  <option value="stationery">Stationery & Tools</option>
                  <option value="animals">Animals & Wildlife</option>
                  <option value="human figures">Human Figures & Poses</option>
                  <option value="architecture">Architecture & Buildings</option>
                  <option value="vehicles">Vehicles & Transport</option>
                  <option value="sports">Sports Equipment & Actions</option>
                  <option value="household items">Household Items & Furniture</option>
                  <option value="technical objects">Technical & Mechanical Objects</option>
                </select>
              </div>

              {/* Difficulty and Count */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="Easy">Easy (Simple shapes)</option>
                    <option value="Medium">Medium (Everyday perspective)</option>
                    <option value="Hard">Hard (Complex mechanics / anatomy)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Prompt Count
                  </label>
                  <select
                    value={aiCount}
                    onChange={(e) => setAiCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="5">5 Prompts</option>
                    <option value="10">10 Prompts</option>
                    <option value="15">15 Prompts</option>
                    <option value="20">20 Prompts</option>
                    <option value="30">30 Prompts</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={aiGenerating}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {aiGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Gemini is generating drawing subjects...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Prompts with Gemini</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Prompts Review Section */}
            {generatedPrompts.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Generated Prompts ({generatedPrompts.length}):
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPrompts.join(', '));
                      setSuccessMsg('Prompts copied to clipboard!');
                      setTimeout(() => setSuccessMsg(''), 2500);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy All</span>
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap gap-1.5">
                  {generatedPrompts.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-200 border border-slate-700/60"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                {/* Save Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Save Destination:
                    </label>
                    <select
                      value={aiTargetListId}
                      onChange={(e) => setAiTargetListId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                    >
                      <option value="new">Save as New List</option>
                      {lists.map((l) => (
                        <option key={l._id} value={l._id}>
                          Append to: {l.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {aiTargetListId === 'new' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        New List Name:
                      </label>
                      <input
                        type="text"
                        value={aiNewListName}
                        onChange={(e) => setAiNewListName(e.target.value)}
                        placeholder="e.g. AI Animal Studies"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSaveAIPrompts}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition"
                >
                  Save Prompts to Library
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
