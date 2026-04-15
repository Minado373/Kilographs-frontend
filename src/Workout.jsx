import './style.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Workout() {
  const [isGenerated, setIsGenerated] = useState(false);
  const [workoutData, setWorkoutData] = useState(null);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleGenerateWorkout = async () => {
    setIsGenerated(true);

    try {
      const res = await fetch(`${backendUrl}/workout/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Błąd pobierania workoutu");

      const data = await res.json();
      setWorkoutData(data);

    } catch (err) {
      console.error(err);
      setWorkoutData(null);
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="sidebar-logo">KiloGraphs</h2>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-button">🏠 Dashboard</Link>
          <Link to="/diet" className="sidebar-button">🥗 Diet</Link>
          <Link to="/workout" className="sidebar-button active">💪 Workouts</Link>
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
          <div>
            <h1 className="page-title">Today's Workout 🔥</h1>
            <p className="page-subtitle">
              Crush your goals with a personalized routine
            </p>
          </div>

          <button className="generate-workout-btn" onClick={handleGenerateWorkout}>
            Generate Training
          </button>
        </header>

        {!isGenerated ? (
          <div className="empty-state-card workout-empty">
            <div className="empty-icon">🏋️‍♂️</div>
            <h2>No workout planned yet</h2>
            <p>Ready to sweat? Click the button to get your custom training session.</p>
          </div>
        ) : (
          <div className="workout-list">

            {/* 🔥 jeśli backend zwróci dane */}
            {workoutData ? (
              workoutData.exercises?.map((ex, index) => (
                <div
                  key={index}
                  className="exercise-card animation-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="exercise-info">
                    <div className="exercise-main">
                      <span className="exercise-number">
                        #{index + 1}
                      </span>
                      <h3 className="exercise-name">{ex.name}</h3>
                    </div>

                    <div className="exercise-stats">
                      <div className="stat-box">
                        <span className="stat-label">Sets</span>
                        <span className="stat-value">{ex.sets}</span>
                      </div>

                      <div className="stat-box">
                        <span className="stat-label">Reps</span>
                        <span className="stat-value">{ex.reps}</span>
                      </div>

                      <div className="stat-box">
                        <span className="stat-label">Rest</span>
                        <span className="stat-value">{ex.rest}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`difficulty-badge ${ex.difficulty?.toLowerCase()}`}>
                    {ex.difficulty}
                  </div>
                </div>
              ))
            ) : (
              [
                { name: 'Barbell Squats', sets: '4', reps: '8-10', rest: '90s', difficulty: 'Hard' },
                { name: 'Bench Press', sets: '3', reps: '10', rest: '60s', difficulty: 'Medium' },
                { name: 'Pull-ups', sets: '3', reps: 'Max', rest: '60s', difficulty: 'Medium' },
                { name: 'Plank', sets: '3', reps: '60s', rest: '30s', difficulty: 'Easy' }
              ].map((ex, index) => (
                <div
                  key={index}
                  className="exercise-card animation-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="exercise-info">
                    <div className="exercise-main">
                      <span className="exercise-number">
                        #0{index + 1}
                      </span>
                      <h3 className="exercise-name">{ex.name}</h3>
                    </div>

                    <div className="exercise-stats">
                      <div className="stat-box">
                        <span className="stat-label">Sets</span>
                        <span className="stat-value">{ex.sets}</span>
                      </div>

                      <div className="stat-box">
                        <span className="stat-label">Reps</span>
                        <span className="stat-value">{ex.reps}</span>
                      </div>

                      <div className="stat-box">
                        <span className="stat-label">Rest</span>
                        <span className="stat-value">{ex.rest}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`difficulty-badge ${ex.difficulty.toLowerCase()}`}>
                    {ex.difficulty}
                  </div>
                </div>
              ))
            )}

          </div>
        )}
      </main>
    </div>
  );
}

export default Workout;