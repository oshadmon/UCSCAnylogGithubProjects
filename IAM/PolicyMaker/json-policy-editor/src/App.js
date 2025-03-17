import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [policyName, setPolicyName] = useState("");
  const [policyData, setPolicyData] = useState({});
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  // Add a key-value pair to the policy dictionary
  const addKeyValuePair = () => {
    if (key.trim() === "" || value.trim() === "") return;
    setPolicyData({ ...policyData, [key]: value });
    setKey("");
    setValue("");
  };

  // Remove a key from the policy dictionary
  const removeKey = (keyToRemove) => {
    const updatedData = { ...policyData };
    delete updatedData[keyToRemove];
    setPolicyData(updatedData);
  };

  // Submit the policy
  const submitPolicy = async () => {
    if (!policyName.trim()) {
      alert("Please enter a policy name.");
      return;
    }

    const policy = { name: policyName, data: policyData };
    const url = "http://127.0.0.1:8000/submit-policy/"; // FastAPI endpoint

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(policy),
      });


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit policy");
      }

      const result = await response.json();
      console.log("Response:", result);
      alert("Policy submitted successfully!");
    } catch (error) {
      console.error("Error submitting policy:", error);
      alert("Error submitting policy!");
    }
  };

  return (
    <div className="container">
      <h2>Policy Editor</h2>

      {/* Policy Name Input */}
      <input
        type="text"
        placeholder="Enter Policy Name"
        value={policyName}
        onChange={(e) => setPolicyName(e.target.value)}
        className="policy-name-input"
      />

      {/* Key-Value Pair Inputs */}
      <div className="input-group">
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={addKeyValuePair}>Add</button>
      </div>

      {/* Display Key-Value Pairs */}
      <h3>Policy Data:</h3>
      <ul className="policy-list">
        {Object.entries(policyData).map(([k, v]) => (
          <li key={k}>
            <strong>{k}:</strong> {v}{" "}
            <button className="remove-btn" onClick={() => removeKey(k)}>
              ✖
            </button>
          </li>
        ))}
      </ul>

      {/* Display Full JSON */}
      <h3>Generated JSON Policy:</h3>
      <pre className="json-preview">
        {JSON.stringify({ [policyName]: policyData }, null, 2)}
      </pre>

      {/* Submit Button */}
      <button onClick={submitPolicy} className="submit-btn">
        Submit Policy
      </button>
    </div>
  );
};

export default App;
