import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { monitor } from '../services/api'; // Ensure this API call is set up correctly

const Monitor = ({ node }) => {
  console.log("Monitor node: ", node);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStartMonitoring = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call the monitor API passing the selected node.
      // Adjust the parameter name if necessary (e.g., { node } or { selectedNode: node })
      const result = await monitor({ node });
      console.log("Monitoring result:", result);
      // Assume the response returns data in result.data as an array of objects.
      setData(result.data);
    } catch (err) {
      setError("Error occurred while monitoring: " + (err.message || err));
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Monitor Section</h2>
      <button onClick={handleStartMonitoring}>
        {loading ? 'Monitoring...' : 'Start Monitoring'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && data.length > 0 && <DataTable data={data} />}
    </div>
  );
};

export default Monitor;
