import './Dashboard.css'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Dashboard() {
  const [isCaloriesExpanded, setIsCaloriesExpanded] = useState(false);

  const navigate = useNavigate();

  const toggleCalories = () => {
    setIsCaloriesExpanded(!isCaloriesExpanded);
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const userCalories = localStorage.getItem('userCalories') || 'Brak danych';

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
          <button className="sidebar-logout" onClick= {handleLogout} >Logout</button>
        </div>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Welcome, name! 👋</h1>
          <div className="dashboard-date">Date</div>
        </header>

        <div className="widgets-grid">
          <div 
            className={`widget-card border-green ${isCaloriesExpanded ? 'expanded' : ''}`} 
            onClick={toggleCalories}
          >
            <div className="widget-info">
              <p className="widget-label">Calories intake</p>
              <h3 className="widget-value">{userCalories !== 'Brak danych' ? `${userCalories} kcal` : 'Brak danych'}</h3>
            </div>
            
            {isCaloriesExpanded && (
              <div className="macros-container">
                <div className="macro-item">
                  <span className="macro-label">Protein:</span>
                  <span className="macro-value">{userCalories !== 'Brak danych' ? `${Math.round(userCalories * 0.27 / 4)}g` : 'Brak danych'}</span>
                </div>
                <div className="macro-item">
                  <span className="macro-label">Carbs:</span>
                  <span className="macro-value">{userCalories !== 'Brak danych' ? `${Math.round(userCalories * 0.48 / 4)}g` : 'Brak danych'}</span>
                </div>
                <div className="macro-item">
                  <span className="macro-label">Fat:</span>
                  <span className="macro-value">{userCalories !== 'Brak danych' ? `${Math.round(userCalories * 0.25 / 9)}g` : 'Brak danych'}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="widget-card border-blue">
            <div className="widget-info">
              <p className="widget-label">Water</p>
              <h3 className="widget-value">3.0 L</h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard