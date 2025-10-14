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
    <div className="card" style={{maxWidth:420, margin:'0 auto'}}>
      <h2>Log in</h2>
      {err && <p className="muted" style={{color:'crimson'}}>{err}</p>}
      <form onSubmit={submit}>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
        <button className="btn" type="submit">Log in</button>
      </form>
    </div>
  )
}
