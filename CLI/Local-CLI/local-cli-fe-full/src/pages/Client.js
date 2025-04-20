import React, { useState } from 'react';
import DataTable from '../components/DataTable'; // Adjust path as needed
import { sendCommand } from '../services/api'; // Adjust path as needed
import '../styles/Client.css'; // Optional: create client-specific CSS

const Client = ({ node }) => {
  // Since the node is provided as a prop, we no longer need a "Connect info" field.
  const [authUser, setAuthUser] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [command, setCommand] = useState('get status');
  const [method, setMethod] = useState('GET'); // Default to GET
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAuth, setShowAuth] = useState(false);


  const toggleAuth = () => {
    setShowAuth(!showAuth);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const result = await sendCommand({
        connectInfo: node, // Use the provided node (ip:port)
        method,
        command,
        authUser,
        authPassword,
      });

      // If the API returns an array (table data), store it directly.
      if (result.type === "table") {
        setResponse(result.data);
      } else {
        setResponse(
          `Command "${command}" was sent to ${node}.\n\n\n${JSON.stringify(
            result.data,
            null,
            2
          )}`
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-container">
      <h2>Client Dashboard</h2>
      <p>
        <strong>Connected Node:</strong> {node}
      </p>
      <form onSubmit={handleSubmit} className="client-form">
        <div className="form-group">
          <label>HTTP Method:</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>

        {/* Toggle for authentication options */}
        <div className="form-group">
          <button
            type="button"
            className="toggle-auth-button"
            onClick={toggleAuth}
          >
            {showAuth ? 'Hide Authentication Options' : 'Show Authentication Options'}
          </button>
        </div>

        {/* Authentication fields (hidden unless toggled) */}
        {showAuth && (
          <>
            <div className="form-group">
              <label>Auth User:</label>
              <input
                type="text"
                value={authUser}
                onChange={(e) => setAuthUser(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Auth Password:</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Command:</label>
          <textarea
            rows={2}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
        </div>

        <button type="submit" className="send-button">
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div className="response-box">
          {Array.isArray(response) ? (
            <DataTable data={response} />
          ) : (
            <pre>{response}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default Client;
