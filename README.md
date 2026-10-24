# DrawX — Minimal Object Drawing Practice Tracker

> A simple, fast, colorful, dark-themed web application designed to help artists practice drawing consistently, eliminate decision fatigue with randomized object queues, and track completed & skipped sketches over time.

Built with **React (Vite) + Tailwind CSS + Recharts + MongoDB Atlas + Google Gemini API**. Zero backend servers to maintain — deployed seamlessly on **Vercel** with unified serverless API routes.

---

## Key Features

1. **Randomized Practice Game**:
   - Randomly queues objects from any drawing list.
   - Clean, distraction-free center stage: displays **"Your drawing challenge"** with exactly two primary action buttons: **Completed** and **Skip**.
   - No countdowns, timers, or canvas clutter.
   - Idempotent action submissions prevent double-point counting.
   - Page refresh persistence: Never loses active session or remaining queue.

2. **Previously Completed Object Labels**:
   - When an object was completed on an earlier date or in a prior session, it displays a subtle badge: **`✓ Completed Before`**.
   - If an object was previously only skipped and never completed, no label is shown.
   - Practicing the same object on multiple days awards total drawings and practice points, while unique object credit is accurately counted once.

3. **Comma-Separated Drawing Lists**:
   - Paste paragraphs containing hundreds of comma-separated subjects.
   - Automatically trims whitespace and deduplicates case-insensitively while preserving original display casing.
   - Live preview chips showing parsed count and detected items.
   - Pre-seeded presets: *Daily Objects*, *Stationery*, *Animals*, *Human Figures & Poses*, *Technical Objects*.
   - Deleting a list **never** deletes historical records or points.

4. **AI Drawing Prompt Generator (Google Gemini API)**:
   - Built-in prompt generator powered by Google Gemini (`gemini-3.5-flash-lite` / `gemini-3.5-flash`).
   - Select category, difficulty (Easy, Medium, Hard), and quantity (5–30).
   - Generates tangible, observational drawing subjects suited for A4 paper sketches.
   - Save directly as a new list or append to existing lists.
   - Secure server-side endpoint protects your API key.

5. **Analytics Dashboard**:
   - Real database aggregations: Total Completed, Total Skipped, Unique Objects Drawn, Total Sessions, Overall Completion Rate.
   - **Recharts Pie Chart**: Completed vs. Skipped ratio.
   - **Recharts 14-Day Activity Bar Chart**: Day-by-day completions and skips.
   - **Recent Activity**: Latest 10 practice records with timestamps and status.

6. **Searchable & Filterable History**:
   - Filter by status (*Completed*, *Skipped*), date range (*Today*, *Last 7 Days*, *Last 30 Days*), and category list.
   - Real-time search by object name.
   - **All Completed Objects Library View**: Displays every unique object drawn, total times completed, first drawn date, and latest drawn date.

7. **Public Leaderboard & Multi-User Security**:
   - Multi-user authentication with bcrypt password hashing and JWT.
   - Strict server-side user data isolation.
   - Global Leaderboard ranked by total points, with tie-breakers on unique objects and join date.
   - Privacy settings: Toggle participation in public leaderboard anytime in Settings.

---

## Architecture Overview

```
DrawX/
├── api/                    # Vercel Serverless Function entrypoint
│   └── index.js            # Exports Express app for serverless execution
├── server/                 # Express API server & business logic
│   ├── app.js              # Express app, middleware, CORS, SPA static fallback
│   ├── server.js           # Local dev server runner (PORT 5001)
│   ├── db.js               # MongoDB connection with serverless connection caching
│   ├── middleware/auth.js  # JWT authentication middleware
│   ├── models/             # Mongoose schemas (User, DrawingList, PracticeSession, PracticeRecord)
│   └── routes/             # API routes (auth, lists, sessions, dashboard, history, leaderboard, ai)
├── src/                    # React + Vite frontend
│   ├── components/         # Navbar, AuthModal
│   ├── context/            # AuthContext (user state, token, session helpers)
│   ├── pages/              # Dashboard, Practice, MyLists, History, Leaderboard, Settings
│   ├── services/api.js     # Centralized API client
│   ├── App.jsx             # View router and layout
│   ├── index.css           # Tailwind CSS styles & typography
│   └── main.jsx            # React root mount
├── vercel.json             # Vercel rewrite rules (API routes + SPA routing)
├── vite.config.mjs         # Vite configuration with Tailwind CSS & API proxy
└── package.json            # Scripts and dependencies
```

---

## Local Development Setup

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v26)
- **MongoDB Atlas** cluster connection string
- **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/app/apikey))

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/your-username/drawx.git
cd drawx
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate `.env` with your actual credentials:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
MONGODB_DBNAME=drawx
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5001
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Servers
Run both the Express API and Vite frontend concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001`
- Health check: `http://localhost:5001/api/health`

Alternatively, build and run the unified standalone production bundle:
```bash
npm run build
npm start
```

---

## MongoDB Atlas Database Configuration & Indexes

DrawX connects automatically using Mongoose with connection pooling. The following compound indexes are created automatically on collection initialization:

| Collection | Index Fields | Purpose |
|---|---|---|
| `users` | `{ username: 1 }` (unique), `{ email: 1 }` (unique) | Fast login & uniqueness checks |
| `drawinglists` | `{ userId: 1, updatedAt: -1 }` | Fast list retrieval by user |
| `practicesessions` | `{ userId: 1, isCompleted: 1, startedAt: -1 }` | Instant active session lookup on refresh |
| `practicerecords` | `{ userId: 1, normalizedName: 1, status: 1 }` | Instant `✓ Completed Before` label lookup |
| `practicerecords` | `{ userId: 1, timestamp: -1 }` | Fast history filtering & sorting |
| `practicerecords` | `{ sessionId: 1, normalizedName: 1 }` | Idempotency & duplicate submission guard |

---

## Deployment to Vercel

DrawX is optimized for 1-click deployment on Vercel without requiring a separate backend process.

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "feat: Initial DrawX commit"
git branch -M main
git remote add origin https://github.com/<your-username>/drawx.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New Project** and select your `drawx` repository.
3. Framework Preset: **Vite** (Vercel detects this automatically).
4. Output Directory: `dist`.

### Step 3: Add Environment Variables in Vercel
In the project configuration under **Environment Variables**, add:
- `MONGO_URI`: Your MongoDB Atlas connection URI.
- `MONGODB_DBNAME`: `drawx` (or your preferred DB name).
- `JWT_SECRET`: A secure random secret string.
- `GEMINI_API_KEY`: Your Google Gemini API key.

### Step 4: Deploy
Click **Deploy**.
- Vercel automatically builds the frontend static bundle.
- The `api/index.js` file handles all `/api/*` routes as a fast, auto-scaling serverless function.
- All other routes fall back to `index.html` for single-page app routing.

---

## Verification & Acceptance Tests

All 15 acceptance test scenarios pass with 100% success:

| # | Test Scenario | Status |
|---|---|---|
| 1 | New user signup, login, and auth token issuance | PASSED |
| 2 | Comma-separated list parsing & case-insensitive deduplication | PASSED |
| 3 | Starting a session selects one random object | PASSED |
| 4 | Completing an object awards 1 point and updates queue | PASSED |
| 5 | Skipping an object awards 0 points and updates queue | PASSED |
| 6 | No object repeats within the same session | PASSED |
| 7 | Refreshing browser preserves active session & queue state | PASSED |
| 8 | Previously completed object shows `✓ Completed Before` badge | PASSED |
| 9 | Re-completing an object increases drawings count without double-crediting unique count | PASSED |
| 10 | Dashboard charts & stats aggregate directly from MongoDB records | PASSED |
| 11 | Replacing/deleting a list preserves historical records | PASSED |
| 12 | Strict user data isolation (User B cannot access User A's data) | PASSED |
| 13 | Google Gemini API prompt generation generates tangible subjects | PASSED |
| 14 | Leaderboard calculates correct rankings and tie-breakers | PASSED |
| 15 | Responsive layout on mobile, tablet, and desktop | PASSED |

---

## License

MIT License. Built for artists and designers to develop daily drawing habits.
