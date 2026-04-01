const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const booksGrid = document.getElementById("booksGrid");
const loader = document.getElementById("loader");
const errorMsg = document.getElementById("errorMsg");
const resultsInfo = document.getElementById("resultsInfo");
const emptyState = document.getElementById("emptyState");

const API_BASE = "https://openlibrary.org";
const LIMIT = 100;

function showLoader() {
  loader.classList.add("active");
  booksGrid.innerHTML = "";
  errorMsg.textContent = "";
  emptyState.style.display = "none";
}

function hideLoader() {
  loader.classList.remove("active");
}

async function fetchBooks(query) {
  showLoader();

  let url = API_BASE + "/search.json?q=" + encodeURIComponent(query) + "&limit=" + LIMIT;

  try {
    let res = await fetch(url);

    if (!res.ok) {
      throw "error";
    }

    let data = await res.json();
    displayBooks(data.docs, data.numFound, query);

  } catch (e) {
    try {
      let proxy = "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);

      let res = await fetch(proxy);
      let data = await res.json();

      displayBooks(data.docs, data.numFound, query);

    } catch (e2) {
      errorMsg.textContent = "Unable to load books. Try again.";
    }
  }

  hideLoader();
}

function displayBooks(books, total, query) {
  if (!books || books.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  resultsInfo.textContent = "Showing " + books.length + " of " + total + " results for \"" + query + "\"";

  let html = "";

  books.forEach(function(book) {
    let title = book.title || "No title";
    let author = book.author_name ? book.author_name.join(", ") : "Unknown";
    let year = book.first_publish_year || "-";
    let cover = book.cover_i ? "https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg" : "";
    let link = book.key ? "https://openlibrary.org" + book.key : "#";

    html += `
      <div class="book-card">
        ${cover ? `<img src="${cover}" class="book-cover"/>` : `<div>📖 No Cover</div>`}
        <h3>${title}</h3>
        <p>${author}</p>
        <p>📅 ${year}</p>
        <a href="${link}" target="_blank">View ↗</a>
      </div>
    `;
  });

  booksGrid.innerHTML = html;
}

searchBtn.addEventListener("click", function() {
  let query = searchInput.value.trim();
  if (query) fetchBooks(query);
});

searchInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    let query = searchInput.value.trim();
    if (query) fetchBooks(query);
  }
});

window.addEventListener("DOMContentLoaded", function() {
  fetchBooks("javascript");
});
