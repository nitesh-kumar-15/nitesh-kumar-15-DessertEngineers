import React, { useState } from 'react'
import { ReqAPI } from '../api'

export default function BookDetail({ book, go }) {
  const [message, setMessage] = useState('Hi! I would like to borrow this book.')
  const [type, setType] = useState('borrow')
  const [resp, setResp] = useState('')
  async function sendRequest() {
    setResp('')
    try {
      const r = await ReqAPI.create({ bookId: book.id, type, message })
      setResp('Request sent! Status: ' + r.status)
    } catch (e) { setResp(e.message) }
  }
  return (
    <div className="card">
      <a href="#" onClick={(e)=>{e.preventDefault(); go('home')}}>← Back</a>
      <h2 style={{marginTop:'.5rem'}}>{book.title}</h2>
      <p className="muted">{book.author}</p>
      <p>{book.description}</p>
      <p><strong>Condition:</strong> {book.condition}</p>
      <div className="row">
        <select value={type} onChange={e=>setType(e.target.value)}>
          <option value="borrow">Borrow</option>
          <option value="swap">Swap</option>
          <option value="free">Take for Free</option>
        </select>
        <input value={message} onChange={e=>setMessage(e.target.value)} />
        <button className="btn" onClick={sendRequest}>Send request</button>
      </div>
      {resp && <p className="muted">{resp}</p>}
    </div>
  )
}
