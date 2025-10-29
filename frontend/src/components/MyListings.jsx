import React, { useEffect, useState } from 'react'
import { BooksAPI } from '../api'

export default function MyListings() {
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null)

  async function load() {
    setLoading(true)
    setErr('')
    try {
      const data = await BooksAPI.myListings()
      setRows(data)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function remove(id) {
    // optimistic style: show which item is being deleted
    setRemovingId(id)
    try {
      await BooksAPI.remove(id)
      await load()
    } catch (e) {
      setErr(e.message)
    } finally {
      setRemovingId(null)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <h2>My listings</h2>

      {/* Error message (ex: not logged in, 401) */}
      {err && (
        <p className="muted" style={{ color: 'crimson' }}>
          {err}
        </p>
      )}

      {/* Loading state */}
      {loading && (
        <p className="muted">Loading your books…</p>
      )}

      {/* Empty state (only if not loading and no rows) */}
      {!loading && rows.length === 0 && !err && (
        <p className="muted">
          You haven't added any books yet.
        </p>
      )}

      {/* Listings grid */}
      <div className="grid">
        {rows.map(b => (
          <div className="card" key={b.id}>
            <h3 style={{ marginBottom: '.25rem' }}>{b.title}</h3>
            <p className="muted">{b.author}</p>

            <p style={{ minHeight: '2rem' }}>
              {b.description?.slice(0, 120)}
            </p>

            <div
              className="row"
              style={{ justifyContent: 'space-between', marginTop: '.6rem' }}
            >
              <span className="muted">{b.condition}</span>

              <button
                className="btn secondary"
                onClick={() => remove(b.id)}
                disabled={removingId === b.id}
              >
                {removingId === b.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
