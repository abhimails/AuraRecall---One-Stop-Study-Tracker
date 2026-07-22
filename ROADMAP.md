# 🗺️ AuraRecall — Product Roadmap & Future Enhancements

This roadmap outlines planned features, AI capabilities, and architectural evolutions for **AuraRecall**.

---

## 🤖 Phase 1: Gemini AI Integration (Active Recall & Question Generation)

### 1.1 Automated Active Recall Question Generator
- **Gemini Flash Integration**: Automatically analyze logged study notes and key takeaways to generate 3–5 targeted active recall questions (fill-in-the-blank, conceptual Q&A, code snippet interpretation).
- **Self-Testing Flashcard Mode**: Interactive flashcard interface powered by AI-generated questions with instant answer reveals.

### 1.2 Smart Topic Summarization & Concept Chunking
- **Key Point Extraction**: Input raw study text, YouTube video transcripts, or article links, and allow Gemini to extract concise, high-yield active recall summaries.
- **Prerequisite & Related Concept Mapping**: AI suggestions for related topics to study next based on domain connections (e.g., suggesting *DAX Filter Context* after logging *Calculated Columns*).

### 1.3 AI Retrieval Coach & Adaptive Spaced Repetition (SuperMemo SM-2 / FSRS Alignment)
- **Adaptive Interval Adjustments**: Dynamically scale future revision intervals based on Gemini analysis of past recall ratings (`easy`, `medium`, `hard`) and difficulty trends.
- **Socratic Tutor Assistant**: An AI study assistant that asks follow-up probing questions during revision when a user rates a recall as `hard`.

---

## 📱 Phase 2: User Experience & Multimedia Expansion

### 2.1 Voice-Based Active Recall
- **Speech-to-Text Practice**: Speak active recall answers out loud during revision alerts; Gemini evaluates response accuracy against stored notes.
- **Audio Recaps**: Generate short audio recaps of due topics for hands-free review during commutes.

### 2.2 Rich Media Support
- **Code Block Syntax Highlighting**: Native syntax highlighting for code snippets in Python, SQL, DAX, JavaScript, and C++.
- **Diagram & Image Attachments**: Support pasting architecture diagrams, mind maps, and technical cheatsheets into active recall notes.

---

## ☁️ Phase 3: Cloud Synchronization & Collaboration

### 3.1 Firebase / Cloud Sync & Multi-Device Access
- **Firestore & Authentication**: Cross-device sync allowing seamless transition between mobile browsers and desktop workstations.
- **Offline First with Background Sync**: Persistent Service Worker caching with queue-based cloud synchronization when online.

### 3.2 Community Curated Study Decks
- **Public Deck Sharing**: Export and share curated active recall decks for Python, SQL, Power BI, AWS, and System Design certifications.
- **Collaborative Study Groups**: Group study queues for peer accountability and shared retention metrics.

---

## 📈 Phase 4: Analytics & Gamification

### 4.1 Advanced Analytics & Memory Decay Curves
- **Ebbinghaus Forgetting Curve Visualizer**: Plot estimated memory retention percentage curves for each topic over time.
- **Domain Mastery Badges**: Milestone badges for completing 100% of 1-Year reviews in specific domains.

### 4.2 Calendar Integrations
- **Google Calendar / iCal Export**: Sync daily revision queues to personal calendars as non-intrusive focus blocks.

---

## 🤝 Contributing

Have ideas for AuraRecall? Feel free to open an issue or submit a pull request on GitHub!
