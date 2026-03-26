import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import logoImg from './assets/Logo.png'
import Register from './Register'
import Login from './Login'
import Profile from './Profile'
import Dashboard from './Dashboard'
import Diet from './Diet'
import Workout from './Workout'

function LandingPage() {
  return (
    <div className="main-layout">
      <nav className="navigation-bar">
        <a href="/" className="brand-logo-link">
          <img src={logoImg} alt="KiloGraphs Logo" className="brand-logo-img" />
        </a>
      </nav>

      <header className="hero-section">
        <h2 className="main-heading">Dieta i Trening uszyte na miarę.</h2>
        <p className="sub-heading">Generuj spersonalizowane plany w kilka sekund dzięki AI.</p>
        <Link to="/register" className="primary-button">
          Zacznij teraz!
        </Link>


        <div className="login-section">
          <p className="login-text">Masz już konto?</p>
          <Link to="/login" className="secondary-button">
            Zaloguj się
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
      </Routes>
    </BrowserRouter>
  )
}

export default App