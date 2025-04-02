import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import Client from './Client';
import Monitor from './Monitor';
// import Policies from './Policies';
// import Presets from './Presets';
import '../styles/Dashboard.css'; // dashboard-specific styles

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <TopBar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="dashboard-main">
          <Routes>
            <Route path="client" element={<Client />} />
            <Route path="monitor" element={<Monitor />} />
            {/* <Route path="policies" element={<Policies />} /> */}
            {/* <Route path="presets" element={<Presets />} /> */}
            {/* Default view */}
            <Route path="*" element={<Client />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
