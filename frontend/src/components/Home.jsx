import React, { useEffect, useState } from 'react'
import { BooksAPI } from '../api'

export default function Home({ user, onOpen, go }) {
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

  const handleSearch = () => {
    load()
  }

  return (
    <div className="home-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="profile-section">
          <div className="profile-avatar">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" fill="white" stroke="#5B4A8A" strokeWidth="2"/>
              <circle cx="40" cy="32" r="12" fill="none" stroke="#5B4A8A" strokeWidth="2"/>
              <path d="M20 65 C20 50, 60 50, 60 65" fill="none" stroke="#5B4A8A" strokeWidth="2"/>
            </svg>
          </div>
          <h3 className="username">{user ? user.email.split('@')[0] : 'Guest'}</h3>
          <button className="btn-edit-profile" onClick={() => go('profile')}>Edit Profile</button>
        </div>

        <div className="search-section">
          <input 
            type="text" 
            placeholder="Search" 
            className="sidebar-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="page-title">HomePage</h1>

        {err && <p className="error-message">{err}</p>}

        {/* Empty state */}
        {!loading && rows.length === 0 && (
          <div className="empty-state">
            <p>No books yet</p>
            <button className="btn" onClick={seedDemo} disabled={seedBusy}>
              {seedBusy ? 'Adding…' : 'Load demo books'}
            </button>
          </div>
        )}

        {/* Book Grid */}
        <div className="book-grid">
          {rows.map(b => (
            <div key={b.id} className="book-card" onClick={() => onOpen(b)}>
              <div className="book-icon">
                <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
                  <rect x="10" y="5" width="80" height="110" rx="3" fill="white" stroke="#333" strokeWidth="2"/>
                  <rect x="15" y="105" width="70" height="10" rx="2" fill="#333"/>
                  <line x1="20" y1="20" x2="80" y2="20" stroke="#ccc" strokeWidth="1"/>
                  <line x1="20" y1="30" x2="75" y2="30" stroke="#ccc" strokeWidth="1"/>
                  <line x1="20" y1="40" x2="70" y2="40" stroke="#ccc" strokeWidth="1"/>
                </svg>
              </div>
              <div className="book-info">
                <div className="book-name">{b.title}</div>
                <div className="book-class">Class: {b.tags?.join(', ') || 'N/A'}</div>
                <div className="book-isbn">ISBN: {b.isbn || 'N/A'}</div>
                <div className="book-user">User: {b.ownerEmail || 'Unknown'}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

