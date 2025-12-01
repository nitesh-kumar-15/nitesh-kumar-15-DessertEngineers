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

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      load()
    }
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      go('login')
    }
  }

  return (
    <div className="home-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <nav className="sidebar-menu">
          <div className="sidebar-menu-item active" onClick={() => go('home')}>
            <svg viewBox="0 0 24 24" width="24" height="5" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span>Home</span>
          </div>
          
          <div className="sidebar-menu-item" onClick={() => go('mylistings')}>
            <svg viewBox="0 0 24 24" width="24" height="5" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span>Profile</span>
          </div>
          
          <div className="sidebar-menu-item" onClick={() => user ? go('myrequests') : go('login')}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
            <span>Chat</span>
          </div>
          
          <div className="sidebar-divider"></div>
          
          <div className="sidebar-search-label">
            <span>Search</span>
          </div>

          <div className="sidebar-search-container">
            <input
              type="text"
              className="sidebar-search-input"
              placeholder="Search books..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyPress={handleSearch}
            />
            <button className="sidebar-search-btn" onClick={handleSearch}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>
        </nav>

        {/* Spacer between search and add book button */}
        <div className="sidebar-spacer"></div>

        {user && (
          <button className="sidebar-add-book" onClick={() => go('add')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0 L10 20 M0 10 L20 10" stroke="white" strokeWidth="2"/>
            </svg>
            <span>Add Book</span>
          </button>
        )}

        {!user && (
          <button className="sidebar-add-book" onClick={() => go('login')}>
            Login
          </button>
        )}
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <div className="home-header">
          <div className="home-header-title">
            <h1>Book Buddy</h1>
            <div className="book-buddy-logo">
              <img src="/logo.svg" alt="Book Buddy Logo" style={{width: '60px', height: '60px', objectFit: 'contain'}} />
            </div>
          </div>
          {user && (
            <button className="header-logout-btn" onClick={handleLogout}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              <span>Logout</span>
            </button>
          )}
        </div>

        {/* Books Container */}
        <div className="books-container">
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
                <div className="book-cover-wrapper">
                  {b.imageUrl ? (
                    <img src={b.imageUrl} alt={b.title} />
                  ) : (
                    <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
                      <rect x="10" y="10" width="100" height="140" rx="4" fill="#4A5568" stroke="#2d3748" strokeWidth="2"/>
                      <text x="60" y="50" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">
                        {b.tags?.[0] || 'Book'}
                      </text>
                      <text x="60" y="80" textAnchor="middle" fill="white" fontSize="10">
                        {b.title.substring(0, 15)}
                      </text>
                      <rect x="15" y="135" width="90" height="15" rx="2" fill="#2d3748"/>
                      <line x1="20" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                      <line x1="20" y1="32" x2="95" y2="32" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                    </svg>
                  )}
                </div>
                <div className="book-info">
                  <div className="book-name">{b.title}</div>
                  <div className="book-owner">
                    <span>Book owned by {b.ownerEmail?.split('@')[0] || 'Unknown'}</span>
                    <div className="book-owner-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#6b7280">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

