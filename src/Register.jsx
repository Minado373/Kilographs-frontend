import "./Register.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Wszystkie pola są wymagane");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }), // <-- wysyłamy name + email + password
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Błąd rejestracji");
        return;
      }

      alert("Konto utworzone!");
      navigate("/login");
    } catch (err) {
      setError("Błąd serwera");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Utwórz konto</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Imię"
            className="register-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Hasło"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="register-button">
            Zarejestruj
          </button>
        </form>

        <p className="register-footer">
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
