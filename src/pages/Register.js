import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please fill all fields");
      return;
    }
    // Save user
    localStorage.setItem("user", JSON.stringify({ email, password }));
    setMessage("Registered! Logging you in...");
    setTimeout(() => navigate("/movie-review-platform-movies"), 1000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div style={{
        background: "white",
        padding: "3rem 2rem",
        borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "420px",
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
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Register & Enter
          </button>
        </form>
        {message && <p style={{ marginTop: "1rem", color: message.includes("!") ? "green" : "red" }}>{message}</p>}
        <p style={{ marginTop: "1.5rem", color: "#666", fontSize: "0.9rem" }}>
          Already registered? Just refresh — auto-login!
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  margin: "10px 0",
  borderRadius: "8px",
  border: "2px solid #ddd",
  fontSize: "1rem",
  outline: "none",
  transition: "0.3s"
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "10px",
  background: "#667eea",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "1.1rem",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s"
};
buttonStyle[":hover"] = { background: "#5a67d8" };