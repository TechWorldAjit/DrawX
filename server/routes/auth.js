const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const DrawingList = require('../models/DrawingList');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'drawx_default_secret_key_2026';

const STARTER_LISTS = [
  {
    name: 'Daily Essentials',
    subjects: [
      'Water bottle', 'Coffee mug', 'Keychain', 'Wall clock', 'Chair',
      'Headphones', 'Backpack', 'Sunglasses', 'Desk lamp', 'Smartphone',
      'Sneakers', 'Wristwatch', 'Bicycle', 'Umbrella', 'Notebook'
    ]
  },
  {
    name: 'Stationery & Tools',
    subjects: [
      'Pencil', 'Eraser', 'Scissors', 'Stapler', 'Paperclip',
      'Sharpener', 'Fountain pen', 'Ruler', 'Sticky notes', 'Highlighter',
      'Tape dispenser', 'Glue stick', 'Compass', 'Calculator', 'Paintbrush'
    ]
  }
];

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    if (username.trim().length < 2) {
      return res.status(400).json({ message: 'Username must be at least 2 characters.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { username: username.trim() }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email.trim().toLowerCase()) {
        return res.status(400).json({ message: 'An account with this email already exists.' });
      }
      return res.status(400).json({ message: 'This username is already taken.' });
    }

    // Create user
    const newUser = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      leaderboardOptIn: true
    });

    await newUser.save();

    // Seed default drawing lists for immediate practice
    try {
      for (const starter of STARTER_LISTS) {
        await DrawingList.create({
          userId: newUser._id,
          name: starter.name,
          subjects: starter.subjects
        });
      }
    } catch (seedErr) {
      console.warn("Could not seed initial lists:", seedErr.message);
    }

    // Sign JWT
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        leaderboardOptIn: newUser.leaderboardOptIn,
        createdAt: newUser.createdAt
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error during signup', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide username/email and password.' });
    }

    const cleanIdentifier = identifier.trim();

    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier.toLowerCase() },
        { username: cleanIdentifier }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        leaderboardOptIn: user.leaderboardOptIn,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        leaderboardOptIn: user.leaderboardOptIn,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching user profile', error: err.message });
  }
});

// PUT /api/auth/settings
router.put('/settings', authMiddleware, async (req, res) => {
  try {
    const { leaderboardOptIn } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (typeof leaderboardOptIn === 'boolean') {
      user.leaderboardOptIn = leaderboardOptIn;
    }

    await user.save();
    return res.json({
      message: 'Settings updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        leaderboardOptIn: user.leaderboardOptIn,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating settings', error: err.message });
  }
});

module.exports = router;
