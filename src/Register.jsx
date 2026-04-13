import "./Register.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const [status, setStatus] = useState({ message: "", type: "" });

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  const showStatus = (msg, type) => {
    setStatus({ message: msg, type });
    if (type !== "success") {
      setTimeout(() => setStatus({ message: "", type: "" }), 4000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });

    if (!name || !email || !password) {
      showStatus("All fields are required", "error");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }), 
      });

      if (!response.ok) {
        const data = await response.json();
        showStatus(data.detail || "Registration failed", "error");
        return;
      }

      showStatus("Account created! Redirecting to login...", "success");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      showStatus("Server connection error", "error");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              placeholder="Full Name"
              className="register-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <input
              type="email"
              placeholder="Email Address"
              className="register-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              className="register-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* POWIADOMIENIE INLINE ZAMIAST ALERT I ERROR-TEXT */}
          {status.message && (
            <div className={`status-message ${status.type}`}>
              {status.type === "success" ? "✅ " : "❌ "}
              {status.message}
            </div>
          )}

          <button type="submit" className="register-button">
            Register
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;