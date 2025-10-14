import React, { useEffect, useState } from 'react'
import { ReqAPI } from '../api'

export default function MyRequests() {
  const [incoming, setIncoming] = useState([])
  const [mine, setMine] = useState([])
  const [err, setErr] = useState('')
  async function load() {
    try { 
      const [a,b] = await Promise.all([ReqAPI.incoming(), ReqAPI.mine()])
      setIncoming(a); setMine(b)
    } catch (e) { setErr(e.message) }
  }
  async function update(id, status) {
    await ReqAPI.update(id, status)
    await load()
  }
  useEffect(()=>{ load() }, [])
  return (
    <div className="grid">
      <div className="card">
        <h3>Incoming requests</h3>
        {incoming.length===0 && <p className="muted">No incoming requests.</p>}
        {incoming.map(r=> (
          <div key={r.id} className="card" style={{marginTop:'.5rem'}}>
            <p><strong>Type:</strong> {r.type} | <strong>Status:</strong> {r.status}</p>
            <p><strong>Message:</strong> {r.message}</p>
            {r.status==='pending' && (
              <div className="row">
                <button className="btn" onClick={()=>update(r.id,'approved')}>Approve</button>
                <button className="btn secondary" onClick={()=>update(r.id,'declined')}>Decline</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="card">
        <h3>My requests</h3>
        {mine.length===0 && <p className="muted">You haven't requested any books.</p>}
        {mine.map(r=> (
          <div key={r.id} className="card" style={{marginTop:'.5rem'}}>
            <p><strong>Type:</strong> {r.type} | <strong>Status:</strong> {r.status}</p>
            <p><strong>Message:</strong> {r.message}</p>
          </div>
        ))}
      </div>
      {err && <p className="muted" style={{color:'crimson'}}>{err}</p>}
    </div>
  )
}
