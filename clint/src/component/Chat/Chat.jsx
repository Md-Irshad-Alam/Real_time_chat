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
import {user} from '../Join/Join'
let socket;

const ENDPOINT = "https://chatserver-3fp6.onrender.com";

const Chat = () => {
    const [id, setid] = useState("");
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([]);
   


    const send = () => {
        const message = document.getElementById('chatInput').value;
        const sender = user; // Replace with the actual sender value
        socket.emit('sendMessage', { sender, message });
        document.getElementById('chatInput').value = '';
      };

    useEffect(()=>{
    socket = socketIo(ENDPOINT, { transports: ['websocket'] });

    socket.on('connect', () => {
     window.alert('Connected');
    });

    socket.emit('joined', { user });
    

    socket.on('welcome', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('userJoined', (data) => {
        console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);
      setUsers((prevUsers) => [...prevUsers, data.sender]);
    });

    socket.on('disconnect', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      setUsers((prevUsers) => prevUsers.filter((u) => u !== data.sender));
    });

    // Rest of the socket event listeners...

    return () => {
      socket.emit('disconnected');
      socket.off();
    };
  }, []);



  useEffect(() => {
    socket.on('sendMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  
    // Retrieve chat history from the server
    
         axios.get('https://chatserver-3fp6.onrender.com/getChatHistory', {
            params: { user: user }, // Pass the logged-in user's username as a parameter
        })
        .then((response) => {
            const chatHistory = response.data.data;
            setMessages(chatHistory);
        })
        .catch((error) => {
            console.error(error);
        });
        // getting userlit 
         
    return () => {
      socket.off();
    };
  }, [users]);
  console.log(users);
    return (
        <div className="chatPage">
          <div className="user_contaoner">
        <div className="user_container">
      
                       <div className="user-profile">
                            <div className="user-img">
                            <img src="./logo-2.png" alt="" />
                            </div>
                            <div className="user-name">
                                <p>Md irshad</p>
                            </div>
                       </div>
                        <ul>
                            {users.map((user) => (
                            <li key={user}>{user}</li>
                            ))}
                        </ul>
     
    
        </div>
          </div>
            <div className="chatContainer">
                <div className="header">
                    <h2>Start Chating... </h2>
                    <a href="/"> <img src={closeIcon} alt="Close" /></a>
                </div>
                <ReactScrollToBottom className="chatBox">
                {
                    users.length >0 ? 
                    messages.map((item, i) => (
                        <Message
                            key={i}
                            user={item.sender}
                            message={item.message}
                            classs={item.sender === user ? 'right' : 'left'}
                        />
                        ))
                     :""
                 }
                
                </ReactScrollToBottom>
                <div className="inputBox">
                    <input onKeyPress={(event) => event.key === 'Enter' ? send() : null} type="text" id="chatInput" />
                    <button onClick={send} className="sendBtn"><img src={sendLogo} alt="Send" /></button>
                    
                </div>
  

            </div>

        </div>
    )
}

export default Chat
