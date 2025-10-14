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
    <div className="card" style={{maxWidth:480, margin:'0 auto'}}>
      <h2>Create an account</h2>
      {err && <p className="muted" style={{color:'crimson'}}>{err}</p>}
      <form onSubmit={submit}>
        <label>Name<input value={name} onChange={e=>setName(e.target.value)} required /></label>
        <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
        <button className="btn" type="submit">Sign up</button>
      </form>
    </div>
  )
}
