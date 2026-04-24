import './style.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Workout() {
  const [isGenerated, setIsGenerated] = useState(false);
  const [workoutData, setWorkoutData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const fetchExistingWorkout = async () => {
      if (!userId || !token) {
        setIsInitialLoading(false);
        return;
      }

      try {
        const res = await fetch(`${backendUrl}/my-plan/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.training) {
            setWorkoutData(data.training);
            setIsGenerated(true);
          }
        }
      } catch (err) {
        console.error("Error checking existing workout plan:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchExistingWorkout();
  }, [backendUrl, token, userId]);

  const handleGenerateWorkout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${backendUrl}/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Workout generation failed");

      const data = await res.json();
      setWorkoutData(data.training);
      setIsGenerated(true);
    } catch (err) {
      console.error(err);
      alert("An error occurred while generating the workout.");
    } finally {
      setIsLoading(false);
    }
  };

  const getParsedWorkout = () => {
    if (!workoutData) return null;
    if (typeof workoutData === 'object') return workoutData;
    try {
      return JSON.parse(workoutData);
    } catch (e) {
      console.error("Failed to parse workout JSON:", e);
      return null;
    }
  };

  const parsedWorkout = getParsedWorkout();

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
          <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="page-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">Today's Workout 🔥</h1>
            <p className="page-subtitle">Crush your goals with a personalized routine</p>
          </div>

          <button 
            className="generate-workout-btn" 
            onClick={handleGenerateWorkout}
            disabled={isLoading || isInitialLoading}
            style={{ opacity: (isLoading || isInitialLoading) ? 0.7 : 1, cursor: (isLoading || isInitialLoading) ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? "Generating..." : (isGenerated ? "Regenerate Training" : "Generate Training")}
          </button>
        </header>

        {isInitialLoading ? (
          <div className="empty-state-card workout-empty">
            <h2>⏳ Fetching data...</h2>
            <p>Checking for your existing workout plan.</p>
          </div>
        ) : isLoading ? (
          <div className="empty-state-card workout-empty">
            <h2>🏋️‍♂️ AI is preparing your workout...</h2>
            <p>This will only take a moment. Please do not refresh.</p>
          </div>
        ) : !isGenerated ? (
          <div className="empty-state-card workout-empty">
            <div className="empty-icon">🏋️‍♂️</div>
            <h2>No workout planned yet</h2>
            <p>Ready to sweat? Click the button to get your custom training session.</p>
          </div>
        ) : (
          <div className="workouts-container">
            {parsedWorkout ? (
              Object.entries(parsedWorkout).map(([workoutName, exercises]) => (
                <div key={workoutName} className="workout-day-card" style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <h2 style={{ textTransform: 'capitalize', borderBottom: '2px solid #eee', paddingBottom: '10px', color: '#333', marginBottom: '20px' }}>
                    {workoutName.replace('_', ' ')}
                  </h2>
                  
                  <div className="workout-list">
                    {exercises.map((ex, index) => (
                      <div
                        key={index}
                        className="exercise-card animation-slide-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="exercise-info">
                          <div className="exercise-main">
                            <span className="exercise-number">#{index + 1}</span>
                            <h3 className="exercise-name">{ex.exercise_name}</h3> 
                          </div>

                          <div className="exercise-stats">
                            <div className="stat-box">
                              <span className="stat-label">Weight</span>
                              <span className="stat-value">{ex.weight}</span>
                            </div>
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

                        <div className={`difficulty-badge ${ex.difficulty ? ex.difficulty.toLowerCase() : 'medium'}`}>
                          {ex.difficulty || 'Medium'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'red', textAlign: 'center' }}>Error displaying the workout plan. Please try again.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Workout;