import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, Link } from 'react-router-dom';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export default function Details() {
  const { id } = useParams();
  const location = useLocation(); // ← ADDED: To detect ?t= cache buster
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!TMDB_API_KEY) {
      setError('TMDB API key missing. Check .env file.');
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const [movieRes, reviewRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/reviews/movie/${id}`)
            .catch(() => ({ data: [] }))
        ]);

        setMovie(movieRes.data);
        setReviews(reviewRes.data);
      } catch (err) {
        console.error('Load error:', err);
        setError(
          err.response?.status === 401
            ? 'Invalid TMDB API key.'
            : err.response?.status === 404
            ? 'Movie not found.'
            : 'Failed to load data. Check network or backend.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Optional: Auto-refresh every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [id, location.search]); // ← CRITICAL: Reload when ?t= changes

  if (loading) return <div className="container py-5 text-center">Loading...</div>;
  if (error) return <div className="container py-5 alert alert-danger">{error}</div>;
  if (!movie) return <div className="container py-5 text-center">Movie not found.</div>;

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-4">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="img-fluid rounded shadow"
            />
          ) : (
            <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '500px' }}>
              <span className="text-muted">No Image</span>
            </div>
          )}
        </div>
        <div className="col-md-8">
          <h1 className="display-5 fw-bold">{movie.title}</h1>
          <p className="text-muted">{movie.tagline || ''}</p>
          <p><strong>Release:</strong> {movie.release_date || 'Unknown'}</p>
          <p><strong>TMDB Rating:</strong> {movie.vote_average}/10 ({movie.vote_count} votes)</p>

          {/* USER AVERAGE RATING */}
          <p className="fs-4">
            <strong>User Average:</strong>{' '}
            <span className="text-warning ms-2">
              {avgRating !== '—' ? `${avgRating}/5` : '—'}{' '}
              ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
            </span>
          </p>

          <p>{movie.overview || 'No description available.'}</p>
          <Link
            to={`/add-review?movieId=${id}&movieTitle=${encodeURIComponent(movie.title)}`}
            className="btn btn-primary btn-lg"
          >
            Write a Review
          </Link>
        </div>
      </div>

      <hr className="my-5" />

      <h3>User Reviews ({reviews.length})</h3>
      {reviews.length === 0 ? (
        <p className="text-muted">No reviews yet. Be the first!</p>
      ) : (
        <div className="row">
          {reviews.map(r => (
            <div className="col-md-6 mb-3" key={r.id}>
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between mb-2">
                    <strong>{r.userName || 'Anonymous'}</strong>
                    <span className="text-warning">
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </span>
                  </div>
                  <p className="flex-grow-1">{r.text}</p>
                  <small className="text-muted">
                    {r.createdAt?.toDate?.()?.toLocaleDateString() || 'Just now'}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}