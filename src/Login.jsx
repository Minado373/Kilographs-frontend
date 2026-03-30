/* eslint-disable no-unused-vars */
import './Login.css'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'


function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.detail)
        return
      }

      
      navigate('/dashboard')

    } catch (err) {
      setError('Błędne hasło lub login')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Zaloguj się</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Login"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Hasło"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="login-button">
            Zaloguj
          </button>
        </form>
        <p className="login-footer">
          Nie masz konta? <Link to="/">Wróć</Link>
        </p>
      </div>
    </div>
  )
}

export default Login