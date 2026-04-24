import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function Cancel() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', padding: '2rem' }}>
      <div className="empty-state-card" style={{ maxWidth: '600px', width: '100%', borderTop: '6px solid #ef4444', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)' }}>
        <div className="empty-icon">❌</div>
        <h2 style={{ color: '#ef4444', fontSize: '2rem', marginBottom: '1rem' }}>Payment Cancelled</h2>
        <p style={{ fontSize: '1.1rem', color: '#4b5563', marginBottom: '0.5rem' }}>
          It looks like you cancelled the checkout process.
        </p>
        <p style={{ color: '#6b7280' }}>
          Don't worry, your account has not been charged.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          <Link to="/premium" className="generate-btn" style={{ background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', textDecoration: 'none' }}>
            Try Again
          </Link>
          <Link to="/dashboard" className="sidebar-button" style={{ border: '1px solid #d1d5db', textAlign: 'center', width: 'auto' }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cancel;