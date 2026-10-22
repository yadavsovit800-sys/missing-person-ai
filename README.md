# 🚨 FindTrace AI — Missing Person Identification & Emergency Broadcast Platform

FindTrace AI is a full-stack emergency response system designed to drastically reduce missing person search timelines using localized facial biometric vector matching, direct file uploads, database persistence, and geofenced Amber alerts.

---

## ✨ Core Features
- 🗂️ **Active Case Directory**: Real-time missing person records filterable by **All**, **Active**, and **Found** statuses.
- 📸 **Direct Local Disk Uploads**: Upload missing person photographs directly from local disk, automatically saved to `public/uploads/` and tracked in SQLite via Prisma ORM.
- 🎯 **AI Facial Scanner & Mesh Visualizer**: Interactive HTML5 Canvas facial landmark mesh simulation with 128-dimensional biometric vector comparison.
- 📡 **Geofenced Amber Alert Broadcast**: Configurable radial alert distribution system targeting mobile nodes in proximity.
- 📊 **Live Analytics Ticker**: Dynamic dashboard counters tracking total cases, reunions, active cases, and facial accuracy rates.

---

## 🛠️ Tech Stack
- **Frontend**: HTML5, Tailwind CSS, JavaScript (ES6+), FontAwesome, Canvas API
- **Backend**: Node.js, Express.js, Multer
- **Database & ORM**: SQLite, Prisma ORM
- **Tools**: Prisma Studio

---

## 🚀 Quick Start Instructions

### 1. Install Dependencies
```bash
npm install
