// src/services/api.js

// Example: "sendCommand" function that POSTs a command to your server
export async function sendCommand({ connectInfo, method, command }) {
  if (!connectInfo || !command || !method) {
    alert('Missing required fields');
    return;
  }

  try {
    // Construct your request body
    const requestBody = {
      command: { type: method, cmd: command },
      conn: { conn: connectInfo },
    };

    // Example: a POST request using fetch
    // The URL here might be constructed using connectInfo or some known base URL
    const response = await fetch(`http://127.0.0.1:8000/send-command`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Possibly include auth headers or other tokens here
      },
      body: JSON.stringify(requestBody),
    });

    // Check if response is okay (2xx)
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Optionally handle errors
    console.error('Error sending command:', error);
    throw error; // re-throw so the component knows there was an error
  }
}

export async function getConnectedNodes({ selectedNode }) {
  const connectInfo = selectedNode;
  console.log("getConnectedNodes called with connectInfo:", connectInfo);
  if (!connectInfo) {
    alert('Missing required fields');
    return;
  }

  try {
    const requestBody = { conn: connectInfo };

    const response = await fetch(`http://127.0.0.1:8000/get-network-nodes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Possibly include auth headers or other tokens here
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response: ", response);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status},  ${response}`);
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Optionally handle errors
    console.error('Error getting nodes:', error);
    throw error; // re-throw so the component knows there was an error
  }
}



export async function monitor({ node }) {
  const connectInfo = node;
  console.log("getConnectedNodes called with connectInfo:", connectInfo);
  if (!connectInfo) {
    alert('Missing required fields');
    return;
  }

  try {
    const requestBody = { conn: connectInfo };

    const response = await fetch(`http://127.0.0.1:8000/monitor/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Possibly include auth headers or other tokens here
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response: ", response);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status},  ${response}`);
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Optionally handle errors
    console.error('Error getting nodes:', error);
    throw error; // re-throw so the component knows there was an error
  }
}


export async function submitPolicy({ connectInfo, policy }) {
  if (!connectInfo || !policy) { 
    alert('Missing required fields');
    return;
  }

  try {

    const requestBody = { conn: {conn: connectInfo}, policy: policy };

    const response = await fetch(`http://127.0.0.1:8000/submit-policy/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Possibly include auth headers or other tokens here
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response: ", response);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status},  ${response}`);
    }

    // Parse JSON response
    const respData = await response.json();
    return respData;
  } catch (error) {
    // Optionally handle errors
    console.error('Error getting nodes:', error);
    throw error; // re-throw so the component knows there was an error
  }
}