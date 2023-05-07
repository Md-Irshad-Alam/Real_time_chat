import React from 'react'
import { Link } from 'react-router-dom'
import style from './style.css'
function ChatNavbar() {
  return (
    
      <div className='container' >
        
       <div className='right_part'>
        <Link to="/">Home</Link>
       </div>
       <div className='left_part'>
        <Link to='login'>Login</Link>
        <Link to='register'>Sign_Up</Link>
        <Link to='chating'>Live Chat</Link>
        <img src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg" alt="logo" />
       </div>
        
    </div> 
    
  )
}

export default ChatNavbar;
