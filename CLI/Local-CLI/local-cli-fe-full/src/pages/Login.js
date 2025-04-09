// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, isLoggedIn } from '../services/auth';
import '../styles/App.css';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      
      const result = await login({email, password});
      console.log("login result:", result);

      const token = localStorage.getItem('authToken');
      console.log("Stored token after login:", token);

      if (isLoggedIn()) {
        console.log("User is logged in");
        navigate('/dashboard/client');
        window.location.reload();
      } else {
        setError(result.message || "Login failed.");
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        {/* {error && <div className="error">{error}</div>} */}
        <button type="submit">Log In</button>
        {error && <div className="error">{error}</div>}
                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                  Don't have an account? <Link to="/signup">Sign up here</Link>.
                </p>
      </form>
    </div>
  );
};

export default Login;
