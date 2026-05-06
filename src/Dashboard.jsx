import "./style.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [isCaloriesExpanded, setIsCaloriesExpanded] = useState(false);
  const [calories, setCalories] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  const toggleCalories = () => {
    setIsCaloriesExpanded(!isCaloriesExpanded);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const userName = localStorage.getItem("userName") || "Użytkownik";
  const userId = localStorage.getItem("userId");

  const [isPremium, setIsPremium] = useState(false);

useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        const userRes = await fetch(`${backendUrl}/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setIsPremium(userData.is_premium);
        }

        const profileRes = await fetch(`${backendUrl}/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData?.calories) {
            setCalories(profileData.calories);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate, backendUrl]);

  
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="sidebar-logo">KiloGraphs</h2>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-button">🏠 Dashboard</Link>
          <Link to="/diet" className="sidebar-button">🥗 Diet</Link>
          <Link to="/workout" className="sidebar-button">💪 Workouts</Link>
          <Link to="/profile" className="sidebar-button">👤 Profile</Link>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="page-content">
        <header className="page-header">
          <h1 className="page-title">Welcome, {userName}! 👋</h1>

          <div className="page-date">
            {new Date().toLocaleDateString("en-EN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        <div className="widgets-grid">


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
                    : "-"}
              </h3>
            </div>

            {isCaloriesExpanded && calories && (
              <div className="macros-container">
                <div className="macro-item">
                  <span>Protein:</span>
                  <span>{Math.round((calories * 0.27) / 4)}g</span>
                </div>

                <div className="macro-item">
                  <span>Carbs:</span>
                  <span>{Math.round((calories * 0.48) / 4)}g</span>
                </div>

                <div className="macro-item">
                  <span>Fat:</span>
                  <span>{Math.round((calories * 0.25) / 9)}g</span>
                </div>
              </div>
            )}
          </div>


          <div className="widget-card border-blue">
            <div className="widget-info">
              <p className="widget-label">Water</p>

              <h3 className="widget-value">
                {loading 
                  ? "Loading..." 
                  : calories 
                    ? `${(calories * 0.001).toFixed(1)} L` 
                    : "-"}
              </h3>
            </div>
          </div>

          {!isPremium ? (
            <div 
              className="widget-card border-gold" 
              onClick={() => navigate('/premium')}
            >
              <div className="widget-info">
                <p className="widget-label" style={{ color: '#ca8a04' }}>⭐ KiloGraphs Premium</p>
                <h3 className="widget-value" style={{ fontSize: '1.5rem' }}>No AI Limits</h3>
                <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                  Click here to explore the benefits of our subscription.
                </p>
              </div>
            </div>
          ) : (
            <div className="widget-card border-green">
              <div className="widget-info">
                <p className="widget-label" style={{ color: '#16a34a' }}>👑 Your Status</p>
                <h3 className="widget-value" style={{ fontSize: '1.5rem' }}>Premium Active</h3>
                <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                  Thank you for your support! You have unlimited access.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Dashboard;