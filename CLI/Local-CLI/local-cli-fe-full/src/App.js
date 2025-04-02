import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './styles/App.css'; // Import your global styles here

function App() {
  const isAuthenticated = /* your auth logic here (e.g., token check) */ true;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
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
