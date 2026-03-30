import './Profile.css'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Profile() {
  const navigate = useNavigate();

  const [gender, setGender] = useState('Mężczyzna');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState('Redukcja');
  const [activity, setActivity] = useState('0');
  const [result, setResult] = useState(null);

  const handleLogout = () => {
    try {
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const calculateCalories = (e) => {
    e.preventDefault();

    if (!age || !weight || !height) {
      return;
    }

    const palValues = [1.2, 1.4, 1.6, 1.8];
    const pal = palValues[parseInt(activity)];
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    let bmr = gender === "Mężczyzna" 
      ? (10 * w + 6.25 * h - 5 * a + 5) 
      : (10 * w + 6.25 * h - 5 * a - 161);

    let tdee = bmr * pal;

    if (goal === "Redukcja") tdee -= 300;
    if (goal === "Masa") tdee += 300;

    const finalCalories = Math.round(tdee);

    localStorage.setItem('userCalories', finalCalories);
    setResult(finalCalories);
  };

  return (
    <div className="profile-page-wrapper">
      
      <aside className="app-sidebar">
        <h2 className="sidebar-logo">KiloGraphs</h2>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-button">🏠 Dashboard</Link>
          <Link to="/diet" className="sidebar-button">🥗 Diet</Link>
          <Link to="/workout" className="sidebar-button">💪 Workouts</Link>
          <Link to="/profile" className="sidebar-button active">👤 Profile</Link>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="profile-main-content">
        <header className="profile-header">
          <h1 className="profile-title">Ustawienia Profilu</h1>
          <p className="profile-subtitle">Uzupełnij dane, aby AI przygotowało Twój plan.</p>
        </header>

        <section className="profile-card">
          <form onSubmit={calculateCalories}>
            <div className="profile-grid">
              <div className="input-group">
                <label>Płeć</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option>Mężczyzna</option>
                  <option>Kobieta</option>
                </select>
              </div>
              <div className="input-group">
                <label>Wiek</label>
                <input type="number" placeholder="np. 25" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Waga (kg)</label>
                <input type="number" placeholder="np. 80" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Wzrost (cm)</label>
                <input type="number" placeholder="np. 185" value={height} onChange={(e) => setHeight(e.target.value)} />
              </div>
            </div>

            <hr className="profile-divider" />

            <div className="input-group">
              <label>Cel sylwetkowy</label>
              <div className="radio-grid">
                {['Redukcja', 'Utrzymanie', 'Masa'].map((option) => (
                  <label key={option} className={`radio-card ${goal === option ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="goal" 
                      value={option}
                      checked={goal === option}
                      onChange={(e) => setGoal(e.target.value)}
                      className="hidden-radio"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="input-group" style={{ marginTop: '1.5rem' }}>
              <label>Poziom aktywności fizycznej</label>
              <select value={activity} onChange={(e) => setActivity(e.target.value)}>
                <option value="0">Brak aktywności (praca siedząca)</option>
                <option value="1">Niska (1-2 treningi w tygodniu)</option>
                <option value="2">Średnia (3-4 treningi w tygodniu)</option>
                <option value="3">Wysoka (codzienne treningi)</option>
              </select>
            </div>

            <div className="profile-actions">
              <button type="submit" className="btn-save">Zapisz i Oblicz kalorie  </button>
            </div>
          </form>
        </section>

        {result && (
          <section className="profile-card" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
              Cel wyliczony pomyślnie! 🎉
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#4b5563' }}>
              Twoje spersonalizowane zapotrzebowanie wynosi: <strong style={{ color: '#16a34a', fontSize: '1.5rem' }}>{result} kcal</strong>
            </p>
          </section>
        )}

      </main>
    </div>
  )
}

export default Profile