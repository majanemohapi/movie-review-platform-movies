import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Use environment variable for TMDB API key
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export default function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const search = async (e) => {
    e.preventDefault();
    if (!q) return;

    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}`;
      const res = await axios.get(url);
      setResults(res.data.results || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch movies. Check your API key.");
      setResults([]);
    }
  };

  return (
    <div>
      <h2>Search Movies</h2>
      <form onSubmit={search} className="mb-3">
        <div className="input-group">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="form-control"
            placeholder="Search a movie"
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {results.map((m) => (
          <div className="col-md-4 mb-3" key={m.id}>
            <div className="card">
              {m.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
                  className="card-img-top"
                  alt={m.title}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{m.title}</h5>
                <p className="card-text">{m.release_date}</p>
                {/* Link to AddReview page with movieId and movieTitle */}
                <Link
                  className="btn btn-sm btn-primary"
                  to={`/add-review?movieId=${m.id}&movieTitle=${encodeURIComponent(
                    m.title
                  )}`}
                >
                  Rate & Review
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
