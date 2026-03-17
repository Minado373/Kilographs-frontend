import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import logoImg from './assets/Logo.png'
import Profile from './Profile'

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
        <Link to="/profile" className="primary-button">
          Zacznij teraz!
        </Link>
      </header>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App