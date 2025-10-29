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
        <h1 className="login-title">Login</h1>
        
        <div className="login-panel">
          <button className="register-link-btn" onClick={() => go('register')}>
            NEW USER?<br/>REGISTER NOW
          </button>

          <div className="login-content">
            <div className="mascot-logo">
              <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Dog head */}
                <circle cx="75" cy="55" r="35" fill="#F9A825"/>
                
                {/* Ears */}
                <ellipse cx="50" cy="45" rx="15" ry="25" fill="#F9A825"/>
                <ellipse cx="100" cy="45" rx="15" ry="25" fill="#F9A825"/>
                
                {/* Glasses frame */}
                <circle cx="62" cy="52" r="12" fill="none" stroke="#2C3E50" strokeWidth="3"/>
                <circle cx="88" cy="52" r="12" fill="none" stroke="#2C3E50" strokeWidth="3"/>
                <line x1="74" y1="52" x2="76" y2="52" stroke="#2C3E50" strokeWidth="3"/>
                
                {/* Eyes behind glasses */}
                <circle cx="62" cy="52" r="5" fill="#2C3E50"/>
                <circle cx="88" cy="52" r="5" fill="#2C3E50"/>
                
                {/* Nose */}
                <ellipse cx="75" cy="65" rx="8" ry="6" fill="#2C3E50"/>
                
                {/* Mouth */}
                <path d="M75 65 Q 68 72 62 70" stroke="#2C3E50" strokeWidth="2" fill="none"/>
                <path d="M75 65 Q 82 72 88 70" stroke="#2C3E50" strokeWidth="2" fill="none"/>
                
                {/* Book */}
                <rect x="50" y="85" width="50" height="40" rx="3" fill="white" stroke="#2C3E50" strokeWidth="2"/>
                <line x1="75" y1="85" x2="75" y2="125" stroke="#2C3E50" strokeWidth="2"/>
                <line x1="55" y1="95" x2="70" y2="95" stroke="#F9A825" strokeWidth="1.5"/>
                <line x1="80" y1="95" x2="95" y2="95" stroke="#F9A825" strokeWidth="1.5"/>
                <line x1="55" y1="100" x2="70" y2="100" stroke="#F9A825" strokeWidth="1.5"/>
                <line x1="80" y1="100" x2="95" y2="100" stroke="#F9A825" strokeWidth="1.5"/>
              </svg>
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
