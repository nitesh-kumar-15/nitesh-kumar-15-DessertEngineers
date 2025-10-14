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
      setMsg('Added: ' + book.title)
      setForm({ title:'', author:'', condition:'Good', description:'', tags:'' })
    } catch (e) { setMsg(e.message) }
  }
  return (
    <div className="card" style={{maxWidth:700, margin:'0 auto'}}>
      <h2>Add a book</h2>
      {msg && <p className="muted">{msg}</p>}
      <form onSubmit={submit}>
        <label>Title<input value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))} required/></label>
        <label>Author<input value={form.author} onChange={e=>setForm(f=>({...f, author:e.target.value}))}/></label>
        <label>Condition<select value={form.condition} onChange={e=>setForm(f=>({...f, condition:e.target.value}))}>
          <option>New</option><option>Like New</option><option>Good</option><option>Fair</option>
        </select></label>
        <label>Description<textarea rows="4" value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))}></textarea></label>
        <label>Tags (comma separated)<input value={form.tags} onChange={e=>setForm(f=>({...f, tags:e.target.value}))}/></label>
        <div className="row" style={{justifyContent:'flex-end'}}><button className="btn">Save</button></div>
      </form>
    </div>
  )
}
