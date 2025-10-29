import React, { useState } from 'react'
import { ReqAPI } from '../api'

export default function BookDetail({ book, go }) {
  const [message, setMessage] = useState('Hi! I would like to borrow this book.')
  const [type, setType] = useState('borrow')
  const [resp, setResp] = useState('')
  const [showRequestForm, setShowRequestForm] = useState(false)
  
  async function sendRequest() {
    setResp('')
    try {
      const r = await ReqAPI.create({ bookId: book.id, type, message })
      setResp('Request sent! Status: ' + r.status)
      setShowRequestForm(false)
    } catch (e) { setResp(e.message) }
  }
  
  return (
    <div className="bookdetail-page">
      <div className="bookdetail-container">
        <div className="bookdetail-header">
          <h1 className="bookdetail-title">BookInfo</h1>
          <button className="back-btn" onClick={() => go('home')}>← Back</button>
        </div>
        
        <div className="bookdetail-content">
          {/* Left Panel - Purple */}
          <div className="bookdetail-left">
            <div className="book-cover-display">
              {book.imageUrl ? (
                <img src={book.imageUrl} alt={book.title} className="book-cover-image" />
              ) : (
                <svg width="200" height="240" viewBox="0 0 200 240" fill="none">
                  <rect x="30" y="20" width="140" height="200" rx="8" fill="white" stroke="#333" strokeWidth="3"/>
                  <rect x="35" y="200" width="130" height="20" rx="4" fill="#333"/>
                  <line x1="50" y1="50" x2="150" y2="50" stroke="#ddd" strokeWidth="2"/>
                  <line x1="50" y1="70" x2="140" y2="70" stroke="#ddd" strokeWidth="2"/>
                  <line x1="50" y1="90" x2="130" y2="90" stroke="#ddd" strokeWidth="2"/>
                </svg>
              )}
            </div>
            
            <button 
              className="request-btn"
              onClick={() => setShowRequestForm(!showRequestForm)}
            >
              Request
            </button>
            
            {showRequestForm && (
              <div className="request-form">
                <select 
                  className="request-select"
                  value={type} 
                  onChange={e=>setType(e.target.value)}
                >
                  <option value="borrow">Borrow</option>
                  <option value="swap">Swap</option>
                  <option value="free">Take for Free</option>
                </select>
                <textarea 
                  className="request-message"
                  value={message} 
                  onChange={e=>setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows="3"
                />
                <button className="send-request-btn" onClick={sendRequest}>
                  Send Request
                </button>
              </div>
            )}
            
            {resp && <p className="request-response">{resp}</p>}
          </div>
          
          {/* Right Panel - White */}
          <div className="bookdetail-right">
            <div className="book-details">
              <h2 className="detail-book-name">{book.title}</h2>
              <div className="detail-item">
                <span className="detail-label">Class:</span>
                <span className="detail-value">{book.tags?.join(', ') || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">ISBN:</span>
                <span className="detail-value">{book.isbn || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Author:</span>
                <span className="detail-value">{book.author || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Condition:</span>
                <span className="detail-value">{book.condition || 'N/A'}</span>
              </div>
              {book.description && (
                <div className="detail-item">
                  <span className="detail-label">Description:</span>
                  <p className="detail-description">{book.description}</p>
                </div>
              )}
              
              <div className="book-owner">
                <span className="owner-text">Book owned by: {book.ownerEmail || 'Unknown'}</span>
                <div className="owner-icon">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="19" fill="#7c3aed" stroke="white" strokeWidth="2"/>
                    <circle cx="20" cy="16" r="6" fill="none" stroke="white" strokeWidth="2"/>
                    <path d="M10 32 C10 25, 30 25, 30 32" fill="none" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
