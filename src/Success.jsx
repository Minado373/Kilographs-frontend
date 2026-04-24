import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './style.css';

function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("isPremium", "true");

    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', padding: '2rem' }}>
      <div className="empty-state-card" style={{ maxWidth: '600px', width: '100%', borderTop: '6px solid #16a34a', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)' }}>
        <div className="empty-icon">🎉</div>
        <h2 style={{ color: '#16a34a', fontSize: '2rem', marginBottom: '1rem' }}>Payment Successful!</h2>
        <p style={{ fontSize: '1.1rem', color: '#4b5563', marginBottom: '0.5rem' }}>
          Thank you for subscribing to KiloGraphs Premium.
        </p>
        <p style={{ color: '#6b7280' }}>
          Your account has been upgraded, and you now have unlimited access to AI generation.
        </p>
        
        <div style={{ marginTop: '2.5rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '1rem' }}>
            Redirecting to your dashboard in a few seconds...
          </p>
          <Link to="/dashboard" className="generate-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Go to Dashboard Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Success;