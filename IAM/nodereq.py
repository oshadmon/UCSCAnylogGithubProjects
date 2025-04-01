import requests

# Define the URL for the process running in the docker container on port 8800
url = "http://127.0.0.1:8800"

# Define the payload with the command you want to run
payload = {"command": "echo STAR"}

try:
    # Make a POST request with the JSON payload
    response = requests.post(url, json=payload)
    
    # Check if the request was successful
    if response.ok:
        print("Response from the process:")
        print(response.text)
    else:
        print(f"Request failed with status code: {response.status_code}")
except Exception as e:
    print(f"An error occurred: {e}")
