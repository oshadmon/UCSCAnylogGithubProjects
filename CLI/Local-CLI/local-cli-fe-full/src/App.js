import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './styles/App.css'; // Import your global styles here
import { isLoggedIn } from './services/auth';




// npm i -D react-router-dom ------> NEED TO INSTALL REACT-ROUTER-DOM TO WORK PROPERLY


function App() {
  // localStorage.clear();
  const isAuthenticated =isLoggedIn();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard/*"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        {/* Default Route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
