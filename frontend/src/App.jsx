import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
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

  return (
    <>
      <header>
        <nav className="container">
          <Navbar route={route} go={go} user={user} />
        </nav>
      </header>
      <main className="container" style={{paddingTop:'1rem'}}>
        {route === 'home' && <BookList onOpen={(b)=>{ setSelectedBook(b); setRoute('detail'); }} />}
        {route === 'detail' && selectedBook && <BookDetail book={selectedBook} go={go} />}
        {route === 'login' && <Login go={go} />}
        {route === 'register' && <Register go={go} />}
        {route === 'add' && <AddBook go={go} />}
        {route === 'myrequests' && <MyRequests />}
        {route === 'mylistings' && <MyListings />}
      </main>
    </>
  )
}
export default App
