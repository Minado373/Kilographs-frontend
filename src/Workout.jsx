import './style.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ExerciseCard({ ex, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`exercise-card animation-slide-in ${isOpen ? 'active' : ''}`}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        cursor: 'pointer',
        height: 'auto',
        minHeight: 'fit-content'
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="exercise-info" style={{ width: '100%' }}>
        <div className="exercise-main" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="exercise-number" style={{ margin: 0 }}>#{index + 1}</span>
            <h3 className="exercise-name" style={{ margin: 0 }}>{ex.exercise_name}</h3>
          </div>
          
          <div className={`difficulty-badge ${ex.difficulty ? ex.difficulty.toLowerCase() : 'medium'}`} style={{ position: 'relative', top: '0', right: '0', margin: '0' }}>
            {ex.difficulty || 'Medium'}
          </div>
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

        {isOpen && (
          <div style={{ 
            marginTop: '15px', 
            paddingTop: '12px', 
            borderTop: '1px solid #eee', 
            fontSize: '0.85rem', 
            color: '#666',
            lineHeight: '1.4',
            animation: 'fadeIn 0.3s ease'
          }}>
            <strong style={{ color: '#333' }}>How to perform:</strong> {ex.description || "No description provided."}
          </div>
        )}
      </div>
    </div>
  );
}

function Workout() {
  const [isGenerated, setIsGenerated] = useState(false);
  const [workoutData, setWorkoutData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingMessages = [
    "Analyzing your profile and goals...",
    "Selecting optimal exercises...",
    "Calculating sets, reps, and weights...",
    "Structuring your workout routine...",
    "Almost ready to sweat..."
  ];

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    let interval;
    if (isLoading) {
      setLoadingTextIndex(0);
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const showStatus = (msg, type) => {
    setStatus({ message: msg, type });
    setTimeout(() => setStatus({ message: "", type: "" }), 6000);
  };

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
      const profileRes = await fetch(`${backendUrl}/profile/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileRes.ok) {
        showStatus("You need to complete your profile first.", "error");
        setIsLoading(false);
        return; 
      }

      const res = await fetch(`${backendUrl}/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 429) {
          const errorData = await res.json();
          showStatus(errorData.detail, "error");
          setIsLoading(false);
          return;
        }
        throw new Error("Workout generation failed");
      }

      const data = await res.json();
      setWorkoutData(data.training);
      setIsGenerated(true);
      showStatus("Training generated successfully!", "success");
    } catch (err) {
      console.error(err);
      showStatus("An error occurred while generating the workout. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getParsedWorkout = () => {
    if (!workoutData) return null;
    let data = workoutData;
    if (typeof workoutData === 'string') {
      try {
        data = JSON.parse(workoutData);
      } catch (e) {
        console.error("Failed to parse workout JSON:", e);
        return null;
      }
    }
    return data;
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

        {status.message && (
          <div className={`status-message ${status.type}`} style={{ maxWidth: '100%', marginBottom: '2rem' }}>
            {status.type === "success" ? "✅ " : "❌ "}
            {status.message}
          </div>
        )}

        {isInitialLoading ? (
          <div className="empty-state-card workout-empty">
            <h2>⏳ Fetching data...</h2>
            <p>Checking for your existing workout plan.</p>
          </div>
        ) : isLoading ? (
          <div className="empty-state-card workout-empty loader-container">
            <div className="spinner"></div>
            <h2>🏋️‍♂️ AI is preparing your workout...</h2>
            <p className="loading-pulse">{loadingMessages[loadingTextIndex]}</p>
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
                      <ExerciseCard key={index} ex={ex} index={index} />
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Workout;