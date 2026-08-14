# AI Personality Matrix App

A React app for collecting, comparing, and exporting cross-system AI personality assessments across two conditions:

- `Clean` (fresh/incognito account)
- `Contaminated` (history/personalized account)

The app includes both:

- AI-to-AI assessments (`Collect` tab)
- User-to-AI assessments (`User Assessment` tab)

## What It Does

- Provides structured prompts for primary and follow-up evaluation.
- Captures per-dimension ratings (1-10) and written notes.
- Tracks completion status for each assessor/target pair.
- Visualizes data in a matrix with self-vs-peer deltas.
- Surfaces notable gaps in analysis.
- Exports data as JSON and Markdown.
- Imports JSON to restore or replace in-app dataset.

## Tabs Overview

- `Setup`: Prompt blocks and execution order.
- `Collect`: AI assessor rates all target systems for each condition.
- `User Assessment`: Your own ratings/notes for each system.
- `Matrix`: Numeric comparison grid and deltas.
- `Analysis`: Gap detection and clean-vs-contaminated shifts.
- `Export`: Export JSON/Markdown, import JSON, reset data.

## Quick Start

```bash
npm install
npm run dev
```

Open the local Vite URL (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev` starts the dev server.
- `npm run build` builds production assets.
- `npm run preview` previews the production build locally.
- `npm run lint` runs ESLint.

## Recommended Workflow

1. Start in `Setup` and copy prompts.
2. Complete `Collect` for all systems in `Clean` first.
3. Run follow-up rankings after each primary response.
4. Repeat in `Contaminated`.
5. Fill `User Assessment` with your direct experience ratings.
6. Review `Matrix` and `Analysis`.
7. Export JSON at regular checkpoints.

## Data Safety

- The app auto-saves dataset state under storage key `ai-personality-matrix-v2`.
- Use `Export JSON` frequently as a hard backup.
- Use `Import JSON` to restore a previous snapshot.
- `Reset All Data` permanently clears current in-app data.

## Data Shape (High Level)

- `entries`: AI assessor x condition x target records.
- `userAssessments`: user x condition x target records.
- `notes`: free-form metadata.
- `created` / `modified`: timestamps.

## Project Structure

- `src/App.jsx`: app logic, phases, storage, export/import flow.
- `src/index.css`: global styles.
- `src/App.css`: default Vite CSS scaffold (not primary styling source).

## Notes

- This app is intentionally optimized for manual research workflows over strict automation.
- Exported Markdown is intended for downstream analysis tools (for example NotebookLM).
