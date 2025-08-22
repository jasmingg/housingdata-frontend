# Housing Data Visualizer — Frontend

As part of a full-stack project, this is the repo for my **React + Vite (TypeScript)** code which visualizes housing-burden data from the **2013 American Housing Survey (AHS)**.  

Deployed on **Netlify**, with a **Netlify Function** proxying requests to an Elastic Beanstalk API to avoid mixed-content/CORS issues.

**Live site:** [https://housingdata.netlify.app](https://housingdata.netlify.app)  
**Function (example):** `/.netlify/functions/api?state=Virginia&metro=3`

---

## 🚀 Highlights

- ⚡️ React + Vite + TypeScript
- ☁️ Netlify Function proxy → forwards to Elastic Beanstalk API
- 🔐 No mixed-content: browser → HTTPS function → HTTP EB (server-side)
- 📊 Cards + `BurdenChart` comparing **region vs. metro** burden distribution
- 🧪 Local development with Netlify CLI

---

## 🧪 Usage

Enter a U.S. state (e.g., Virginia)

Choose a metro category:

- Central City (1)
- Suburban (3)
- Non-metro (5)

Click Fetch

View cards and chart populated with API response data
(Chart only updates after successful fetch using confirmed response values)

---

> **📦 Project Overview – Housing Data Platform**

This project consists of three repos working together, with the other two being:

- 🧠 [`housingdata-backend`](https://github.com/jasmingg/housingdata-backend)  
  Java Spring Boot API hosted on AWS Elastic Beanstalk.  
  It exposes housing affordability statistics derived from the 2013 American Housing Survey (AHS) via `/api?state=...&metro=...`.

- 🐍 [`housingdata-visualizer`](https://github.com/jasmingg/housingdata-visualizer)  
  Python-based repo that uses **GitHub Actions** to generate **150 static pie chart images** (50 states × 3 metro types).  
  These charts visualize housing burden distributions and are automatically deployed to **GitHub Pages**, along with an `index.html` for easy browsing.

- 🎨 **(this repo)** — `housingdata-frontend`  

Together, these form a lightweight full-stack visualization platform for U.S. housing burden data.


## 🧠 How this repo Works (High level overview)

.
├── netlify.toml
├── netlify/
│   └── functions/
│       └── api.js          # Netlify Function proxy to EB
├── src/
│   ├── App.tsx             # UI flow, cards, fetch button
│   ├── BurdenChart.tsx     # Chart rendering
│   └── lib/
│       └── api.ts          # API builder + fetch wrapper