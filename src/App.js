import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Details from "./pages/Details";
import AddReview from "./pages/AddReview";
import MyReviews from "./pages/MyReviews";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password) return setMsg("Fill all fields!");

    localStorage.setItem("user", JSON.stringify({ email, password }));
    setMsg("Welcome! Logging in...");
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
    }}>
      <div style={{
        background: "white", padding: "3rem 2rem", borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)", width: "100%", maxWidth: "420px",
        textAlign: "center"
      }}>
        <h1 style={{ marginBottom: "2rem", color: "#333" }}>Join Movie Reviews</h1>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={btnStyle}>Register & Enter</button>
        </form>
        {msg && (
          <p style={{
            marginTop: "1rem",
            color: msg.includes("Welcome") ? "green" : "red",
            fontWeight: "bold"
          }}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "14px", margin: "12px 0", borderRadius: "8px",
  border: "2px solid #ddd", fontSize: "1rem", outline: "none"
};

const btnStyle = {
  width: "100%", padding: "14px", background: "#667eea", color: "white",
  border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "bold",
  cursor: "pointer", marginTop: "10px"
};

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  if (!user) {
    return <RegisterPage />;
  }

  // SAFE: Only show username if email exists
  const username = user.email ? user.email.split("@")[0] : "User";

  return (
    <>
      <style>
        {`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fa; color: #333; }
          .app-container { min-height: 100vh; display: flex; flex-direction: column; }
          .navbar { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important; padding: 1rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .nav-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
          .navbar-brand { font-size: 1.8rem !important; font-weight: 800; color: white !important; text-decoration: none; display: flex; align-items: center; gap: 10px; }
          .navbar-brand:hover { color: #ffd700 !important; }
          .nav-links { display: flex; list-style: none; gap: 2rem; align-items: center; }
          .nav-link { color: white !important; text-decoration: none; font-weight: 600; font-size: 1.1rem; padding: 8px 16px; border-radius: 8px; transition: 0.3s; }
          .nav-link:hover { background: rgba(255,255,255,0.2); color: #ffd700 !important; }
          .main-content { flex: 1; padding: 2rem 0; }
          .main-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
          .footer { background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: white; text-align: center; padding: 2rem 0; margin-top: auto; }
          .footer-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
          .footer-links { display: flex; justify-content: center; gap: 2rem; margin-top: 1rem; flex-wrap: wrap; }
          .footer-link { color: #ecf0f1; text-decoration: none; }
          .footer-link:hover { color: #ffd700; }
          .logout-btn { background: rgba(255,255,255,0.2); color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; }
          .logout-btn:hover { background: rgba(255,255,255,0.4); }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .main-content { animation: fadeIn 0.5s ease-in; }
          .nav-icon { font-size: 1.2em; }
          @media (max-width: 768px) { .nav-container { flex-direction: column; gap: 1rem; } .nav-links { gap: 1rem; flex-wrap: wrap; justify-content: center; } }
        `}
      </style>

      <BrowserRouter basename="/movie-review-platform-movies">
        <div className="app-container">
          <nav className="navbar">
            <div className="nav-container">
              <Link className="navbar-brand" to="/">
                Movie Reviews
              </Link>
              <ul className="nav-links">
                <li><Link className="nav-link" to="/search">Search</Link></li>
                <li><Link className="nav-link" to="/add-review">Add Review</Link></li>
                <li><Link className="nav-link" to="/my-reviews">My Reviews</Link></li>
                <li>
                  <button onClick={logout} className="logout-btn">
                    Logout ({username})
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          <div className="main-content">
            <div className="main-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/movie/:id" element={<Details />} />
                <Route path="/add-review" element={<AddReview />} />
                <Route path="/my-reviews" element={<MyReviews />} />
              </Routes>
            </div>
          </div>

          <footer className="footer">
            <div className="footer-content">
              <p>© 2024 Movie Review Platform</p>
              <p>Logged in as: <strong>{user.email}</strong></p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </>
  );
}