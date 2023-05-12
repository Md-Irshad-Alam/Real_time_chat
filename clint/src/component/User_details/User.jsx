import React, { useEffect, useState } from 'react'
import axios from 'axios'
import style from './style.css'
import Chat from '../Chat/Chat';
function User() {
// const [ user , setuser] = useState([])
const [user, setUser] = useState('');

// Function to handle user submission
// const handleUserSubmit = (e) => {
//   e.preventDefault();
//   // Here you can set the user value based on the user input
//   setUser(e.target.value); // Replace 'John' with the actual user value
// };


  // useEffect(()=>{
  //   axios.get('http://localhost:5000/getuser')
  //   .then(function ({usera}) {
  //     // handle success
  //     setuser(response.data.data)
  //     console.log(response.data.data.username);
    
  //   })
  //   .catch(function (error) {
  //     // handle error
  //     console.log(error);
  //   })
  // },[])
  return (
    <div className='user_sidebar'>
      {
       user.map((ele)=>{
        return(
          <div className='user_card'>
            {ele.username}
            <br />
          </div>
        )
       })
      }
    </div>
  //   <div>
  //   {user ? (
  //     <Chat user={user} />
  //   ) : (
  //     <form onSubmit={handleUserSubmit}>
  //       <input type="text" placeholder="Enter your username" />
  //       <button type="submit">Submit</button>
  //     </form>
  //   )}
  // </div>
  )
}

export default User
