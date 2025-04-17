import React, { useState } from "react";
// import { addData } from "../services/api";
import "../styles/AddData.css";

const AddData = ({ node }) => {
  const [dbmsName, setDbmsName] = useState("");
  const [tableName, setTableName] = useState("");
  const [data, setData] = useState({});
  const [field, setField] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);

  // Add a field-value pair to the data object
  const addFieldValue = () => {
    if (!field.trim() || !value.trim()) return;
    setData({ ...data, [field]: value });
    setField("");
    setValue("");
  };

  // Remove a field
  const removeField = (key) => {
    const updated = { ...data };
    delete updated[key];
    setData(updated);
  };

  // Submit the data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSubmittedId(null);

    console.log("Node:", node);

    // if (!dbmsName.trim() || !tableName.trim()) {
    //   setError("Please enter both DBMS name and table name.");
    //   setLoading(false);
    //   return;
    // }

    // try {
    //   const payload = { connectInfo: node, dbms: dbmsName, table: tableName, data };
    //   const result = await addData(payload);
    //   // Assume API returns inserted ID in result.data.id
    //   setSubmittedId(result.data.id);
    // } catch (err) {
    //   setError(err.message || "Failed to add data.");
    // } finally {
      setLoading(false);
    // }
  };

  return (
    <div className="container">
      <h2>Add Data</h2>

      {/* DBMS name input */}
      <input
        type="text"
        placeholder="DBMS Name"
        value={dbmsName}
        onChange={(e) => setDbmsName(e.target.value)}
        className="text-input"
      />

      {/* Table name input */}
      <input
        type="text"
        placeholder="Table Name"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
        className="text-input"
      />

      {/* Field-Value Input Group */}
      <div className="input-group">
        <input
          type="text"
          placeholder="Field"
          value={field}
          onChange={(e) => setField(e.target.value)}
        />
        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={addFieldValue}>Add</button>
      </div>

      {/* Display data object */}
      <h3>Data Payload:</h3>
      <ul className="data-list">
        {Object.entries(data).map(([k, v]) => (
          <li key={k}>
            <strong>{k}:</strong> {v} <button className="remove-btn" onClick={() => removeField(k)}>✖</button>
          </li>
        ))}
      </ul>

      {/* JSON preview */}
      <h3>JSON Preview:</h3>
      <pre className="json-preview">{JSON.stringify({ [dbmsName]: { table: tableName, data } }, null, 2)}</pre>

      {/* Submit button */}
      <button onClick={handleSubmit} className="submit-btn" disabled={loading}>
        {loading ? "Submitting..." : "Submit Data"}
      </button>

      {error && <div className="error-message">{error}</div>}

      {/* Show ID after submission */}
      {submittedId && (
        <div className="id-box">
          <p>Data inserted successfully!</p>
          <p><strong>ID:</strong> {submittedId}</p>
        </div>
      )}
    </div>
  );
};

export default AddData;
