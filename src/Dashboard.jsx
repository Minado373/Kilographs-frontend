import './Dashboard.css'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [isCaloriesExpanded, setIsCaloriesExpanded] = useState(false);

  const toggleCalories = () => {
    setIsCaloriesExpanded(!isCaloriesExpanded);
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="sidebar-logo">FitApp</h2>
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
          <button className="sidebar-logout">Logout</button>
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
              <h3 className="widget-value">2,500 kcal</h3>
            </div>
            
            {isCaloriesExpanded && (
              <div className="macros-container">
                <div className="macro-item">
                  <span className="macro-label">Protein:</span>
                  <span className="macro-value">120g</span>
                </div>
                <div className="macro-item">
                  <span className="macro-label">Carbs:</span>
                  <span className="macro-value">250g</span>
                </div>
                <div className="macro-item">
                  <span className="macro-label">Fat:</span>
                  <span className="macro-value">65g</span>
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