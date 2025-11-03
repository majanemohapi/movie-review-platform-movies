// src/pages/MyReviews.js
import { useState, useEffect } from 'react';

const mockMovies = [
  { id: 1, title: 'Inception', year: 2010, genre: 'Sci-Fi' },
  { id: 2, title: 'The Shawshank Redemption', year: 1994, genre: 'Drama' },
  { id: 3, title: 'The Dark Knight', year: 2008, genre: 'Action' },
  { id: 4, title: 'Pulp Fiction', year: 1994, genre: 'Crime' },
  { id: 5, title: 'Forrest Gump', year: 1994, genre: 'Drama' },
];

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', rating: 5, review: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userReviews') || '[]');
    const all = JSON.parse(localStorage.getItem('allReviews') || '[]');
    setReviews(user);
    setAllReviews(all);
  }, []);

  useEffect(() => {
    localStorage.setItem('userReviews', JSON.stringify(reviews));
    localStorage.setItem('allReviews', JSON.stringify(allReviews));
  }, [reviews, allReviews]);

  const startEdit = (review) => {
    setEditing(review);
    setForm({ title: review.title, rating: review.rating, review: review.review });
    setShowForm(true);
  };

  const saveEdit = () => {
    const updated = {
      ...editing,
      ...form,
      rating: Number(form.rating),
      lastUpdated: new Date().toISOString()
    };

    setReviews(prev => prev.map(r => r.id === editing.id ? updated : r));
    setAllReviews(prev => prev.map(r => r.id === editing.id ? updated : r));
    setEditing(null);
    setForm({ title: '', rating: 5, review: '' });
    setShowForm(false);
  };

  const deleteReview = (id) => {
    if (!window.confirm('Delete this review?')) return;
    setReviews(prev => prev.filter(r => r.id !== id));
    setAllReviews(prev => prev.filter(r => r.id !== id));
  };

  const cancel = () => {
    setEditing(null);
    setForm({ title: '', rating: 5, review: '' });
    setShowForm(false);
  };

  const renderStars = (n) => '⭐'.repeat(n) + '☆'.repeat(5 - n);

  const others = allReviews.filter(r => r.userId !== 'current-user');

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Reviews</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Write New Review
        </button>
      </div>

      {showForm && (
        <div className="card mb-5 p-4">
          <h3>{editing ? 'Edit Review' : 'New Review'}</h3>
          <div className="mb-3">
            <label>Movie</label>
            <input className="form-control" value={editing?.movieTitle || 'From AddReview'} disabled />
          </div>
          <div className="mb-3">
            <label>Title</label>
            <input
              className="form-control"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label>Rating</label>
            <select
              className="form-select"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            >
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label>Review</label>
            <textarea
              className="form-control"
              rows="5"
              value={form.review}
              onChange={(e) => setForm({ ...form, review: e.target.value })}
              required
            />
          </div>
          <div>
            <button className="btn btn-success me-2" onClick={editing ? saveEdit : null}>
              {editing ? 'Update' : 'Save'}
            </button>
            <button className="btn btn-secondary" onClick={cancel}>Cancel</button>
          </div>
        </div>
      )}

      <h2>Your Reviews ({reviews.length})</h2>
      {reviews.length === 0 ? (
        <div className="text-center py-5">
          <p>No reviews yet. Write one!</p>
        </div>
      ) : (
        <div className="row">
          {reviews.map(r => (
            <div key={r.id} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5>{r.movieTitle}</h5>
                  <h6 className="text-primary">{r.title}</h6>
                  <p>{renderStars(r.rating)} ({r.rating}/5)</p>
                  <p>{r.review}</p>
                  <small>Updated: {new Date(r.lastUpdated).toLocaleDateString()}</small>
                </div>
                <div className="card-footer d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(r)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteReview(r.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-5">Others' Reviews ({others.length})</h2>
      {others.length === 0 ? (
        <p>No reviews from others yet.</p>
      ) : (
        <div className="row">
          {others.map(r => (
            <div key={r.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h6>{r.movieTitle}</h6>
                  <p><strong>{r.title}</strong> by {r.author}</p>
                  <p>{renderStars(r.rating)}</p>
                  <p>{r.review}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}