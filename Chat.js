import React, { useEffect, useState, useRef } from 'react';
import API from '../api';
import io from 'socket.io-client';

export default function Chat({ user, onLogout }){
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const messagesRef = useRef(null);

  useEffect(()=>{
    if(!user) return;
    const s = io(process.env.REACT_APP_API_URL || 'http://localhost:4000', { withCredentials: true });
    setSocket(s);
    s.on('connect', ()=> console.log('socket connected'));
    s.on('new-message', msg => { setMessages(m => [...m, msg]); });
    return ()=> s.disconnect();
  },[user]);

  useEffect(()=>{
    if(!user) return;
    API.get('/api/chats').then(res=> setChats(res.data.chats || [])).catch(()=>{});
  },[user]);

  useEffect(()=>{ messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);

  const send = ()=>{
    if(!text.trim() || !socket) return;
    socket.emit('send-message', { chatId: currentChat?._id || 'global', content: text });
    setText('');
  };

  const createGlobal = async ()=>{
    try{
      const res = await API.post('/api/chats', { title: 'Global', participantIds: [user.id] });
      setChats(c => [res.data.chat, ...c]);
      setCurrentChat(res.data.chat);
    }catch(err){ console.error(err); }
  };

  return (
    <div style={{padding:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Welcome, {user?.fullName || user?.email}</h2>
        <div><button className="btn" onClick={onLogout}>Logout</button></div>
      </div>
      <div className="container">
        <div className="sidebar">
          <h4>Your Chats</h4>
          <div style={{marginTop:12}}><button className="btn" onClick={createGlobal}>Create Global Room</button></div>
          <div style={{marginTop:12}}>
            {chats.map(c=> (<div key={c._id} className="user-item" onClick={()=>{ setCurrentChat(c); API.get('/api/messages',{ params:{ chatId: c._id } }).then(r=> setMessages(r.data.messages || [])).catch(()=>{}); }}>{c.title || 'Unnamed'}</div>))}
          </div>
        </div>
        <div className="main">
          <div className="header"><strong>{currentChat? currentChat.title : 'No chat selected'}</strong></div>
          <div className="messages" ref={messagesRef}>
            {messages.map(m => (<div key={m._id} className={'message ' + (m.senderId===user?.id ? 'me' : '')}><b>{m.senderName || m.senderId}</b>: {m.content}</div>))}
          </div>
          <div className="compose">
            <input className="input" style={{flex:1}} value={text} onChange={e=>setText(e.target.value)} placeholder="Message..." />
            <button className="btn" onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
