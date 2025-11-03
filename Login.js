import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

export default function Login({ onLogin }){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');

  const submit = async (e)=>{
    e.preventDefault();
    try{
      const res = await API.post('/api/auth/login',{ email, password });
      onLogin(res.data.user);
    }catch(err){ setError(err.response?.data?.error || 'Login failed'); }
  };

  return (
    <div className="auth-card">
      <h2>Welcome back</h2>
      <form onSubmit={submit}>
        <div><input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div style={{marginTop:8}}><input type="password" className="input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div style={{marginTop:12}}><button className="btn">Login</button></div>
      </form>
      <p style={{marginTop:12}}>Don't have an account? <Link to="/signup">Sign up</Link></p>
      <small style={{color:'red'}}>{error}</small>
    </div>
  );
}
