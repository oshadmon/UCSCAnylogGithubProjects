import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import Client from './Client';
import Monitor from './Monitor';
// import Policies from './Policies';
// import Presets from './Presets';
import '../styles/Dashboard.css'; // dashboard-specific styles



const Dashboard = () => {
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // Adds a new node (if valid and not already in the list)
  const handleAddNode = (newNode) => {
    if (newNode && !nodes.includes(newNode)) {
      setNodes([...nodes, newNode]);
      // Optionally set it as selected:
      setSelectedNode(newNode);
    }
  };

  return (
    <div className="dashboard-container">
      <TopBar
        nodes={nodes}
        selectedNode={selectedNode}
        onAddNode={handleAddNode}
        onSelectNode={setSelectedNode}
      />
      <div className="dashboard-content">
        <Sidebar />
        <div className="dashboard-main">
          <Routes>
            <Route path="client" element={<Client node = {selectedNode}/>} />
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
