// ─────────────────────────────────────────────────────────────
//  ELEMENT REFERENCES
// ─────────────────────────────────────────────────────────────
const searchInput  = document.getElementById("searchInput");
const searchBtn    = document.getElementById("searchBtn");
const booksGrid    = document.getElementById("booksGrid");
const loader       = document.getElementById("loader");
const errorMsg     = document.getElementById("errorMsg");
const resultsInfo  = document.getElementById("resultsInfo");
const emptyState   = document.getElementById("emptyState");
const controlsBar  = document.getElementById("controlsBar");
const filterChips  = document.getElementById("filterChips");
const sortSelect   = document.getElementById("sortSelect");
const favToggle    = document.getElementById("favToggle");
const favCountEl   = document.getElementById("favCount");
const themeToggle  = document.getElementById("themeToggle");

// ─────────────────────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────────────────────
const API_BASE   = "https://openlibrary.org";
const LIMIT      = 100;

let allBooks     = [];        // normalised array of all fetched books
let favourites   = new Set(); // Set of saved book keys
let activeFilter = "all";     // currently active subject chip
let showFavsOnly = false;     // favourites-only view toggle

// ─────────────────────────────────────────────────────────────
//  DARK / LIGHT MODE  ← Milestone 3 Feature
// ─────────────────────────────────────────────────────────────
function toggleTheme() {
  const html    = document.documentElement;
  const isDark  = html.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  themeToggle.textContent = isDark ? "🌙" : "☀️";
  localStorage.setItem("theme", newTheme);
}

function loadTheme() {
  const saved = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  themeToggle.textContent = saved === "dark" ? "☀️" : "🌙";
}

// ─────────────────────────────────────────────────────────────
//  FAVOURITES  ← Milestone 3: Button Interactions
// ─────────────────────────────────────────────────────────────
function loadFavourites() {
  const saved = localStorage.getItem("favourites");
  if (saved) {
    // Use Array HOF .forEach() to rebuild the Set
    JSON.parse(saved).forEach(key => favourites.add(key));
  }
  favCountEl.textContent = favourites.size;
}

function saveFavourites() {
  localStorage.setItem("favourites", JSON.stringify([...favourites]));
}

function toggleFav(key) {
  if (favourites.has(key)) {
    favourites.delete(key);
  } else {
    favourites.add(key);
  }
  favCountEl.textContent = favourites.size;
  saveFavourites();

  // Update just this card's button without a full re-render
  const card = document.querySelector(`.book-card[data-key="${CSS.escape(key)}"]`);
  if (card) {
    const btn   = card.querySelector(".btn-fav");
    const saved = favourites.has(key);
    btn.classList.toggle("saved", saved);
    btn.textContent = saved ? "♥ Saved" : "♡ Save";
  }

  // If in favourites-only view, re-render to remove the un-saved card
  if (showFavsOnly) renderBooks();
}

function toggleFavView() {
  showFavsOnly = !showFavsOnly;
  favToggle.classList.toggle("active", showFavsOnly);

  if (allBooks.length > 0) {
    renderBooks();
  }
}

// ─────────────────────────────────────────────────────────────
//  FETCH BOOKS FROM OPEN LIBRARY
// ─────────────────────────────────────────────────────────────
async function fetchBooks(query) {
  showLoader();
  showFavsOnly = false;
  favToggle.classList.remove("active");

  const url = `${API_BASE}/search.json?q=${encodeURIComponent(query)}&limit=${LIMIT}`;

  try {
    const res  = await fetch(url);
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();

    // ── Array HOF: .map() to normalise raw API objects ──────
    allBooks = data.docs.map(doc => ({
      key:      doc.key     || "",
      title:    doc.title   || "Untitled",
      authors:  doc.author_name ? doc.author_name.join(", ") : "Unknown Author",
      year:     doc.first_publish_year || null,
      coverId:  doc.cover_i || null,
      subjects: doc.subject
                  ? doc.subject.slice(0, 8).map(s => s.charAt(0).toUpperCase() + s.slice(1))
                  : [],
    }));

    activeFilter = "all";
    buildFilterChips();
    renderBooks();
    controlsBar.style.display = "flex";

  } catch (err) {
    errorMsg.textContent = "Unable to load books. Please try again.";
    errorMsg.classList.add("active");
  }

  hideLoader();
}

// ─────────────────────────────────────────────────────────────
//  BUILD FILTER CHIPS  ← Milestone 3: Filtering
//  Uses Array HOFs: .reduce() .filter() .sort() .map()
// ─────────────────────────────────────────────────────────────
function buildFilterChips() {
  // Count how many books belong to each subject — Array HOF: .reduce()
  const subjectCount = allBooks.reduce((acc, book) => {
    book.subjects.slice(0, 3).forEach(s => {
      acc[s] = (acc[s] || 0) + 1;
    });
    return acc;
  }, {});

  // Keep subjects that appear in 2+ books, take top 7 — .filter() + .sort() + .map()
  const topSubjects = Object.entries(subjectCount)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([subject]) => subject);

  const allChip = `<button class="chip active" data-filter="all" onclick="setFilter('all')">All</button>`;

  // .map() to build each chip's HTML
  const subjectChips = topSubjects
    .map(s => `<button class="chip" data-filter="${escAttr(s)}" onclick="setFilter('${escAttr(s)}')">${escHtml(s)}</button>`)
    .join("");

  filterChips.innerHTML = allChip + subjectChips;
}

// ─────────────────────────────────────────────────────────────
//  SET ACTIVE FILTER
// ─────────────────────────────────────────────────────────────
function setFilter(subject) {
  activeFilter = subject;
  // Update chip active states — Array HOF: .forEach() on NodeList
  document.querySelectorAll(".chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.filter === subject);
  });
  renderBooks();
}

// ─────────────────────────────────────────────────────────────
//  RENDER BOOKS  ← Uses filter + sort + map — NO for/while loops
// ─────────────────────────────────────────────────────────────
function renderBooks() {
  errorMsg.classList.remove("active");
  emptyState.style.display = "none";

  const sortVal = sortSelect.value;

  // ── STEP 1: Filter by favourites-only view ─────────────────
  let visible = showFavsOnly
    ? allBooks.filter(book => favourites.has(book.key))  // HOF: .filter()
    : allBooks;

  // ── STEP 2: Filter by subject chip ← Milestone 3: Filtering
  visible = activeFilter === "all"
    ? visible
    : visible.filter(book =>                              // HOF: .filter()
        book.subjects.some(s => s === activeFilter)       // HOF: .some()
      );

  // ── STEP 3: Sort ← Milestone 3: Sorting ───────────────────
  // Use spread to avoid mutating original array, then .sort()
  const sorted = [...visible].sort((a, b) => {           // HOF: .sort()
    if (sortVal === "title-az") return a.title.localeCompare(b.title);
    if (sortVal === "title-za") return b.title.localeCompare(a.title);
    if (sortVal === "year-new") return (b.year || 0) - (a.year || 0);
    if (sortVal === "year-old") return (a.year || 0) - (b.year || 0);
    return 0; // "relevance" = original API order
  });

  // ── Update results info ───────────────────────────────────
  resultsInfo.textContent = sorted.length
    ? `Showing ${sorted.length} book${sorted.length !== 1 ? "s" : ""}`
    : "";

  if (sorted.length === 0) {
    emptyState.style.display = "block";
    emptyState.innerHTML = showFavsOnly
      ? `<span class="empty-icon">♥</span><p>No saved books yet. Click ♡ Save on any book!</p>`
      : `<span class="empty-icon">🔍</span><p>No books match this filter. Try another one.</p>`;
    booksGrid.innerHTML = "";
    return;
  }

  // ── STEP 4: Map to card HTML ← HOF: .map() ───────────────
  booksGrid.innerHTML = sorted.map(buildCard).join("");  // HOF: .map()
}

// ─────────────────────────────────────────────────────────────
//  BUILD A SINGLE CARD  ← Milestone 3: Button Interactions
// ─────────────────────────────────────────────────────────────
function buildCard(book) {
  const isSaved = favourites.has(book.key);
  const olLink  = `${API_BASE}${book.key}`;

  const coverHTML = book.coverId
    ? `<div class="book-cover-wrapper">
         <img
           class="book-cover"
           src="https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg"
           alt="${escAttr(book.title)}"
           loading="lazy"
           onerror="this.parentElement.innerHTML='<div class=\\'no-cover\\'><span class=\\'no-cover-icon\\'>📖</span><span>${escAttr(book.title)}</span></div>'"
         />
       </div>`
    : `<div class="book-cover-wrapper">
         <div class="no-cover">
           <span class="no-cover-icon">📖</span>
           <span>${escHtml(book.title)}</span>
         </div>
       </div>`;

  return `
    <div class="book-card" data-key="${escAttr(book.key)}">
      ${coverHTML}
      <div class="book-info">
        <div class="book-title">${escHtml(book.title)}</div>
        <div class="book-author">${escHtml(book.authors)}</div>
        ${book.year ? `<div class="book-year">📅 First published ${book.year}</div>` : ""}
      </div>
      <div class="book-actions">
        <button
          class="btn-fav ${isSaved ? "saved" : ""}"
          onclick="toggleFav('${escAttr(book.key)}')"
        >${isSaved ? "♥ Saved" : "♡ Save"}</button>
        <a class="book-link" href="${olLink}" target="_blank" rel="noopener">View ↗</a>
      </div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────
//  LOADER HELPERS
// ─────────────────────────────────────────────────────────────
function showLoader() {
  loader.classList.add("active");
  booksGrid.innerHTML   = "";
  emptyState.style.display = "none";
  errorMsg.classList.remove("active");
  errorMsg.textContent  = "";
  resultsInfo.textContent = "";
}

function hideLoader() {
  loader.classList.remove("active");
}

// ─────────────────────────────────────────────────────────────
//  HTML / ATTRIBUTE ESCAPE HELPERS
// ─────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─────────────────────────────────────────────────────────────
//  EVENT LISTENERS
// ─────────────────────────────────────────────────────────────
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchBooks(query);
});

searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) fetchBooks(query);
  }
});

// ─────────────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  loadFavourites();
  fetchBooks("javascript");
});
