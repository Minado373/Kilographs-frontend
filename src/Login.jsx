import "./Login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Testowy login admina
      if (email === "admin@email.com" && password === "1234") {
        localStorage.setItem("userId", "1"); // <-- DODANE: ID dla admina
        localStorage.setItem("userName", "Admin");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userCalories", "2000");
        navigate("/dashboard");
        return;
      }

      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Błąd logowania");
        return;
      }

      // KLUCZOWA POPRAWKA: Zapisujemy dane zwrócone z FastAPI
      if (data.user_id) {
        localStorage.setItem("userId", data.user_id); // To ID jest wymagane przez Profile.js
        localStorage.setItem("userName", data.name);
        navigate("/dashboard");
      } else {
        setError("Błąd: Serwer nie zwrócił ID użytkownika");
      }
    } catch (err) {
      setError("Błąd połączenia z serwerem");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Zaloguj się</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Hasło"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="login-button">
            Zaloguj
          </button>
        </form>
        <p className="login-footer">
          Nie masz konta? <Link to="/register">Zarejestruj się</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
