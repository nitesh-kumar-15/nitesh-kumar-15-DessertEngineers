import React, { useState } from 'react'
import { BooksAPI } from '../api'

export default function AddBook({ go }) {
  const [form, setForm] = useState({ title:'', author:'', condition:'Good', description:'', tags:'' })
  const [msg, setMsg] = useState('')
  
  async function submit(e) {
    e.preventDefault(); setMsg('')
    const payload = { ...form, tags: form.tags ? form.tags.split(',').map(s=>s.trim()) : [] }
    try { 
      const book = await BooksAPI.create(payload);
      setMsg('Book added successfully!')
      setTimeout(() => {
        go('home')
      }, 1500)
    } catch (e) { 
      setMsg(e.message) 
    }
  }

  return (
    <div className="modal-overlay" onClick={() => go('home')}>
      <div className="modal-content-addbook" onClick={(e) => e.stopPropagation()}>
        <div className="addbook-header">
          <h2 className="addbook-title">New Book</h2>
          <button className="addbook-close" onClick={() => go('home')}>×</button>
        </div>

        {msg && <p className={msg.includes('success') ? 'muted' : 'error-message'}>{msg}</p>}

        <div className="addbook-layout">
          {/* Left side - Image upload */}
          <div className="addbook-image-section">
            <div className="image-upload-placeholder">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="#a8a8a8">
                <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                <circle cx="12" cy="12" r="3" fill="#a8a8a8"/>
              </svg>
            </div>
          </div>

        {/* Right side - Form fields */}
        <div className="addbook-form-section">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input 
              className="form-input-clean"
              value={form.title} 
              onChange={e=>setForm(f=>({...f, title:e.target.value}))} 
              required
              placeholder=""
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Class</label>
            <input 
              className="form-input-clean"
              value={form.tags} 
              onChange={e=>setForm(f=>({...f, tags:e.target.value}))}
              placeholder=""
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Author</label>
            <input 
              className="form-input-clean"
              value={form.author} 
              onChange={e=>setForm(f=>({...f, author:e.target.value}))}
              placeholder=""
            />
          </div>
        </div>
      </div>

      {/* Description below */}
      <div className="addbook-description">
        <label className="form-label">Description</label>
        <textarea 
          className="form-textarea-clean"
          rows="5" 
          value={form.description} 
          onChange={e=>setForm(f=>({...f, description:e.target.value}))}
          placeholder=""
        />
      </div>

      {/* Submit Button */}
      <div className="addbook-actions">
        <button className="btn-submit-book" onClick={submit}>Add Book</button>
      </div>

      <div style={{display: 'none'}}>
        <select value={form.condition} onChange={e=>setForm(f=>({...f, condition:e.target.value}))}>
          <option>Good</option>
        </select>
      </div>
      </div>
    </div>
  )
}
