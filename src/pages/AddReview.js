// src/pages/AddReview.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AddReview() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const movieId = params.get('movieId');
  const movieTitle = params.get('movieTitle');

  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!movieId || !title || !text) return alert('Fill all fields');

    setLoading(true);

    const newReview = {
      id: Date.now(),
      movieId: parseInt(movieId),
      movieTitle: decodeURIComponent(movieTitle),
      title,
      rating: Number(rating),
      review: text,
      author: 'You',
      userId: 'current-user',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    // SAVE TO LOCALSTORAGE
    const userReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
    const allReviews = JSON.parse(localStorage.getItem('allReviews') || '[]');

    localStorage.setItem('userReviews', JSON.stringify([...userReviews, newReview]));
    localStorage.setItem('allReviews', JSON.stringify([...allReviews, newReview]));

    setLoading(false);
    alert('Review saved!');
    navigate('/movie-review-platform-movies/my-reviews');
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Write Review</h1>
      <div className="card mb-4">
        <div className="card-body">
          <p><strong>Movie:</strong> {decodeURIComponent(movieTitle)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Review Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Mind-Blowing Masterpiece"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Rating</label>
          <select className="form-select" value={rating} onChange={(e) => setRating(e.target.value)}>
            {[5,4,3,2,1].map(n => (
              <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Your Review</label>
          <textarea
            className="form-control"
            rows="6"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What did you think?"
            required
          />
        </div>

        <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
          {loading ? 'Saving...' : 'Publish Review'}
        </button>
      </form>
    </div>
  );
}