<div align="center">

<img src="https://img.icons8.com/fluency/96/book-stack.png" width="90" alt="Book Finder Logo"/>

<h1>📚✨ Open Library Book Finder ✨📚</h1>

<p><strong>🔍 Search any book ever written &nbsp;·&nbsp; ❤️ Save your favourites &nbsp;·&nbsp; 🌙 Beautiful dark mode</strong></p>

<br/>

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Open Library](https://img.shields.io/badge/API-Open%20Library-4CAF50?style=for-the-badge&logo=bookstack&logoColor=white)](https://openlibrary.org/developers/api)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-181717?style=for-the-badge&logo=github&logoColor=white)](https://pages.github.com/)
[![License](https://img.shields.io/badge/License-MIT-9b59b6?style=for-the-badge)](LICENSE)

<br/>

[![Milestone 1](https://img.shields.io/badge/Milestone%201-✅%20Complete-2ecc71?style=flat-square)]()
[![Milestone 2](https://img.shields.io/badge/Milestone%202-✅%20Complete-2ecc71?style=flat-square)]()
[![Milestone 3](https://img.shields.io/badge/Milestone%203-✅%20Complete-2ecc71?style=flat-square)]()
[![Milestone 4](https://img.shields.io/badge/Milestone%204-⏳%20Upcoming-95a5a6?style=flat-square)]()

<br/>

**[🚀 Live Demo](#)** &nbsp;|&nbsp; **[💻 Source Code](https://github.com/SurajPatil1404/open-library-book-finder)** &nbsp;|&nbsp; **[🐛 Report a Bug](https://github.com/SurajPatil1404/open-library-book-finder/issues)**

<br/>

</div>

---

## 🌟 What is this project?

**📚 Open Library Book Finder** is a fully responsive web application that connects to the **Open Library public API** — giving users access to **millions of books** from across the world, completely free, with no login or backend needed.

> 🎓 Built as part of an **Individual Web Development Project** to demonstrate real-world JavaScript skills, API integration, and modern UI/UX design.

### 💡 What this project showcases:

| 🏆 Skill | 📝 How it's used |
|----------|-----------------|
| 🌐 API Integration | Live data fetching using `fetch` & `async/await` |
| ⚙️ Higher-Order Functions | `map()` `filter()` `sort()` `find()` `reduce()` |
| 🎨 UI/UX Design | Bookshelf grid, card animations, dark mode |
| 💾 Data Persistence | LocalStorage for favourites & theme preference |
| 🔍 Interactivity | Search, filter by subject, sort, save favourites |

---

## 🌐 API Reference

> 🟢 **Open Library API** — Completely free · No API key required · Millions of books

| 🔑 Property | 📋 Details |
|------------|-----------|
| 🔗 Base URL | `https://openlibrary.org/` |
| 📡 Search Endpoint | `/search.json?q=&title=&author=` |
| 🖼️ Cover Images | `https://covers.openlibrary.org/b/id/{cover_id}-M.jpg` |
| 🔐 Authentication | ❌ None required |
| 📄 Documentation | [openlibrary.org/developers/api](https://openlibrary.org/developers/api) |

**📬 Sample API Request:**
```bash
GET https://openlibrary.org/search.json?title=harry+potter&limit=20
```

---

## ✨ Features

### 🔐 Core Features

| ✅ Feature | 💬 Description |
|-----------|---------------|
| 🔍 **Smart Search** | Search by title, author, or topic via Open Library API |
| 🗂️ **Subject Filtering** | Filter results by auto-generated subject chips using `.filter()` |
| ↕️ **Sorting** | Sort by Title A→Z, Z→A, Year Newest, Year Oldest using `.sort()` |
| ♥️ **Favourites** | Save and view favourite books — persisted with `localStorage` |
| 🌙 **Dark / Light Mode** | Toggle themes — preference saved instantly via `localStorage` |
| 🖼️ **Cover Image Display** | Fetches cover art with a friendly fallback for missing images |
| 📭 **Empty State UI** | Clear illustrated messages when no results are found |
| ⏳ **Loading Spinner** | Smooth visual feedback during API calls |
| 📱 **Fully Responsive** | 📱 Mobile · 💻 Tablet · 🖥️ Desktop — all supported |

### ⚙️ Array Higher-Order Functions Used

| HOF | Where it's used |
|-----|----------------|
| `.map()` | Normalise API data, render card HTML, build filter chip HTML |
| `.filter()` | Subject filtering, favourites-only view |
| `.sort()` | All 4 sort options (title & year) |
| `.reduce()` | Count subject frequencies to build smart filter chips |
| `.some()` | Check if a book belongs to the active subject |
| `.forEach()` | Rebuild favourites Set from localStorage, update chip states |

> ⚠️ No `for` or `while` loops are used anywhere in the project.

---

## 🛠️ Tech Stack

```
🌐 Frontend
├── 📄 HTML5          →  Semantic structure & accessibility
├── 🎨 CSS3           →  Flexbox · Grid · Animations · Media Queries · CSS Variables
└── ⚙️  JavaScript    →  ES6+ · Async/Await · DOM Manipulation · Array HOFs

📡 API & Data
├── 🔄 Fetch API      →  All HTTP requests to Open Library
└── 🔁 Array HOFs     →  filter() · map() · sort() · find() · reduce()

💾 Storage
└── 🗄️  LocalStorage  →  Favourites · Theme preference
```

> 💡 **100% Vanilla** — No React, No frameworks, No build tools. Just clean, pure JavaScript! 🙌

---

## 📁 Project Structure

```
📦 open-library-book-finder/
│
├── 📄  index.html        →  🏠 Main HTML layout & structure
├── 🎨  style.css         →  💅 All styles, animations & responsive rules
├── ⚙️   script.js        →  🚀 Fetch, HOFs, sorting, filtering, dark mode & favourites
│
└── 📘  README.md         →  📖 You are here!
```

---

## 🚀 Getting Started

### 📥 Step 1 — Clone the Repository
```bash
git clone https://github.com/SurajPatil1404/open-library-book-finder.git
```

### 📂 Step 2 — Open the Folder
```bash
cd open-library-book-finder
```

### ▶️ Step 3 — Run the App
```bash
# 🅰️ Option A — Open directly in browser
open index.html

# 🅱️ Option B — Use Live Server (Recommended ✅)
# Right-click index.html → "Open with Live Server"
```

> ✅ No API key &nbsp;·&nbsp; ❌ No `npm install` &nbsp;·&nbsp; 🚫 No `.env` file &nbsp;·&nbsp; ▶️ Just open and run!

---

## 📊 Milestone Progress

```
✅  Milestone 1  ──  Project setup, API selection & README            📅 23rd March
✅  Milestone 2  ──  API integration & responsive UI layout           📅 1st April
✅  Milestone 3  ──  Search · Filter · Sort · Dark Mode · HOFs        📅 8th April
⏳  Milestone 4  ──  Final polish, deployment & documentation          📅 10th April
```

---

## 🌍 Deployment

🚀 The project will be deployed using **GitHub Pages**.

> 🔗 **Live link will be added here after Milestone 4 — stay tuned!**

---

## 👨‍💻 Author

<div align="center">

### 🙋‍♂️ Suraj Patil

[![GitHub](https://img.shields.io/badge/GitHub-@SurajPatil1404-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SurajPatil1404)

<br/>

<sub>🎓 Individual Web Development Project &nbsp;·&nbsp; 📚 Open Library API &nbsp;·&nbsp; 💻 2026</sub>

<br/>

⭐ *If you like this project, consider giving it a star!* ⭐

</div>
