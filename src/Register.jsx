import './Register.css'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')


  if (!name || !username || !password) {
    setError('Wszystkie pola są wymagane')
    return
  }

  try {
    console.log({ name, username, password })

    alert('Konto utworzone ')
    navigate('/login')

  } catch (err) {
    setError('Błąd serwera')
  }
}
  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Utwórz konto</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Imię"
            className="register-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Login"
            className="register-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Hasło"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="register-button">
            Zarejestruj
          </button>
        </form>

        <p className="register-footer">
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </p>
      </div>
    </div>
  )
}

export default Register