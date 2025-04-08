// src/components/NodePicker.js
import React, { useState } from 'react';
import '../styles/NodePicker.css'; // Optional: create a CSS file for node picker styling

const NodePicker = ({ nodes, selectedNode, onAddNode, onSelectNode }) => {
  const [newNode, setNewNode] = useState('');

  const handleAdd = () => {
    // Basic validation: check that new node is not empty, and ideally matches "ip:port" format
    if (newNode.trim()) {
      onAddNode(newNode.trim());
      setNewNode('');
    }
  };

  return (
    <div className="node-picker-container">
      <select
        className="node-picker-select"
        value={selectedNode}
        onChange={(e) => onSelectNode(e.target.value)}
      >
        {nodes.map((node, index) => (
          <option key={index} value={node}>
            {node}
          </option>
        ))}
      </select>
      <input
        className="node-picker-input"
        type="text"
        placeholder="Connection (IP:Port)"
        value={newNode}
        onChange={(e) => setNewNode(e.target.value)}
      />
      <button className="node-picker-btn" onClick={handleAdd}>
        Add
      </button>
    </div>
  );
};

export default NodePicker;
