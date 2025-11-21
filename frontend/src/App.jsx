import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Home from './components/Home.jsx'
import BookList from './components/BookList.jsx'
import AddBook from './components/AddBook.jsx'
import BookDetail from './components/BookDetail.jsx'
import MyRequests from './components/MyRequests.jsx'
import MyListings from './components/MyListings.jsx'
import { onAuth } from './firebase'

function App() {
  const [route, setRoute] = useState('home')
  const [user, setUser] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)

  useEffect(() => {
    return onAuth(u => setUser(u));
  }, [])

  const go = (r) => { setSelectedBook(null); setRoute(r) }

  // Routes that have their own navigation or no navigation needed
  const routesWithOwnNav = ['home', 'detail', 'myrequests', 'mylistings', 'add', 'login', 'register']
  const showNavbar = !routesWithOwnNav.includes(route)

  // For home route, use the new Home component with sidebar
  if (route === 'home') {
    return <Home user={user} go={go} onOpen={(b)=>{ setSelectedBook(b); setRoute('detail'); }} />
  }

  // Routes with their own top navigation
  if (route === 'detail' && selectedBook) {
    return <BookDetail book={selectedBook} go={go} user={user} />
  }

  if (route === 'myrequests') {
    return <MyRequests user={user} go={go} />
  }

  if (route === 'mylistings') {
    return <MyListings user={user} go={go} />
  }

  if (route === 'add') {
    return <AddBook go={go} />
  }

  // Login and register pages (no navbar)
  if (route === 'login') {
    return <Login go={go} />
  }

  if (route === 'register') {
    return <Register go={go} />
  }

  // For other routes (if any), use the traditional layout with navbar
  return (
    <>
      {showNavbar && (
        <header>
          <nav className="container">
            <Navbar route={route} go={go} user={user} />
          </nav>
        </header>
      )}
      <main className="container" style={{paddingTop: showNavbar ? '1rem' : '0'}}>
        {/* Fallback for any other routes */}
        <p>Route not found</p>
      </main>
    </>
  )
}
export default App
