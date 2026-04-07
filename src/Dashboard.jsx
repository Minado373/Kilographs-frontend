import "./Dashboard.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [isCaloriesExpanded, setIsCaloriesExpanded] = useState(false);
  const [calories, setCalories] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const toggleCalories = () => {
    setIsCaloriesExpanded(!isCaloriesExpanded);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const userName = localStorage.getItem("userName") || "Użytkownik";
  const userId = localStorage.getItem("userId");

  // 🔥 POBIERANIE Z BACKENDU
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${backendUrl}/profile/${userId}`);

        if (!res.ok) throw new Error("Błąd pobierania");

        const data = await res.json();

        if (data && data.calories) {
          setCalories(data.calories);

          // fallback zapis
          localStorage.setItem("userCalories", data.calories);
        } else {
          // fallback z localStorage
          const localCalories = localStorage.getItem("userCalories");
          if (localCalories) setCalories(localCalories);
        }
      } catch (err) {
        console.error(err);

        // fallback z localStorage
        const localCalories = localStorage.getItem("userCalories");
        if (localCalories) setCalories(localCalories);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="sidebar-logo">KiloGraphs</h2>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-button">
            🏠 Dashboard
          </Link>
          <Link to="/diet" className="sidebar-button">
            🥗 Diet
          </Link>
          <Link to="/workout" className="sidebar-button">
            💪 Workouts
          </Link>
          <Link to="/profile" className="sidebar-button">
            👤 Profile
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Welcome, {userName}! 👋</h1>
          <div className="dashboard-date">
            {new Date().toLocaleDateString("en-EN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        <div className="widgets-grid">
          {/* 🔥 KALORIE */}
          <div
            className={`widget-card border-green ${isCaloriesExpanded ? "expanded" : ""}`}
            onClick={toggleCalories}
          >
            <div className="widget-info">
              <p className="widget-label">Calories intake</p>

              <h3 className="widget-value">
                {loading
                  ? "Loading..."
                  : calories
                    ? `${calories} kcal`
                    : "Brak danych"}
              </h3>
            </div>

            {/* 🔽 ROZWINIĘCIE */}
            {isCaloriesExpanded && calories && (
              <div className="macros-container">
                <div className="macro-item">
                  <span className="macro-label">Protein:</span>
                  <span className="macro-value">
                    {Math.round((calories * 0.27) / 4)}g
                  </span>
                </div>
                <div className="macro-item">
                  <span className="macro-label">Carbs:</span>
                  <span className="macro-value">
                    {Math.round((calories * 0.48) / 4)}g
                  </span>
                </div>
                <div className="macro-item">
                  <span className="macro-label">Fat:</span>
                  <span className="macro-value">
                    {Math.round((calories * 0.25) / 9)}g
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 💧 WODA */}
          <div className="widget-card border-blue">
            <div className="widget-info">
              <p className="widget-label">Water</p>
              <h3 className="widget-value">
                {calories ? `${(calories * 0.001).toFixed(1)} L` : "3.0 L"}
              </h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
