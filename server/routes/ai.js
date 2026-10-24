const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const DrawingList = require('../models/DrawingList');
const { parseSubjects } = require('./lists');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// POST /api/ai/generate - Secure server-side Gemini prompt generator
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { category = 'everyday objects', difficulty = 'Medium', count = 10 } = req.body;

    if (!GEMINI_API_KEY) {
      return res.status(503).json({
        message: 'Google Gemini API is not configured on the server. Please check your GEMINI_API_KEY in server environment settings.'
      });
    }

    const numCount = Math.min(Math.max(parseInt(count, 10) || 10, 3), 40);

    const promptText = `
You are an expert drawing coach preparing practical drawing practice prompts for an artist drawing on A4 paper.
Generate exactly ${numCount} unique, tangible drawing subjects.

Category: ${category}
Difficulty: ${difficulty} (Easy = simple geometric forms & silhouettes; Medium = everyday objects with realistic proportions & perspective; Hard = complex anatomy, dynamic angles, mechanical details, or textured surfaces).

CRITICAL INSTRUCTIONS:
1. Return ONLY a valid JSON array of strings containing the object names.
2. Example format: ["Transparent water bottle", "Vintage alarm clock", "Bicycle pedal", "Running human figure", "Dog sitting sideways"]
3. NO markdown formatting, NO introductory text, NO bullet points, NO explanations.
4. Each item must be a specific, clearly visualizable subject suitable for quick observational sketching.
5. Do NOT include duplicates.
`;

    // Try models with fallback: gemini-3.5-flash-lite, then gemini-3.5-flash
    const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-flash-latest'];
    let rawText = '';
    let success = false;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000
              }
            }),
            signal: AbortSignal.timeout(12000)
          }
        );

        const data = await response.json();

        if (response.ok && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          rawText = data.candidates[0].content.parts[0].text;
          success = true;
          break;
        } else {
          lastError = data.error?.message || `HTTP ${response.status}`;
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    if (!success) {
      return res.status(502).json({
        message: `Gemini API request failed: ${lastError || 'No response candidates received'}`
      });
    }

    // Clean JSON text (strip markdown code blocks if model wrapped it in ```json ... ```)
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
    }

    let prompts = [];
    try {
      prompts = JSON.parse(cleaned);
      if (!Array.isArray(prompts)) {
        throw new Error('Result is not an array');
      }
    } catch (parseErr) {
      // Fallback: split by lines/commas if model didn't return pure JSON
      prompts = parseSubjects(cleaned);
    }

    // Clean, trim, and deduplicate prompts
    const validPrompts = parseSubjects(prompts);

    return res.json({
      prompts: validPrompts,
      count: validPrompts.length,
      category,
      difficulty
    });
  } catch (err) {
    console.error('AI generate route error:', err);
    return res.status(500).json({
      message: 'Failed to generate prompts via AI',
      error: err.message
    });
  }
});

// POST /api/ai/append-to-list - Append generated prompts to an existing list
router.post('/append-to-list', authMiddleware, async (req, res) => {
  try {
    const { listId, prompts } = req.body;

    if (!listId || !prompts) {
      return res.status(400).json({ message: 'List ID and prompts are required.' });
    }

    const list = await DrawingList.findOne({ _id: listId, userId: req.user.userId });
    if (!list) {
      return res.status(404).json({ message: 'Drawing list not found.' });
    }

    const combined = [...list.subjects, ...(Array.isArray(prompts) ? prompts : [prompts])];
    const parsed = parseSubjects(combined);

    list.subjects = parsed;
    await list.save();

    return res.json({
      message: `Appended prompts to list '${list.name}'. Total items: ${parsed.length}`,
      list
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error appending prompts to list', error: err.message });
  }
});

module.exports = router;
