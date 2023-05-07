import React, { useEffect, useState } from 'react'
import { user } from "../Join/Join";
import socketIo from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";
import EmojiPicker from '../Emoji/Emoji';
let socket;

const ENDPOINT = "http://localhost:5000/";

const Chat = () => {
    const [id, setid] = useState("");
    const [messages, setMessages] = useState([])

    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const handleEmojiSelect = (emoji) => {
      setSelectedEmoji(emoji);
    };
   
console.log(messages)
    const send = () => {
        const message = document.getElementById('chatInput').value;
        socket.emit('message', { message, id });
        document.getElementById('chatInput').value = "";
        console.log(user +" "+ message);
    }

    console.log(messages);
    useEffect(() => {
        socket = socketIo(ENDPOINT, { transports: ['websocket'] });

        socket.on('connect', () => {
            alert('Connected');
            setid(socket.id);
            

        })
        console.log(socket);
        socket.emit('joined', { user})

        socket.on('welcome', (data) => {
            setMessages([...messages, data]);
            
        })

        socket.on('userJoined', (data) => {
            setMessages([...messages, data]);
            
        })

        socket.on('leave', (data) => {
            setMessages([...messages, data]);
          
        })

        return () => {
            socket.emit('disconnected');
            socket.off();
        }
    }, [])

    useEffect(() => {
        socket.on('sendMessage', (data) => {
            setMessages([...messages, data]);
            
        })
        return () => {
            socket.off();
        }
    }, [messages])

    return (
        <div className="chatPage">
            <div className="chatContainer">
                <div className="header">
                    <h2>Start Chating... </h2>
                    <a href="/"> <img src={closeIcon} alt="Close" /></a>
                </div>
                <ReactScrollToBottom className="chatBox">
                    {messages.map((item, i) => <Message user={item.id === id ? '' : item.user} message={item.message} classs={item.id === id ? 'right' : 'left'} />)}
                </ReactScrollToBottom>
                <div className="inputBox">
                    <input onKeyPress={(event) => event.key === 'Enter' ? send() : null} type="text" id="chatInput" />
                    <button onClick={send} className="sendBtn"><img src={sendLogo} alt="Send" /></button>
                    
                </div>
        {/* <div>
            <h3>Select an Emoji:</h3>
            <EmojiPicker onSelect={handleEmojiSelect} />
            {selectedEmoji && (
                <div>
                <h3>You selected:</h3>
                <div>{String.fromCodePoint(`0x${selectedEmoji.unified}`)}</div>
                </div>
             )}
        </div> */}

            </div>

        </div>
    )
}

export default Chat
