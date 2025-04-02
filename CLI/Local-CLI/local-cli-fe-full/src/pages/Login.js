// src/pages/Login.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login } from '../services/auth';
import '../styles/App.css';

const Login = () => {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       await login(username, password);
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.message || 'Login failed');
//     }
//   };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {/* <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Username:</label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Log In</button>
      </form> */}
    </div>
  );
};

export default Login;
