import './style.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Diet() {
  const [isGenerated, setIsGenerated] = useState(false);
  const [dietData, setDietData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

useEffect(() => {
    const fetchExistingDiet = async () => {
      if (!userId || !token) return;

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
        console.error("Błąd podczas sprawdzania istniejącego planu:", err);
      }
    };

    fetchExistingDiet();
  }, [backendUrl, token, userId]);

  const handleGenerateDiet = async () => {
    setIsLoading(true);
    setIsGenerated(true);

    try {
      const res = await fetch(`${backendUrl}/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Błąd generowania planu");

      const data = await res.json();
      setDietData(data.diet);

    } catch (err) {
      console.error(err);
      setDietData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getParsedDiet = () => {
    if (!dietData) return null;
    if (typeof dietData === 'object') return dietData;
    try {
      return JSON.parse(dietData);
    } catch (e) {
      console.error("Nie udało się sparsować JSONa diety:", e);
      return null;
    }
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
          <button className="sidebar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="page-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">Your Daily Diet 🍎</h1>
            <p className="page-subtitle">
              Manage your nutrition and meal plans
            </p>
          </div>

          <button 
            className="generate-btn" 
            onClick={handleGenerateDiet}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : (isGenerated ? "Regenerate Plan" : "Generate New Plan")}
          </button>
        </header>

        {isLoading ? (
          <div className="empty-state-card">
            <h2>⏳ AI przygotowuje Twój plan...</h2>
            <p>Może to potrwać kilka sekund.</p>
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
                  <div key={dayName} className="diet-day-card" style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ textTransform: 'capitalize', borderBottom: '2px solid #eee', paddingBottom: '10px', color: '#333' }}>
                      {dayName.replace('_', ' ')}
                    </h2>
                    
                    <div className="meals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                      {Object.entries(meals).map(([mealType, mealInfo]) => (
                        <div key={mealType} className="meal-card" style={{ padding: '1rem', border: '1px solid #eaeaea', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                          <h3 style={{ color: '#4CAF50', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '5px' }}>{mealType}</h3>
                          <h4 style={{ margin: '0 0 10px 0', color: '#111' }}>{mealInfo.name}</h4>
                          
                          <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
                            <span>🔥 {mealInfo.calories} kcal</span>
                            <span>P: {mealInfo.macros?.p}g</span>
                            <span>C: {mealInfo.macros?.c}g</span>
                            <span>F: {mealInfo.macros?.f}g</span>
                          </div>

                          <div className="ingredients" style={{ fontSize: '0.85rem' }}>
                            <strong>Ingredients:</strong>
                            <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', color: '#555' }}>
                              {mealInfo.ingredients?.map((ing, idx) => (
                                <li key={idx}>{ing}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <p style={{ color: 'red' }}>Wystąpił błąd podczas ładowania planu diety.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Diet;