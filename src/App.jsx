import React, { useState } from "react";

// Simple function to suggest closest spelling
function suggestQuery(query, docs) {
  if (!docs || docs.length === 0) return query;

  // Get all titles from results
  const titles = docs.map((book) => book.title.toLowerCase());

  // Find the title with minimum edit distance
  let bestMatch = query;
  let minDistance = Infinity;

  const levenshtein = (a, b) => {
    const dp = Array.from({ length: a.length + 1 }, (_, i) =>
      Array(b.length + 1).fill(0)
    );
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1, // deletion
            dp[i][j - 1] + 1, // insertion
            dp[i - 1][j - 1] + 1 // substitution
          );
        }
      }
    }
    return dp[a.length][b.length];
  };

  titles.forEach((title) => {
    const dist = levenshtein(query.toLowerCase(), title);
    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = title;
    }
  });

  return bestMatch;
}

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [expandedBook, setExpandedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const searchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setMessage("");

    const response = await fetch(
      `https://openlibrary.org/search.json?q=${query}`
    );
    const data = await response.json();

    if (!data.docs || data.docs.length === 0) {
      setMessage(`📢 No books found for "${query}". Try another search.`);
      setBooks([]);
      setLoading(false);
      return;
    }

    // Try to suggest a better spelling if needed
    const suggested = suggestQuery(query, data.docs);
    if (suggested.toLowerCase() !== query.toLowerCase()) {
      setMessage(`Did you mean: "${suggested}" ? Showing results...`);
    }

    setBooks(data.docs.slice(0, 15));
    setLoading(false);
  };

  const toggleBookInfo = (index) => {
    setExpandedBook(expandedBook === index ? null : index);
  };

  return (
    <div>
      <h1 className="title">📚 Book Finder</h1>
      <h2 className="subtitle">Discover, Learn & Get Inspired by Knowledge</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by book title or author..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchBooks}>Search</button>
      </div>

      {/* Message (No results or suggestion) */}
      {message && (
        <p style={{ color: "#64ffda", marginTop: "10px" }}>{message}</p>
      )}

      {/* Loading Spinner */}
      {loading && <div className="spinner"></div>}

      {/* Books Grid */}
      <div className="books">
        {!loading &&
          books.map((book, index) => (
            <div
              key={index}
              className={`book-card ${expandedBook === index ? "active" : ""}`}
              onClick={() => toggleBookInfo(index)}
            >
              <img
                src={
                  book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "https://via.placeholder.com/150x200?text=No+Cover"
                }
                alt={book.title}
              />
              <h3>{book.title}</h3>
              <p>
                {book.author_name
                  ? book.author_name.join(", ")
                  : "Unknown Author"}
              </p>

              <div className="book-info">
                <p>
                  <strong>Author:</strong>{" "}
                  {book.author_name ? book.author_name.join(", ") : "N/A"}
                </p>
                <p>
                  <strong>First Published:</strong>{" "}
                  {book.first_publish_year || "N/A"}
                </p>
              </div>
            </div>
          ))}
      </div>

      <footer>
        📖 “A reader lives a thousand lives before he dies . . . The man who
        never reads lives only one.” – George R.R. Martin
      </footer>
    </div>
  );
}

export default App;
