import './style.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Premium() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${backendUrl}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        alert("Failed to create checkout session.");
      }
    } catch (error) {
      console.error("Stripe error:", error);
      alert("An error occurred while connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="page-content premium-page-content">
        <div className="premium-hero">
          <h1 className="premium-title">Upgrade to <span className="text-gold">Premium</span> ⭐</h1>
          <p className="premium-subtitle">
            Unlock the full potential of AI and reach your fitness goals faster.
          </p>
        </div>

        <div className="premium-features">
          <div className="feature-card">
            <div className="feature-icon">♾️</div>
            <h3>Unlimited Generation</h3>
            <p>Free accounts can generate a plan once every 7 days. With Premium, you can regenerate whenever you want!</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Faster AI Processing</h3>
            <p>Your requests get top priority on our servers, ensuring lightning-fast plan generation.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Early Access</h3>
            <p>Get access to upcoming new features like progress tracking and smart recipes before anyone else.</p>
          </div>
        </div>

        <div className="premium-cta-section">
          <div className="price-tag">
            <h2>49.99 PLN <span className="price-period">/ month</span></h2>
            <p>Cancel anytime.</p>
          </div>
          
          <button 
            className="btn-subscribe" 
            onClick={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? "Redirecting..." : "Subscribe Now"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Premium;