// src/components/TopBar.js
import React from 'react';
import '../styles/TopBar.css';

const TopBar = () => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <img src="/path/to/logo.png" alt="App Logo" className="logo" />
        <select className="node-picker">
          <option value="node1">Node 1</option>
          <option value="node2">Node 2</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div className="topbar-right">
        <button className="profile-btn">User Profile</button>
      </div>
    </header>
  );
};

export default TopBar;
