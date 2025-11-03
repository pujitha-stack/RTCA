import React, { useState } from 'react';
import API from '../api';

export default function Signup({ onSignup }){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [fullName,setFullName]=useState('');
  const [error,setError]=useState('');

  const submit = async (e)=>{
    e.preventDefault();
    try{
      const res = await API.post('/api/auth/signup',{ email, password, fullName });
      onSignup(res.data.user);
    }catch(err){ setError(err.response?.data?.error || 'Signup failed'); }
  };

  return (
    <div className="auth-card">
      <h2>Create account</h2>
      <form onSubmit={submit}>
        <div><input className="input" placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} /></div>
        <div style={{marginTop:8}}><input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div style={{marginTop:8}}><input type="password" className="input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div style={{marginTop:12}}><button className="btn">Sign up</button></div>
      </form>
      <small style={{color:'red'}}>{error}</small>
    </div>
  );
}
