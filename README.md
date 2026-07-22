# 🎓 AuraRecall — Active Recall & Spaced Repetition Tracker

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Apache_2.0-green.svg)](LICENSE)

**AuraRecall** is an intelligent, minimalist spaced repetition and active recall companion designed for lifelong learners, developers, and students studying Python, SQL, Power BI, System Design, and personal growth topics.

By eliminating the cognitive load of calculating revision schedules manually, AuraRecall keeps memory retention effortless and systematic.

---

## 🌟 Key Features

- **⚡ Automated Spaced Repetition Engine**: Calculates revision milestones automatically from the initial study completion date ($T_0$):
  - **24 Hours** ($T + 1\text{d}$)
  - **72 Hours** ($T + 3\text{d}$)
  - **1 Week** ($T + 7\text{d}$)
  - **3 Months** ($T + 90\text{d}$)
  - **6 Months** ($T + 180\text{d}$)
  - **1 Year** ($T + 365\text{d}$)
- **🧠 Active Recall Test Prompts**: Collapsible prompt sections on review cards to test knowledge before revealing answers or rating memory recall.
- **📊 Consistency & Retention Metrics**: Tracks total study sessions, completed revisions, category distribution, and a self-assessed **Retention Index**.
- **🔥 GitHub-Style Consistency Grid**: Visualizes daily study and revision activity across a 22-week historical heatmap.
- **🚀 Time-Travel Simulator**: Fast-forward or jump to future dates (+1d, +3d, +1w, +3m) to preview upcoming recall queues and verify spaced repetition schedules.
- **✨ Motivational Inspiration**: High-resolution visual cards with curated quotes to encourage consistent daily study habits.
- **💾 Complete Local Persistence & Data Management**: Auto-saves locally with instant JSON export and import capabilities.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: React 19 + TypeScript 5.8
- **Build Tool & Bundler**: Vite 6.0
- **Styling**: Tailwind CSS v4.0 with custom soft warm neutral theme
- **Icons**: Lucide React
- **Visual Feedback**: Canvas Confetti for micro-delights on completed revisions
- **Architecture**: Modular functional architecture with dedicated types, constants, utilities, and isolated component boundaries.

---

## 📁 Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── Header.tsx                 # Top navigation, streak counter & time-travel status
│   │   ├── StudyLogForm.tsx           # Form to log new study topics and active recall notes
│   │   ├── RevisionAlerts.tsx         # Today's recall queue with difficulty rating toggles
│   │   ├── ConsistencyMetrics.tsx     # Retention index, topic counts, and category breakdown
│   │   ├── MotivationalCard.tsx       # Inspirational image banner and quote generator
│   │   ├── ConsistencyGrid.tsx        # Heatmap grid tracking daily study activity
│   │   ├── StudyJourney.tsx           # Full topic list with search, filter, and quick deletion
│   │   └── TimeTravelSimulator.tsx    # Date simulation tools & JSON import/export
│   ├── constants/
│   │   └── milestones.ts              # Spaced repetition definitions & motivational quotes
│   ├── utils/
│   │   ├── dateUtils.ts               # Date math, ISO formatting, and day offset logic
│   │   └── storage.ts                 # localStorage wrapper and retention calculation engine
│   ├── types.ts                       # Core TypeScript interfaces (Topic, Milestone, Stats)
│   ├── App.tsx                        # Main application view & state provider
│   ├── main.tsx                       # React root entry point
│   └── index.css                      # Global Tailwind CSS imports
├── ARCHITECTURE.md                    # Technical architecture & design document
├── metadata.json                      # Application metadata
├── package.json                       # Project dependencies
└── tsconfig.json                      # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/aurarecall.git
   cd aurarecall
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000` to interact with AuraRecall.

### Building for Production

To compile the production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run start
```

---

## 📄 Documentation

For an in-depth breakdown of the data model, retention algorithms, component hierarchy, and time-travel simulator mechanics, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 📜 License

This project is licensed under the Apache 2.0 License.
