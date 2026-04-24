import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import logoImg from './assets/Logo.png'
import Register from './Register'
import Login from './Login'
import Profile from './Profile'
import Dashboard from './Dashboard'
import Diet from './Diet'
import Workout from './Workout'
import Premium from './Premium'
import Success from './Success'
import Cancel from './Cancel'

function LandingPage() {
  return (
    <div className="main-layout">
      <nav className="navigation-bar">
        <a href="/" className="brand-logo-link">
          <img src={logoImg} alt="KiloGraphs Logo" className="brand-logo-img" />
        </a>
      </nav>

      <header className="hero-section">
        <h2 className="main-heading">Tailor-made Diet and Training.</h2>
        <p className="sub-heading">Generate personalized plans in seconds with AI.</p>
        <Link to="/register" className="primary-button">
          Get started now!
        </Link>


        <div className="login-section">
          <p className="login-text">Already have an account?</p>
          <Link to="/login" className="secondary-button">
            Log in
          </Link>
        </div>
      </header>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/diet" element={<Diet />} />

        <Route path="/workout" element={<Workout />} />
        
        <Route path="/premium" element={<Premium />} />

        <Route path="/success" element={<Success />} />

        <Route path="/cancel" element={<Cancel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App