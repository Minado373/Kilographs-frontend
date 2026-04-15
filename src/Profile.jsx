import "./style.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
  const userId = localStorage.getItem("userId");

  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("Weight Loss");
  const [activity, setActivity] = useState("0");
  const [result, setResult] = useState(null);
  const [healthIssues, setHealthIssues] = useState([]);

  const [status, setStatus] = useState({ message: "", type: "" }); 

  const healthOptions = [
    { id: "lactose", label: "Lactose Intolerance", icon: "🥛" },
    { id: "gluten", label: "Gluten Intolerance", icon: "🍞" },
    { id: "diabetes", label: "Diabetes / IR", icon: "💉" },
    { id: "hypertension", label: "Hypertension", icon: "❤️" },
    { id: "nuts", label: "Nut Allergy", icon: "🥜" },
    { id: "thyroid", label: "Thyroid Issues", icon: "🦋" },
  ];


  const showStatus = (msg, type) => {
    setStatus({ message: msg, type });
    setTimeout(() => setStatus({ message: "", type: "" }), 5000);
  };

  const toggleHealthIssue = (id) => {
    setHealthIssues((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };


  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${backendUrl}/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setGender(data.gender || "Male");
          setAge(data.age || "");
          setWeight(data.weight || "");
          setHeight(data.height || "");
          setGoal(data.goal || "Weight Loss");
          setActivity(data.activity_level || "0");
          setHealthIssues(
            data.additional_info
              ? (() => {
                  try {
                    return JSON.parse(data.additional_info);
                  } catch {
                    return [];
                  }
                })()
              : []
          );
          setResult(data.calories || null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [userId, backendUrl]);

  const calculateCalories = async (e) => {
  e.preventDefault();


  const ageNum = parseInt(age);
  const weightNum = parseFloat(weight);
  const heightNum = parseFloat(height);
  const idNum = parseInt(userId);


  if (!idNum) {
    showStatus("Error: User ID is missing. Please log in again.", "error");
    return;
  }
  if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum)) {
    showStatus("Please fill Age, Weight and Height with valid numbers.", "error");
    return;
  }


  const palValues = [1.2, 1.4, 1.6, 1.8];
  const pal = palValues[parseInt(activity)] || 1.2;

  let bmr =
    gender === "Male"
      ? 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5
      : 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;

  let tdee = bmr * pal;
  if (goal === "Weight Loss") tdee -= 300;
  if (goal === "Muscle Gain") tdee += 300;

  const finalCalories = Math.round(tdee);
  const token = localStorage.getItem("token");


  const payload = {
    user_id: idNum,            
    gender: gender,            
    age: ageNum,               
    weight: weightNum,         
    height: heightNum,         
    goal: goal,                
    activity_level: String(activity), 
    additional_info: JSON.stringify(healthIssues),
    calories: parseFloat(finalCalories),
  };

  try {
    const res = await fetch(`${backendUrl}/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setResult(finalCalories);
      localStorage.setItem("userCalories", finalCalories);
      showStatus("Profile saved successfully! ✨", "success");
    } else {
      const errorData = await res.json();
      console.error("Szczegóły błędu 422:", errorData.detail);
      showStatus("Server rejected data format. Check console.", "error");
    }
  } catch (err) {
    showStatus("Connection error to server.", "error");
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
          <Link to="/profile" className="sidebar-button active">👤 Profile</Link>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="page-content">
        <header className="page-header">
          <h1 className="page-title">Profile Settings</h1>
          <p className="page-subtitle">Complete your data so AI can prepare your plan.</p>
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
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" />
              </div>
              <div className="input-group">
                <label>Weight (kg)</label>
                <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="80" />
              </div>
              <div className="input-group">
                <label>Height (cm)</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="180" />
              </div>
            </div>

            <hr className="profile-divider" />

            <div className="input-group">
              <label>Health & Allergies</label>
              <div className="health-grid">
                {healthOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`health-tag ${healthIssues.includes(option.id) ? "active" : ""}`}
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
                {["Weight Loss", "Maintenance", "Muscle Gain"].map((option) => (
                  <label key={option} className={`radio-card ${goal === option ? "active" : ""}`}>
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

            <div className="input-group" style={{ marginTop: "1.5rem" }}>
              <label>Physical Activity Level</label>
              <select value={activity} onChange={(e) => setActivity(e.target.value)}>
                <option value="0">Sedentary (Office job)</option>
                <option value="1">Light (1-2 workouts)</option>
                <option value="2">Moderate (3-4 workouts)</option>
                <option value="3">High (Daily intense)</option>
              </select>
            </div>

            {/* KOMUNIKAT STATUSU */}
            {status.message && (
              <div className={`status-message ${status.type}`}>
                {status.type === "success" ? "✅ " : "❌ "}
                {status.message}
              </div>
            )}

            <div className="profile-actions">
              <button type="submit" className="btn-save">
                Save & Calculate Calories
              </button>
            </div>
          </form>
        </section>

        {result && (
          <div className="animation-slide-up">
            <section className="profile-card result-card">
              <h2>Goal calculated! 🎉</h2>
              <p>
                Your daily intake: <span className="calories-highlight">{result} kcal</span>
              </p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;