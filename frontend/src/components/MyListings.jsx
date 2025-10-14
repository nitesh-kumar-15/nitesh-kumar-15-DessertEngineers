import React, { useEffect, useState } from 'react'
import { BooksAPI } from '../api'

export default function MyListings() {
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')
  async function load() {
    try { setRows(await BooksAPI.myListings()) }
    catch (e) { setErr(e.message) }
  }
  async function remove(id) {
    await BooksAPI.remove(id); await load()
  }
  useEffect(()=>{ load() }, [])
  return (
    <div>
      <h2>My listings</h2>
      {rows.length===0 && <p className="muted">You haven't added any books yet.</p>}
      <div className="grid">
        {rows.map(b => (
          <div className="card" key={b.id}>
            <h3>{b.title}</h3>
            <p className="muted">{b.author}</p>
            <div className="row" style={{justifyContent:'space-between'}}>
              <span className="muted">{b.condition}</span>
              <button className="btn secondary" onClick={()=>remove(b.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {err && <p className="muted" style={{color:'crimson'}}>{err}</p>}
    </div>
  )
}
