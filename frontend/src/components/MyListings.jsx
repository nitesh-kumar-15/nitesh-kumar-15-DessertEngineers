import React, { useEffect, useState } from 'react'
import { BooksAPI } from '../api'

export default function MyListings({ user, go }) {
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [settingsForm, setSettingsForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
  const [settingsMsg, setSettingsMsg] = useState('')
  const [profileImage, setProfileImage] = useState(null)

  async function load() {
    try {
      setRows(await BooksAPI.myListings())
    } catch (e) {
      setErr(e.message)
    }
  }

  async function remove(id) {
    if (confirm('Are you sure you want to delete this book?')) {
      await BooksAPI.remove(id)
      await load()
    }
  }

  useEffect(() => { 
    load()
    // Initialize settings form with current user data
    if (user) {
      setSettingsForm({
        firstName: user?.displayName?.split(' ')[0] || '',
        lastName: user?.displayName?.split(' ')[1] || '',
        email: user?.email || ''
      })
    }
  }, [user])

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      // Search functionality
    }
  }

  const handleSettingsSave = async () => {
    try {
      setSettingsMsg('Settings updated successfully!')
      setTimeout(() => {
        setSettingsMsg('')
        setShowSettings(false)
      }, 1500)
    } catch (e) {
      setSettingsMsg(e.message)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerImageUpload = () => {
    document.getElementById('profile-image-input').click()
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // Logout functionality - redirect to login or home
      go('login')
    }
  }

  // Extract user info
  const firstName = settingsForm.firstName || user?.displayName?.split(' ')[0] || 'User'
  const lastName = settingsForm.lastName || user?.displayName?.split(' ')[1] || ''
  const email = settingsForm.email || user?.email || 'user@example.com'

  return (
    <div className="home-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <nav className="sidebar-menu">
          <div className="sidebar-menu-item" onClick={() => go('home')}>
            <svg viewBox="0 0 24 24" width="24" height="5" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span>Home</span>
          </div>
          
          <div className="sidebar-menu-item active" onClick={() => go('mylistings')}>
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
          <button className="header-logout-btn" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>

        {/* Profile Content */}
        <div className="profile-page-container">
          {/* Settings Button - Top Right */}
          <button className="profile-settings-btn-top" onClick={() => setShowSettings(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
            </svg>
            <span>Settings</span>
          </button>

          <div className="profile-content-wrapper">
            {/* Left side - Avatar */}
            <div className="profile-avatar-section">
              <div className="profile-avatar-circle" onClick={triggerImageUpload}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="profile-avatar-image" />
                ) : (
                  <svg width="280" height="280" viewBox="0 0 24 24" fill="#808080">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
                <div className="profile-avatar-overlay">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                    <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                  </svg>
                  <p className="profile-avatar-text">Change Photo</p>
                </div>
              </div>
              <input 
                type="file" 
                id="profile-image-input" 
                accept="image/*" 
                onChange={handleImageUpload}
                style={{display: 'none'}}
              />
            </div>

            {/* Right side - User Info Card */}
            <div className="profile-info-card">
              <div className="profile-info-item">
                <div className="profile-info-label">First Name:</div>
                <div className="profile-info-value">{firstName}</div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-label">Last Name:</div>
                <div className="profile-info-value">{lastName || 'N/A'}</div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-label">Email:</div>
                <div className="profile-info-value">{email}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content-settings" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h2 className="settings-title">Edit Profile</h2>
              <button className="settings-close" onClick={() => setShowSettings(false)}>×</button>
            </div>

            {settingsMsg && <p className={settingsMsg.includes('success') ? 'success-message' : 'error-message'}>{settingsMsg}</p>}

            <div className="settings-form">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input 
                  className="form-input-clean"
                  value={settingsForm.firstName} 
                  onChange={e => setSettingsForm(f => ({...f, firstName: e.target.value}))} 
                  placeholder="Enter first name"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input 
                  className="form-input-clean"
                  value={settingsForm.lastName} 
                  onChange={e => setSettingsForm(f => ({...f, lastName: e.target.value}))}
                  placeholder="Enter last name"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  className="form-input-clean"
                  type="email"
                  value={settingsForm.email} 
                  onChange={e => setSettingsForm(f => ({...f, email: e.target.value}))}
                  placeholder="Enter email"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="settings-actions">
              <button className="btn-save-settings" onClick={handleSettingsSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
