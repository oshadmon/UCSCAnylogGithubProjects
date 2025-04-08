


// Example: "sendCommand" function that POSTs a command to your server
export async function signup({ email, password, firstName, lastName }) {
    if (!email || !password || !firstName || !lastName) {
        alert('Missing required fields');
        return;
    }

    try {
        // Construct your request body
        // const requestBody = {
        //     info: { email: email, password: password, firstname: firstName, lastname: lastName },
        // };
        const requestBody = { email: email, password: password, firstname: firstName, lastname: lastName };

        // Example: a POST request using fetch
        // The URL here might be constructed using connectInfo or some known base URL
        const response = await fetch(`http://127.0.0.1:8000/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Possibly include auth headers or other tokens here
            },
            body: JSON.stringify(requestBody),
        });

        console.log("Response: ", response);

        // Check if response is okay (2xx)
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status},  ${response}`);
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
