import React, { useState } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

export default function Register({ go }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  
  async function submit(e) {
    e.preventDefault(); setErr('')
    try { 
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      go('home')
    } catch (e) { setErr(e.message) }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Register</h1>
        
        <div className="login-panel">
          <button className="register-link-btn" onClick={() => go('login')}>
            HAVE AN ACCOUNT?<br/>LOGIN NOW
          </button>

          <div className="login-content">
            <div className="mascot-logo">
              <img src="/logo.svg" alt="Book Buddy Logo" style={{width: '150px', height: '150px', objectFit: 'contain'}} />
            </div>

            <h2 className="login-subtitle">Register</h2>

            {err && <p className="login-error">{err}</p>}

            <form onSubmit={submit} className="login-form">
              <input 
                type="text"
                className="login-input"
                placeholder="NAME"
                value={name} 
                onChange={e=>setName(e.target.value)} 
                required 
              />
              <input 
                type="email"
                className="login-input"
                placeholder="EMAIL"
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
              <button className="login-submit-btn" type="submit">Sign up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
