import React, { useEffect, useState } from 'react'
import { BooksAPI } from '../api'

export default function BookList({ onOpen }) {
  const [q, setQ] = useState('')
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [seedBusy, setSeedBusy] = useState(false)

  async function load() {
    setLoading(true); setErr('')
    try { setRows(await BooksAPI.list(q)) }
    catch (e) { setErr(e.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  async function seedDemo() {
    try {
      setSeedBusy(true); setErr('')
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api/dev/seed', {
        method: 'POST'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Seed failed')
      await load()
    } catch (e) {
      setErr(e.message)
    } finally {
      setSeedBusy(false)
    }
  }

  return (
    <div>
      {/* Small hero / search */}
      <div className="hero">
        <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <h2 style={{margin:'0 0 .3rem'}}>Find your next great read</h2>
            <div className="small">Browse, borrow, or swap books with nearby readers.</div>
          </div>
        </div>
        <div className="row" style={{marginTop:'.8rem', gap:'.6rem'}}>
          <input placeholder="Search by title/author/tag..." value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn" onClick={load} disabled={loading}>{loading ? 'Searching…' : 'Search'}</button>
          <button className="btn ghost" onClick={()=>{ setQ(''); load(); }} disabled={loading}>Reset</button>
        </div>
      </div>

      {err && <p className="muted" style={{color:'crimson'}}>{err}</p>}

      {/* Empty state with CTA to seed demo books */}
      {!loading && rows.length === 0 && (
        <div className="card center" style={{padding:'2rem'}}>
          <p style={{fontSize:'1.1rem', marginBottom:'.25rem'}}>No books yet</p>
          <p className="small" style={{marginBottom:'1rem'}}>Load a few demo listings to see how it looks.</p>
          <button className="btn" onClick={seedDemo} disabled={seedBusy}>{seedBusy ? 'Adding…' : 'Load demo books'}</button>
        </div>
      )}

      {/* Grid */}
      <div className="grid">
        {rows.map(b => (
          <div key={b.id} className="card">
            {b.imageUrl && <img className="img" src={b.imageUrl} alt={b.title} loading="lazy" />}
            <h3 style={{marginBottom:'.25rem'}}>{b.title}</h3>
            <p className="muted">{b.author}</p>
            <p style={{minHeight:'2.5rem'}}>{b.description?.slice(0,120)}</p>
            {Array.isArray(b.tags) && b.tags.length > 0 && (
              <div className="tags">{b.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
            )}
            <div className="row" style={{justifyContent:'space-between', marginTop:'.6rem'}}>
              <span className="muted">{b.condition}</span>
              <a href="#" onClick={(e)=>{ e.preventDefault(); onOpen(b) }}>View</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
