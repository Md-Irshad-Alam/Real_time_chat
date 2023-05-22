import React, { useEffect, useState } from 'react'
import socketIo from "socket.io-client";
import "./Chat.css";
import {Siavat} from 'react-icons'
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";
import EmojiPicker from '../Emoji/Emoji';
import axios from 'axios'
import {FiDelete} from 'react-icons/fi'
import {user} from '../Join/Join'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
let socket;

const ENDPOINT = "https://chat-server2-g295.onrender.com/";
const Chat = () => {
    const [id, setid] = useState("");
    const [messages, setMessages] = useState([])


    const [users, setUsers] = useState([]);
    const [sender, setSender] = useState("");
    const [receiver, setReceiver] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [activeUser, setActiveUser] = useState("");
  
 
const send = () => {
  const message = document.getElementById("chatInput").value;
  const sender = user;
  const recipient = selectedUser; 
  
  console.log(message)// Add the recipient's username here
  // socket.emit("sendMessage", { sender, message,recipient });
  socket.emit("sendMessage", {
    sender: sender, // The sender's username
    message: message, // The message content
    recipient: selectedUser, // The selected recipient's username
  });
  document.getElementById("chatInput").value = "";

  setMessages((prevMessages) => [
    ...prevMessages,
    { sender, message },
  ]);

};

  const clearChat = () => {
      toast("All chat cleared ")
      socket.emit('clearChat');
      setMessages([]);
      
    };
    
    

    useEffect(()=>{
    
      socket = socketIo(ENDPOINT, { transports: ['websocket'] });

     
      
  
  socket.on('connect', () => {
        toast( `User is joined`)
        setSender(user); 
      });
    
    socket.on('userJoined', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      const joinedUser = { username: data.sender, connected: true, isAdmin: false };
      const currentUser = { username: user, connected: true, isAdmin: true };
   
      setUsers((prevUsers) => [...prevUsers, data.sender === user ? currentUser : joinedUser]);
  
    });

    
    socket.emit('joined', { sender }); 
    
    socket.on('welcome', (data) => {
      // setMessages((prevMessages) => [...prevMessages, data]);
    });
    

    socket.on('disconnect', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      setUsers((prevUsers) => prevUsers.filter((u) => u !== data.sender));
    });
    socket.emit(`Left ${sender}`)

    // clear All chat

    socket.on('chatCleared', () => {
      setMessages([]); // Clear chat messages in the UI
    });

    
    // 

    socket.on("receiveMessage", ({ sender, message }) => {
      if (sender === activeUser) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender, message },
        ]);
      }
    });

    return () => {
      socket.emit('disconnected');
      socket.off();
    };
  },[activeUser]);

  // 'https://chat-server2-g295.onrender.com/getChatHistory'


  useEffect(() => {

    socket.on('sendMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    
    // Retrieve chat history from the server
    axios
    .get('https://chat-server2-g295.onrender.com/getChatHistory', {
      params: { sender, receiver },
    })
    .then((response) => {
      const chatHistory = response.data.data;
      setMessages(chatHistory);
    })
    .catch((error) => {
      console.error(error);
    });

    // Fetch user list
    axios
      .get("http://localhost:5000/getuser", {
        params: { user: user }
      })
      .then((response) => {
        
        setUsers(response.data.data.map((u) => ({ ...u, connected: true })));
      })
      .catch((error) => {
        console.log("Error getting user list:", error);
      });

    return () => {
      socket.off();
    };
  }, [sender, receiver]);

    return (
        <div className="chatPage">
          <div className="user_contaoner">
             <div className="user_container">
                <div className="user-profile">
                  <div className="user-img">
                    <img src="./admin.png" alt="" />
                  </div>
                  <div className="user-name">
                    <p>{user}</p>
                  </div>
                  
                </div>
                <ul>
                {users
                  .filter((user) => !user.isAdmin) // Exclude admin user from the list
                  .map((user) => (
                    <div  className='user-list' key={user.username} onClick={(() =>{
                      setActiveUser(user)
                      setSelectedUser(user.username);
                    })}>
                          <div id="inner-sec">
                            <img src="./profile.png" alt="" />
                            <p>{user.username}</p>
                          </div>
                    </div>
                  ))}
                </ul>
            </div>
        </div>
        {/* conditional renderign  */}
             

          <div className="chatContainer">
          <ToastContainer/>
          <div id='conditions'>
               {
              selectedUser ? (
                  <div className="chatContainer">
                    {/* Chat box content */}
                  </div>
                ) : (
                  <div className="noChatSelected">Please select a user to start chatting</div>
                )
                }
             </div>

            <div className="header">
                <div>
                      <h2>Chatting with {selectedUser}</h2>
                      {/* Close button */}

                  </div>
                <div className="clear-chat" onClick={clearChat}>
                  <p>Clear Chat</p>
                    <FiDelete />
                 </div>
                 
            </div> 
                <ReactScrollToBottom className="chatBox">
                  {messages.map((item, i) => (
                    <Message
                      key={i}
                      user={item.sender}
                      message={item.message}
                      classs={item.sender === user ? 'right' : 'left'}
                    />
                  ))}
                </ReactScrollToBottom>
                <div className="inputBox">
                  <input
                    onKeyPress={(event) => event.key === 'Enter' ? send() : null}
                    type="text"
                    id="chatInput"
                    disabled={!selectedUser} // Disable input if no user is selected
                  />
                  <button onClick={send} className="sendBtn" disabled={!selectedUser}>
                    <img src={sendLogo} alt="Send" />
                  </button>
                </div>
            </div>
      </div>
    )
}

export default Chat
