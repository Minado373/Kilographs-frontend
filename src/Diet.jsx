import './style.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function MealCard({ mealType, mealInfo }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`meal-card ${isOpen ? 'open' : ''}`} 
      onClick={() => setIsOpen(!isOpen)}
      style={{ 
        padding: '1rem', 
        border: '1px solid #eaeaea', 
        borderRadius: '8px', 
        backgroundColor: isOpen ? '#ffffff' : '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        boxShadow: isOpen ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: '#4CAF50', textTransform: 'uppercase', fontSize: '0.8rem', margin: 0, fontWeight: 'bold' }}>
          {mealType}
        </h3>
        <span style={{ fontSize: '0.7rem', color: '#888' }}>
          {isOpen ? '▲ COLLAPSE' : '▼ VIEW DETAILS'}
        </span>
      </div>
      
      <h4 style={{ margin: '8px 0', color: '#111', fontSize: '1.1rem' }}>{mealInfo.name}</h4>
      
      <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: '#666' }}>
        <span>🔥 {mealInfo.calories} kcal</span>
        <span>P: {mealInfo.macros?.p}g</span>
        <span>C: {mealInfo.macros?.c}g</span>
        <span>F: {mealInfo.macros?.f}g</span>
      </div>

      {isOpen && (
        <div style={{ 
          marginTop: '15px', 
          paddingTop: '12px', 
          borderTop: '1px solid #eee',
          animation: 'fadeIn 0.3s ease'
        }}>
          <strong style={{ fontSize: '0.9rem', color: '#333' }}>Ingredients & Quantities:</strong>
          <ul style={{ margin: '8px 0 12px 0', paddingLeft: '1.2rem', color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
            {mealInfo.ingredients?.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
          
          {mealInfo.instructions && (
            <div style={{ backgroundColor: '#f0f7f0', padding: '10px', borderRadius: '6px' }}>
              <strong style={{ fontSize: '0.85rem', color: '#2e7d32' }}>Quick Instructions:</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#555', lineHeight: '1.4' }}>
                {mealInfo.instructions}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Diet() {
  const [isGenerated, setIsGenerated] = useState(false);
  const [dietData, setDietData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingMessages = [
    "Analyzing your profile and goals...",
    "Calculating perfect macronutrients...",
    "Selecting delicious and healthy meals...",
    "Putting it all together...",
    "Almost ready..."
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
    setTimeout(() => setStatus({ message: "", type: "" }), 4000);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const fetchExistingDiet = async () => {
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
          if (data && data.diet) {
            setDietData(data.diet);
            setIsGenerated(true);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchExistingDiet();
  }, [backendUrl, token, userId]);

  const handleGenerateDiet = async () => {
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

      const profileData = await profileRes.json();
      if (!profileData.calories) {
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

      if (!res.ok) throw new Error("Plan generation failed");

      const data = await res.json();
      setDietData(data.diet);
      setIsGenerated(true);
    } catch (err) {
      console.error(err);
      alert("An error occurred while generating the plan.");
    } finally {
      setIsLoading(false);
    }
  };

  const getParsedDiet = () => {
    if (!dietData) return null;
    let data = dietData;
    if (typeof dietData === 'string') {
      try {
        data = JSON.parse(dietData);
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    return data.diet_plan ? data.diet_plan : data;
  };

  const parsedDiet = getParsedDiet();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="sidebar-logo">KiloGraphs</h2>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-button">🏠 Dashboard</Link>
          <Link to="/diet" className="sidebar-button active">🥗 Diet</Link>
          <Link to="/workout" className="sidebar-button">💪 Workouts</Link>
          <Link to="/profile" className="sidebar-button">👤 Profile</Link>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="page-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">Your Daily Diet 🍎</h1>
            <p className="page-subtitle">Manage your nutrition and meal plans</p>
          </div>

          <button 
            className="generate-btn" 
            onClick={handleGenerateDiet}
            disabled={isLoading || isInitialLoading}
          >
            {isLoading ? "Generating..." : (isGenerated ? "Regenerate Plan" : "Generate New Plan")}
          </button>
        </header>

        {status.message && (
          <div className={`status-message ${status.type}`} style={{ maxWidth: '100%', marginBottom: '2rem' }}>
            {status.type === "success" ? "✅ " : "❌ "}
            {status.message}
          </div>
        )}

        {isInitialLoading ? (
          <div className="empty-state-card">
            <h2>⏳ Fetching data...</h2>
            <p>Checking for your existing plan.</p>
          </div>
        ) : isLoading ? (
          <div className="empty-state-card loader-container">
            <div className="spinner"></div>
            <h2>🥗 AI is preparing your plan...</h2>
            <p className="loading-pulse">{loadingMessages[loadingTextIndex]}</p>
          </div>
        ) : !isGenerated ? (
          <div className="empty-state-card">
            <div className="empty-icon">🥗</div>
            <h2>No diet plan generated yet</h2>
            <p>Click the button above to create a personalized meal plan.</p>
          </div>
        ) : (
          <div className="diet-content">
            {parsedDiet ? (
              <div className="diet-days-list">
                {Object.entries(parsedDiet).map(([dayName, meals]) => (
                  <div key={dayName} className="diet-day-card" style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <h2 style={{ textTransform: 'capitalize', borderBottom: '2px solid #f0f0f0', paddingBottom: '12px', color: '#222', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      📅 {dayName.replace('_', ' ')}
                    </h2>
                    
                    <div className="meals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                      {Object.entries(meals).map(([mealType, mealInfo]) => (
                        <MealCard key={mealType} mealType={mealType} mealInfo={mealInfo} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <p style={{ color: 'red', textAlign: 'center' }}>Error displaying the diet plan. Please try again.</p>
            )}
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .meal-card:hover {
          border-color: #4CAF50 !important;
        }
      `}</style>
    </div>
  );
}

export default Diet;