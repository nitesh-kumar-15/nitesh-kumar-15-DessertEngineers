import React, { useState } from 'react'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function Login({ go }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  async function submit(e) {
    e.preventDefault(); setErr('')
    try { await signInWithEmailAndPassword(auth, email, password); go('home') }
    catch (e) { setErr(e.message) }
  }
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-panel">
          <button className="register-link-btn" onClick={() => go('register')}>
            NEW USER?<br/>REGISTER HERE
          </button>

          <div className="login-content">
            <div className="mascot-logo">
              <img src="/logo.png" alt="Book Buddy Logo" style={{width: '150px', height: '150px', objectFit: 'contain'}} />
            </div>

            <h2 className="login-subtitle">Login</h2>

            {err && <p className="login-error">{err}</p>}

            <form onSubmit={submit} className="login-form">
              <input 
                type="email"
                className="login-input"
                placeholder="USERNAME"
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                required 
              />
              <input 
                type="password"
                className="login-input"
                placeholder="PASSWORD"
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                required 
              />
              <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); alert('Password reset functionality coming soon!'); }}>
                FORGOT PASSWORD?
              </a>
              <button className="login-submit-btn" type="submit">Log in</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
