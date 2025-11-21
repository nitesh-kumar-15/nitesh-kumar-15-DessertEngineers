import React, { useState } from 'react'
import { ReqAPI } from '../api'

export default function BookDetail({ book, go, user }) {
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

  const ownerName = book.ownerEmail?.split('@')[0] || 'Unknown'
  
  return (
    <div className="bookdetail-layout">
      {/* Header with Back Button */}
      <div className="bookdetail-header-main">
        <button className="bookdetail-back-btn" onClick={() => go('home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          <span>Back</span>
        </button>

        <div className="bookdetail-header-title">
          <h1>Book Buddy</h1>
          <div className="book-buddy-logo">
            <img src="/logo.png" alt="Book Buddy Logo" style={{width: '60px', height: '60px', objectFit: 'contain'}} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bookdetail-main-content">
        <div className="bookdetail-content-wrapper">
          {/* Left Side - Book Cover and Message */}
          <div className="bookdetail-left-section">
            <div className="bookdetail-cover-container">
              {book.imageUrl ? (
                <img src={book.imageUrl} alt={book.title} className="bookdetail-cover-img" />
              ) : (
                <svg width="300" height="400" viewBox="0 0 120 160" fill="none">
                  <rect x="10" y="10" width="100" height="140" rx="4" fill="#4A5568" stroke="#2d3748" strokeWidth="2"/>
                  <text x="60" y="50" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">
                    {book.tags?.[0] || 'Book'}
                  </text>
                  <text x="60" y="80" textAnchor="middle" fill="white" fontSize="10">
                    {book.title.substring(0, 15)}
                  </text>
                  <rect x="15" y="135" width="90" height="15" rx="2" fill="#2d3748"/>
                  <line x1="20" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                  <line x1="20" y1="32" x2="95" y2="32" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                </svg>
              )}
            </div>

            <div className="bookdetail-owner-section">
              <span className="bookdetail-owner-text">Book owned by {ownerName}</span>
              <div className="bookdetail-owner-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#808080">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>

            <button className="bookdetail-message-btn" onClick={sendRequest}>
              Message
            </button>

            {resp && <p className="bookdetail-response">{resp}</p>}
          </div>

          {/* Right Side - Book Info Card */}
          <div className="bookdetail-right-section">
            <div className="bookdetail-info-card">
              <h2 className="bookdetail-book-title">{book.title}</h2>

              <div className="bookdetail-info-item">
                <span className="bookdetail-info-label">Class:</span>
                <span className="bookdetail-info-value">{book.tags?.join(', ') || 'N/A'}</span>
              </div>

              <div className="bookdetail-info-item">
                <span className="bookdetail-info-label">IBSN:</span>
                <span className="bookdetail-info-value">{book.isbn || 'N/A'}</span>
              </div>

              <div className="bookdetail-info-item">
                <span className="bookdetail-info-label">Author:</span>
                <span className="bookdetail-info-value">{book.author || 'N/A'}</span>
              </div>

              {book.description && (
                <div className="bookdetail-info-item-desc">
                  <span className="bookdetail-info-label">Description:</span>
                  <p className="bookdetail-info-desc-text">{book.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
