// src/components/NodePicker.js
import React, { useState } from 'react';
import { getConnectedNodes } from '../services/api'; // Adjust the import path as necessary
import '../styles/NodePicker.css'; // Optional: create a CSS file for node picker styling

const NodePicker = ({ nodes, selectedNode, onAddNode, onSelectNode }) => {
  const [newNode, setNewNode] = useState('');
  const [error, setError] = useState(null);
  const [local, setLocal] = useState(false);


  const handleAdd = () => {
    // Basic validation: check that new node is not empty, and ideally matches "ip:port" format
    if (newNode.trim()) {
      onAddNode(newNode.trim());
      onSelectNode(newNode.trim());
      setNewNode('');
    }
  };

  const handleAddConnectedNodes = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log("Selected Node is thi:", selectedNode);
      const fetchedNodes = await getConnectedNodes({ selectedNode });
      for (const node of fetchedNodes.data) {
        console.log(node);
        onAddNode(node);
      }

    } catch (err) {
      setError("Failed to test network.");
    }
  };

  // const applyLocal = () => {
  //   const updatedNodes = nodes.map((node) => {
  //     const parts = node.split(':');
  //     if (local && parts.length === 2) {
  //       return `127.0.0.1:${parts[1]}`;
  //     }
  //     return node; // Return the original node if not in local mode
  //   });
  //   return updatedNodes;
  // };

  // const handleLocalChange = (e) => {
  //   setLocal(e.target.checked);
  //   const updatedNodes = applyLocal();
  //   updatedNodes.forEach((node, index) => {
  //     nodes[index] = node; // Update the nodes array with the modified or original nodes
  //   });
  //   // onSelectNode(updatedNodes[0] || ''); // Optionally select the first node
  // };


  const makeLocal = (node, isLocal) => {
    if (!node) return node;  // Return if node is empty
    const parts = node.split(':');
    if (isLocal && parts.length === 2) {  // Check if local is true and node is in "ip:port" format
      console.log("MADE LOCAL")
      return `127.0.0.1:${parts[1]}`;
    }
    return node;
  };

  const handleLocalChange = (e) => {
    const isLocal = e.target.checked;
    setLocal(isLocal);
    console.log("Local mode is now:", e.target.checked);
    // console.log("makeLocal is now:", makeLocal(selectedNode));
    onSelectNode(makeLocal(selectedNode, isLocal));
  }


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
        Use
      </button>
      <button className="node-picker-btn" onClick={handleAddConnectedNodes}>
        Add Connected Nodes
      </button>
      <label className="local-label">
        <input type="checkbox" checked={local} onChange={handleLocalChange} />
        Local
      </label>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default NodePicker;

