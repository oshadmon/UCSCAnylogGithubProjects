// src/components/NodePicker.js
import React, { useState } from 'react';
import { testNetwork } from '../services/api'; // Adjust the import path as necessary
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

  const handleAddConnectedNodes = async () => {
    setError(null);

    try {
      const fetchedNodes = await testNetwork(selectedNode);
      for (const node of fetchedNodes) {
        console.log(node);
        onAddNode(node);
      }

    } catch (err) {
      setError("Failed to test network.");
    }
    console.log("Add connected nodes clicked");
    console.log("Selected node:", selectedNode);
    console.log("All nodes:", nodes);
    console.log("New node:", newNode);
  };

  const applyLocal = () => {
    const updatedNodes = nodes.map((node) => {
      const parts = node.split(':');
      if (local && parts.length === 2) {
        return `127.0.0.1:${parts[1]}`;
      }
      return node; // Return the original node if not in local mode
    });
    return updatedNodes;
  };

  const handleLocalChange = (e) => {
    setLocal(e.target.checked);
    const updatedNodes = applyLocal();
    updatedNodes.forEach((node, index) => {
      nodes[index] = node; // Update the nodes array with the modified or original nodes
    });
    // onSelectNode(updatedNodes[0] || ''); // Optionally select the first node
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
        Use
      </button>
      <button className="node-picker-btn" onClick={handleAddConnectedNodes}>
        Add Connected Nodes
      </button>
      <label className="local-label">
        <input type="checkbox" checked={local} onChange={handleLocalChange} />
        Local
      </label>
    </div>
  );
};

export default NodePicker;





// import React, { useState } from 'react';
// import '../styles/NodePicker.css';

// const NodePicker = ({ onAddNode, onSelectNode, selectedNode }) => {
//   // The user-entered base node for testing the network:
//   const [baseNode, setBaseNode] = useState('');
//   // List of nodes returned from testing the network.
//   const [fetchedNodes, setFetchedNodes] = useState([]);
//   // Whether "Local" mode is enabled.
//   const [local, setLocal] = useState(false);
//   // Error message, if any.
//   const [error, setError] = useState(null);

//   // Simulated network test; replace with your actual API call.
//   const testNetwork = async (base) => {
//     // Here we simply return a dummy list.
//     // (In real code, you’d call your backend endpoint to "test network" based on the base node.)
//     return [
//       "172.24.0.2:32048",
//       "172.24.0.3:32148",
//       "172.24.0.4:32248",
//       "172.24.0.5:32348",
//     ];
//   };

//   // Handle clicking the "Test Network" button.
//   const handleTestNetwork = async () => {
//     setError(null);
//     if (!baseNode.trim()) {
//       setError("Please enter a base node (IP:Port).");
//       return;
//     }
//     try {
//       const nodes = await testNetwork(baseNode.trim());
//       setFetchedNodes(nodes);
//       // Optionally auto-select the first node:
//       if (nodes.length > 0) {
//         let node = nodes[0];
//         if (local) {
//           node = applyLocal(node);
//         }
//         // Add node to parent state and mark it as selected.
//         onAddNode(node);
//         onSelectNode(node);
//       }
//     } catch (err) {
//       setError("Failed to test network.");
//     }
//   };

//   // Function to convert a node's IP into local (127.0.0.1), keeping the port.
//   const applyLocal = (node) => {
//     const parts = node.split(':');
//     // If node is in "ip:port" format, replace ip with 127.0.0.1.
//     if (parts.length === 2) {
//       return `127.0.0.1:${parts[1]}`;
//     }
//     return node;
//   };

//   // Handle the change of the "Local" checkbox.
//   const handleLocalChange = (e) => {
//     const checked = e.target.checked;
//     setLocal(checked);
//     // If a node is already selected, update it.
//     if (selectedNode) {
//       // We assume the original (non-local) node is part of the fetched list.
//       // Find the node in fetchedNodes that ends with the selected port.
//       const port = selectedNode.split(':')[1];
//       const original = fetchedNodes.find(n => n.endsWith(port));
//       const newNode = checked ? applyLocal(original) : original;
//       onSelectNode(newNode);
//     }
//   };

//   // Handle a click on a node row from the table.
//   const handleNodeSelect = (node) => {
//     const finalNode = local ? applyLocal(node) : node;
//     // Optionally add it to the parent's node list.
//     onAddNode(node);
//     onSelectNode(finalNode);
//   };

//   return (
//     <div className="node-picker-container">
//       <div className="node-input-group">
//         <input
//           type="text"
//           className="node-picker-input"
//           placeholder="Enter base node (IP:Port)"
//           value={baseNode}
//           onChange={(e) => setBaseNode(e.target.value)}
//         />
//         <button className="node-picker-btn" onClick={handleTestNetwork}>
//           Test Network
//         </button>
//         <label className="local-label">
//           <input type="checkbox" checked={local} onChange={handleLocalChange} />
//           Local
//         </label>
//       </div>
//       {error && <div className="error">{error}</div>}
//       {fetchedNodes.length > 0 && (
//         <table className="node-picker-table">
//           <thead>
//             <tr>
//               <th>Address</th>
//             </tr>
//           </thead>
//           <tbody>
//             {fetchedNodes.map((node, index) => {
//               const displayNode = local ? applyLocal(node) : node;
//               return (
//                 <tr
//                   key={index}
//                   onClick={() => handleNodeSelect(node)}
//                   className={
//                     // Check whether the node (when formatted based on local) matches the selected one.
//                     displayNode === selectedNode ? "selected" : ""
//                   }
//                 >
//                   <td>{displayNode}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default NodePicker;
