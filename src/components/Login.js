import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Login.css';

function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // await api.post('/auth/login', { name, email });
      await api.post(
        '/auth/login',
        { name, email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // ✅ THIS LINE is the fix
        }
      );
      navigate('/search');
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-bg">
       {/* <img src="/bg3.jpg" alt="dogs" className="bg-image" /> */}
      <form className="glass-box" onSubmit={handleLogin}>
        <h2>WELCOME!!</h2>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
