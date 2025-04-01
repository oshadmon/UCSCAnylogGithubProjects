import React, { useState } from 'react';
import './App.css';
import { sendCommand } from './api'; // Adjust as needed
import TableRenderer from './TableRenderer';

function App() {
  const [activeTab, setActiveTab] = useState('connection');
  const [showAuth, setShowAuth] = useState(false);

  // Form fields
  const [connectInfo, setConnectInfo] = useState('127.0.0.1:32049');
  const [authUser, setAuthUser] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [command, setCommand] = useState('get status');
  const [method, setMethod] = useState('GET'); // Default to POST

  // "Response" from the command
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const toggleAuth = () => {
    setShowAuth(!showAuth);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      // Pass the selected method along with other fields to your API function.
      const result = await sendCommand({
        connectInfo,
        method,
        command
      });

      const responseText = JSON.stringify(result.data, null, 2);
      if (responseText.includes('|') && responseText.includes('---')) {
        console.log("Table response detected");
        setResponse(responseText);
      } else {
        setResponse(`Command "${command}" was sent to ${connectInfo}.\n\n\n${JSON.stringify(result.data, null, 2)}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // const isTableResponse = response && response.includes('|') && response.includes('---');
  const isTableResponse = false;

  return (
    <div className="app-container">
      <div className="tabs">
        <button
          className={activeTab === 'connection' ? 'active' : ''}
          onClick={() => handleTabClick('connection')}
        >
          Connection
        </button>
        <button
          className={activeTab === 'requestOptions' ? 'active' : ''}
          onClick={() => handleTabClick('requestOptions')}
        >
          Request Options
        </button>
        <button
          className={activeTab === 'additionalSettings' ? 'active' : ''}
          onClick={() => handleTabClick('additionalSettings')}
        >
          Additional Settings
        </button>
      </div>

      <form className="form-section" onSubmit={handleSubmit}>
        {activeTab === 'connection' && (
          <div className="connection-tab">
            {/* Dropdown for GET/POST */}
            <div className="form-group">
              <label>HTTP Method:</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>

            <div className="form-group">
              <label>Connect info:</label>
              <input
                type="text"
                value={connectInfo}
                onChange={(e) => setConnectInfo(e.target.value)}
              />
            </div>

            {/* Toggle button for Authentication options */}
            <div className="form-group">
              <button
                type="button"
                className="toggle-auth-button"
                onClick={toggleAuth}
              >
                {showAuth ? 'Hide Authentication Options' : 'Show Authentication Options'}
              </button>
            </div>

            {/* Collapsible Authentication fields */}
            {showAuth && (
              <>
                <div className="form-group">
                  <label>Auth user:</label>
                  <input
                    type="text"
                    value={authUser}
                    onChange={(e) => setAuthUser(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Auth password:</label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-group command-section">
              <label>Command:</label>
              <textarea
                rows={2}
                value={command}
                onChange={(e) => setCommand(e.target.value)}
              />
            </div>
            <button className="send-button" type="submit">
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        )}

        {activeTab === 'requestOptions' && (
          <div className="request-options-tab">
            <h3>Request Options</h3>
            {/* Add your request options fields here */}
          </div>
        )}

        {activeTab === 'additionalSettings' && (
          <div className="additional-settings-tab">
            <h3>Additional Settings</h3>
            {/* Add your additional settings fields here */}
          </div>
        )}
      </form>

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div className="response-box">
          {isTableResponse ? (
            <TableRenderer tableText={response} />
          ) : (
            <pre>{response}</pre>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
