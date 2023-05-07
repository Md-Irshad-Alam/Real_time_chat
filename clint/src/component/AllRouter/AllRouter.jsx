import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Chat from '../Chat/Chat'
import Join from '../Join/Join'
import Home from '../Message/Home'
function Chatrouter() {
  return (
  
     <div>
        { <Routes>
            <Route path="/chat" element={<Chat/>} />
            <Route path='' element={<Join/>}/>
        </Routes> }
    
   </div>
  )
}

export default Chatrouter
