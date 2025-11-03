import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import API from './api';
import io from 'socket.io-client';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';

export default function App(){
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    API.get('/api/auth/session').then(res=>{
      if(res.data.user){ setUser(res.data.user); navigate('/chat'); }
    }).catch(()=>{});
  },[]);

  const onLogin = (user) => { setUser(user); navigate('/chat'); };
  const onLogout = async () => { await API.post('/api/auth/logout'); setUser(null); navigate('/'); };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={onLogin} />} />
      <Route path="/signup" element={<Signup onSignup={onLogin} />} />
      <Route path="/chat" element={<Chat user={user} onLogout={onLogout} />} />
    </Routes>
  );
}
