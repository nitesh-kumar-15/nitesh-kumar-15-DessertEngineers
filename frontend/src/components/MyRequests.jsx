import React, { useEffect, useState } from 'react'
import { ReqAPI } from '../api'
import { listenToMessages } from '../firebase'

export default function MyRequests({ user, go }) {
  const [incoming, setIncoming] = useState([])
  const [mine, setMine] = useState([])
  const [err, setErr] = useState('')
  const [chatMessage, setChatMessage] = useState('')
  const [activeTab, setActiveTab] = useState('incoming')
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [q, setQ] = useState('')
  
  async function load() {
    try { 
      const [a,b] = await Promise.all([ReqAPI.incoming(), ReqAPI.mine()])
      setIncoming(a); setMine(b)
      // Auto-select first conversation
      if (a.length > 0 && !selectedConversation) {
        setSelectedConversation(a[0])
      }
    } catch (e) { setErr(e.message) }
  }
  
  async function loadMessages(requestId) {
    if (!requestId) return
    setLoadingMessages(true)
    try {
      const msgs = await ReqAPI.getMessages(requestId)
      setMessages(msgs)
    } catch (e) {
      setErr(e.message)
      setMessages([])
    } finally {
      setLoadingMessages(false)
    }
  }
  
  async function update(id, status) {
    await ReqAPI.update(id, status)
    await load()
  }
  
  useEffect(()=>{ load() }, [])

  // Set up real-time listener for messages when conversation changes
  useEffect(() => {
    if (!selectedConversation?.id) {
      setMessages([])
      return
    }

    // Load initial messages first
    loadMessages(selectedConversation.id)

    // Set up real-time listener
    const unsubscribe = listenToMessages(selectedConversation.id, (realTimeMessages) => {
      setMessages(realTimeMessages)
      setLoadingMessages(false)
    })

    // Cleanup listener when conversation changes
    return () => {
      unsubscribe()
    }
  }, [selectedConversation?.id])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const messagesArea = document.querySelector('.chat-messages-area')
    if (messagesArea) {
      messagesArea.scrollTop = messagesArea.scrollHeight
    }
  }, [messages])

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      // Search functionality
    }
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      go('login')
    }
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !selectedConversation || sendingMessage) return
    
    const messageText = chatMessage.trim()
    setChatMessage('')
    setSendingMessage(true)
    
    try {
      await ReqAPI.sendMessage(selectedConversation.id, messageText)
      // Real-time listener will automatically update the messages
      // No need to manually reload
    } catch (e) {
      setErr(e.message)
      // Restore the message if sending failed
      setChatMessage(messageText)
    } finally {
      setSendingMessage(false)
    }
  }

  const allRequests = activeTab === 'incoming' ? incoming : mine

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
          
          <div className="sidebar-menu-item" onClick={() => go('mylistings')}>
            <svg viewBox="0 0 24 24" width="24" height="5" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span>Profile</span>
          </div>
          
          <div className="sidebar-menu-item active" onClick={() => go('myrequests')}>
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

        <div className="sidebar-spacer"></div>

        {user && (
          <button className="sidebar-add-book" onClick={() => go('add')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0 L10 20 M0 10 L20 10" stroke="white" strokeWidth="2"/>
            </svg>
            <span>Add Book</span>
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

        {/* Chat Layout */}
        <div className="chat-page-layout">
          {/* Middle: Conversations List */}
          <div className="conversations-panel">
            <div className="conversations-header">
              <h2>Messages</h2>
              <div className="conversations-tabs">
                <button 
                  className={activeTab === 'incoming' ? 'tab-btn active' : 'tab-btn'}
                  onClick={() => setActiveTab('incoming')}
                >
                  Incoming
                </button>
                <button 
                  className={activeTab === 'mine' ? 'tab-btn active' : 'tab-btn'}
                  onClick={() => setActiveTab('mine')}
                >
                  My Requests
                </button>
              </div>
            </div>

            <div className="conversations-list">
              {allRequests.length === 0 ? (
                <div className="empty-conversations">
                  <p>{activeTab === 'incoming' ? 'No incoming requests yet' : 'You haven\'t made any requests yet'}</p>
                </div>
              ) : (
                allRequests.map((req, idx) => (
                  <div 
                    key={req.id} 
                    className={`conversation-item ${selectedConversation?.id === req.id ? 'active' : ''}`}
                    onClick={() => setSelectedConversation(req)}
                  >
                    <div className="conversation-avatar">
                      <svg width="50" height="50" viewBox="0 0 24 24" fill="#808080">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-name">
                        {activeTab === 'incoming' ? req.requesterEmail?.split('@')[0] || 'User' : req.bookOwner || 'Owner'}
                      </div>
                      <div className="conversation-book">{req.bookTitle || 'Book Request'}</div>
                    </div>
                    {idx === 0 && req.status === 'pending' && (
                      <div className="conversation-badge"></div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Chat Area */}
          <div className="chat-area">
            {selectedConversation ? (
              <>
                <div className="chat-area-header">
                  <div className="chat-header-avatar">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="#808080">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="chat-header-info">
                    <div className="chat-header-name">
                      {activeTab === 'incoming' ? selectedConversation.requesterEmail?.split('@')[0] || 'User' : selectedConversation.bookOwner || 'Owner'}
                    </div>
                    <div className="chat-header-book">{selectedConversation.bookTitle || 'Book Request'}</div>
                  </div>
                </div>

                <div className="chat-messages-area">
                  {loadingMessages ? (
                    <div style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>Loading messages...</div>
                  ) : (
                    <>
                      {/* Show initial request message if it exists */}
                      {selectedConversation.message && (
                        <div className="chat-message-bubble sent">
                          {selectedConversation.message}
                        </div>
                      )}
                      {/* Display all messages */}
                      {messages.length === 0 ? (
                        <div style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
                          <p>No additional messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        messages.map((msg) => {
                          const isSent = user && msg.senderId === user.uid
                          return (
                            <div key={msg.id} className={`chat-message-bubble ${isSent ? 'sent' : 'received'}`}>
                              {msg.text}
                            </div>
                          )
                        })
                      )}
                    </>
                  )}
                </div>

                <div className="chat-input-container">
                  <input
                    type="text"
                    className="chat-input-field"
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    className="chat-send-button" 
                    onClick={handleSendMessage}
                    disabled={sendingMessage || !chatMessage.trim()}
                    style={{opacity: sendingMessage || !chatMessage.trim() ? 0.5 : 1, cursor: sendingMessage || !chatMessage.trim() ? 'not-allowed' : 'pointer'}}
                  >
                    {sendingMessage ? (
                      <span style={{fontSize: '0.8rem'}}>...</span>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="chat-empty-state">
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
