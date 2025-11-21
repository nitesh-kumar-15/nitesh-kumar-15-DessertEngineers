import React from 'react'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

export default function Navbar({ route, go, user }) {
  async function logout() { await signOut(auth); go('home'); }
  
  return (
    <div className="row" style={{justifyContent:'space-between', width:'100%', padding: '0.5rem 0'}}>
      <div className="row">
        <a 
          href="#" 
          onClick={(e)=>{e.preventDefault();go('home')}} 
          style={{fontWeight:'700', fontSize: '1.2rem', color: '#2d3748'}}
        >
          📚 Book Buddy
        </a>
        <a href="#" onClick={(e)=>{e.preventDefault();go('home')}}>Browse</a>
        {user && <a href="#" onClick={(e)=>{e.preventDefault();go('add')}}>Add Book</a>}
        {user && <a href="#" onClick={(e)=>{e.preventDefault();go('mylistings')}}>My Listings</a>}
        {user && <a href="#" onClick={(e)=>{e.preventDefault();go('myrequests')}}>Requests</a>}
      </div>
      <div className="row">
        {!user && <button className="btn" onClick={(e)=>{e.preventDefault();go('login')}}>Log in</button>}
        {!user && <button className="btn secondary" onClick={(e)=>{e.preventDefault();go('register')}}>Sign up</button>}
        {user && (
          <>
            <span style={{fontWeight: 600, marginRight: '0.5rem'}}>{user.email.split('@')[0]}</span>
            <button className="btn secondary" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </div>
  )
}
