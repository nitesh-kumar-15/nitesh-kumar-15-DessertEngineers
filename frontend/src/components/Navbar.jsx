import React from 'react'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

export default function Navbar({ route, go, user }) {
  async function logout() { await signOut(auth); go('home'); }
  return (
    <div className="row" style={{justifyContent:'space-between', width:'100%'}}>
      <div className="row">
        <a href="#" onClick={(e)=>{e.preventDefault();go('home')}} style={{fontWeight:'bold'}}>📚 Book Buddy</a>
        <a href="#" onClick={(e)=>{e.preventDefault();go('home')}}>Browse</a>
        {user && <a href="#" onClick={(e)=>{e.preventDefault();go('add')}}>Add Book</a>}
        {user && <a href="#" onClick={(e)=>{e.preventDefault();go('mylistings')}}>My Listings</a>}
        {user && <a href="#" onClick={(e)=>{e.preventDefault();go('myrequests')}}>Requests</a>}
      </div>
      <div className="row">
        {!user && <a href="#" onClick={(e)=>{e.preventDefault();go('login')}}>Log in</a>}
        {!user && <a href="#" onClick={(e)=>{e.preventDefault();go('register')}}>Sign up</a>}
        {user && <button className="btn secondary" onClick={logout}>Logout</button>}
      </div>
    </div>
  )
}
