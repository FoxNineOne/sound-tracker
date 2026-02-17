# SoundTracker - A Music Production Tool

## A React-based production analysis tool designed to help music producers visualise frequency balance, stereo width, depth, and sound shape across a project.

### 🔗 Live App: https://soundtracker.netlify.app/

## 📖 Overview

Sound Tracker began as an Excel planning sheet used to analyse arrangement balance in music production.
It has been re-engineered into a fully interactive React application with persistent state, visual charts, and import/export functionality.

The goal is to help producers quickly identify:

- Frequency imbalances
- Stereo congestion
- Depth stacking
- Transient vs sustained sound distribution

Instead of manually scanning a spreadsheet, users can now visually diagnose arrangement issues in seconds.

## 🚀 Features

✅ Add preset sounds from a curated sound library

✅ Toggle frequency bands, stereo presence, depth, and shape

✅ Real-time visualisation with Recharts (Area & Pie charts)

✅ Derived totals for each sound characteristic

✅ Persistent state using LocalStorage

✅ Export current project as JSON

✅ Import saved project files

✅ Modular component architecture

✅ Production deployment via Netlify

## 🛠️ Tech Stack

React (Create React App)

Recharts for data visualisation

LocalStorage API

ESLint (CI enforced)

Netlify for deployment

## 🏗️ Architecture

The application is structured with clear separation of concerns:

src/
  components/
    ChartsRow.jsx
    SelectedSounds.jsx
    SoundRow.jsx
  data/
    constants.js
    soundLibrary.js
  App.js


- State is lifted to App
- Derived data (totals) computed centrally
- Charts receive data via props
- Configuration constants separated into dedicated modules

## 💾 Local Development

Clone the repo:

git clone https://github.com/FoxNineOne/sound-tracker.git
cd sound-tracker
npm install
npm start


### Build for production:

npm run build

## 🎯 Why This Project?

This project was built as part of deepening React knowledge before progressing to more advanced concepts.

Rather than building a simple demo app, this tool:

- Solves a real-world problem for new music producers, helping them idenitfy faults in unbalanced mixes.
- Demonstrates component modularisation
- Uses derived state correctly
- Handles file import/export
- Deploys successfully in a CI environment

## 🔮 Future Enhancements (v2 Ideas)

- Custom user-defined sound creation modal
- Mobile responsive layout improvements
- Imbalance highlighting (automatic warnings)
- Project versioning system
- Shareable link-based project state

### 📌 Author

Built by FoxNineOne
Frontend-focused software development journey (2026)
