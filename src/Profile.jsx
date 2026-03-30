import './Profile.css'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Profile() {
  const navigate = useNavigate();

  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState('Weight Loss');
  const [activity, setActivity] = useState('0');
  const [result, setResult] = useState(null);

  const [healthIssues, setHealthIssues] = useState([]);

  const healthOptions = [
    { id: 'lactose', label: 'Lactose Intolerance', icon: '🥛' },
    { id: 'gluten', label: 'Gluten Intolerance', icon: '🍞' },
    { id: 'diabetes', label: 'Diabetes / IR', icon: '💉' },
    { id: 'hypertension', label: 'Hypertension', icon: '❤️' },
    { id: 'nuts', label: 'Nut Allergy', icon: '🥜' },
    { id: 'thyroid', label: 'Thyroid Issues', icon: '🦋' },
  ];

  const toggleHealthIssue = (id) => {
    setHealthIssues(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const calculateCalories = (e) => {
    e.preventDefault();
    if (!age || !weight || !height) return;

    const palValues = [1.2, 1.4, 1.6, 1.8];
    const pal = palValues[parseInt(activity)];
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    let bmr = gender === "Male" 
      ? (10 * w + 6.25 * h - 5 * a + 5) 
      : (10 * w + 6.25 * h - 5 * a - 161);

    let tdee = bmr * pal;
    
    // Logic: Weight Loss = Redukcja, Maintenance = Utrzymanie, Muscle Gain = Masa
    if (goal === "Weight Loss") tdee -= 300;
    if (goal === "Muscle Gain") tdee += 300;

    const finalCalories = Math.round(tdee);
    localStorage.setItem('userCalories', finalCalories);
    localStorage.setItem('userHealth', JSON.stringify(healthIssues));
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
          <h1 className="profile-title">Profile Settings</h1>
          <p className="profile-subtitle">Complete your data so AI can prepare your plan.</p>
        </header>

        <section className="profile-card">
          <form onSubmit={calculateCalories}>
            <div className="profile-grid">
              <div className="input-group">
                <label>Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="input-group">
                <label>Age</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 25" />
              </div>
              <div className="input-group">
                <label>Weight (kg)</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 80" />
              </div>
              <div className="input-group">
                <label>Height (cm)</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 185" />
              </div>
            </div>

            <hr className="profile-divider" />

            <div className="input-group">
              <label>Health & Allergies (Affects meal selection)</label>
              <div className="health-grid">
                {healthOptions.map((option) => (
                  <div 
                    key={option.id} 
                    className={`health-tag ${healthIssues.includes(option.id) ? 'active' : ''}`}
                    onClick={() => toggleHealthIssue(option.id)}
                  >
                    <span className="health-icon">{option.icon}</span>
                    {option.label}
                  </div>
                ))}
              </div>
            </div>

            <hr className="profile-divider" />

            <div className="input-group">
              <label>Body Goal</label>
              <div className="radio-grid">
                {['Weight Loss', 'Maintenance', 'Muscle Gain'].map((option) => (
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
              <label>Physical Activity Level</label>
              <select value={activity} onChange={(e) => setActivity(e.target.value)}>
                <option value="0">Sedentary (Office job, no exercise)</option>
                <option value="1">Light (1-2 workouts per week)</option>
                <option value="2">Moderate (3-4 workouts per week)</option>
                <option value="3">High (Daily intense exercise)</option>
              </select>
            </div>

            <div className="profile-actions">
              <button type="submit" className="btn-save">Save & Calculate Calories</button>
            </div>
          </form>
        </section>

        {result && (
          <div className="animation-slide-up">
            <section className="profile-card result-card">
              <h2>Goal calculated successfully! 🎉</h2>
              <p>
                Your personalized daily intake is: 
                <span className="calories-highlight">{result} kcal</span>
              </p>
              {healthIssues.length > 0 && (
                <p className="health-warning">
                  ⚠️ We will consider your {healthIssues.length} health restriction(s) when generating meals.
                </p>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

export default Profile