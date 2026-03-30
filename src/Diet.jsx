import './Dashboard.css'; 
import './Diet.css';   
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Diet() {
  const [isGenerated, setIsGenerated] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleGenerateDiet = () => {
    setIsGenerated(true);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar - taki sam jak w Dashboard */}
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

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Your Daily Diet 🍎</h1>
            <p className="dashboard-subtitle">Manage your nutrition and meal plans</p>
          </div>
          <button className="generate-btn" onClick={handleGenerateDiet}>
            Generate New Plan
          </button>
        </header>

        {!isGenerated ? (
          <div className="empty-state-card">
            <div className="empty-icon">🥗</div>
            <h2>No diet plan generated yet</h2>
            <p>Click the button above to create a personalized meal plan based on your goals.</p>
          </div>
        ) : (
          <div className="diet-grid">
            {/* Przykładowe karty posiłków */}
            {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((meal, index) => (
              <div key={index} className="meal-card animation-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Diet;
