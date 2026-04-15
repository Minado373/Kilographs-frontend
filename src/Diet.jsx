import './style.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Diet() {
  const [isGenerated, setIsGenerated] = useState(false);
  const [dietData, setDietData] = useState(null);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleGenerateDiet = async () => {
    setIsGenerated(true);


    try {
      const res = await fetch(`${backendUrl}/diet/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Błąd pobierania diety");

      const data = await res.json();
      setDietData(data);

    } catch (err) {
      console.error(err);
      setDietData(null);
    }
  };

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

          <button className="generate-btn" onClick={handleGenerateDiet}>
            Generate New Plan
          </button>
        </header>

        {!isGenerated ? (
          <div className="empty-state-card">
            <div className="empty-icon">🥗</div>
            <h2>No diet plan generated yet</h2>
            <p>Click the button above to create a personalized meal plan.</p>
          </div>
        ) : (
          <div className="diet-grid">

            {/* jeśli backend zwróci dane */}
            {dietData ? (
              dietData.meals?.map((meal, index) => (
                <div key={index} className="meal-card">
                  <div className="meal-header">
                    <span className="meal-type">{meal.type}</span>
                    <span className="meal-calories">
                      ~{meal.calories} kcal
                    </span>
                  </div>

                  <h3 className="meal-name">{meal.name}</h3>

                  <ul className="meal-ingredients">
                    {meal.ingredients?.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>

                  <div className="meal-footer">
                    <span className="macro-tag protein">P: {meal.protein}g</span>
                    <span className="macro-tag carbs">C: {meal.carbs}g</span>
                    <span className="macro-tag fats">F: {meal.fat}g</span>
                  </div>
                </div>
              ))
            ) : (

              ['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((meal, index) => (
                <div key={index} className="meal-card">
                  <div className="meal-header">
                    <span className="meal-type">{meal}</span>
                    <span className="meal-calories">~500 kcal</span>
                  </div>

                  <h3 className="meal-name">Sample Healthy Recipe {index + 1}</h3>

                  <ul className="meal-ingredients">
                    <li>Ingredient 1</li>
                    <li>Ingredient 2</li>
                    <li>Ingredient 3</li>
                  </ul>

                  <div className="meal-footer">
                    <span className="macro-tag protein">P: 30g</span>
                    <span className="macro-tag carbs">C: 50g</span>
                    <span className="macro-tag fats">F: 15g</span>
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

export default Diet;