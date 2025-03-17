from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
import requests

app = FastAPI()

# Allow CORS (React frontend -> FastAPI backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your React app's URL for security
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Allows all headers
)


# In-memory storage for policies
policies = {}

# Policy model (policy name is dynamic, so we store a dictionary)
class Policy(BaseModel):
    name: str  # Policy name
    data: Dict[str, str]  # Key-value pairs

@app.get("/")
def get_status():
    result = make_request("GET", "get status")
    return {"status": result}

@app.post("/submit-policy/")
def submit_policy(policy: Policy):
    if policy.name in policies:
        raise HTTPException(status_code=400, detail="Policy already exists")
    
    policies[policy.name] = policy.data

    make_policy(policy)

    return {"message": f"Policy '{policy.name}' successfully created, added to blockchain, and retrieved!"}

@app.get("/get-policies/")
def get_policies():
    return policies



def make_policy(policy: Policy):
    # Construct the policy command
    policy_command = f'{policy.name} = create policy {policy.name} where '
    key_value_pairs = [f"{k} = {v}" for k, v in policy.data.items()]
    policy_command += " and ".join(key_value_pairs)

    # Submit the policy (POST)
    print(f"Submitting Policy: {policy_command}")
    make_request("POST", policy_command)

    # Retrieve the created policy (GET)
    get_policy_command = f"get !{policy.name}"
    print(f"Fetching Policy: {get_policy_command}")
    policy_response = make_request("GET", get_policy_command)
    print(f"Policy Response: {policy_response}")

    # Get the master node IP/Port (POST)
    master_node_command = 'mnode = blockchain get master where city = "San Diego" bring.ip_port'
    print(f"Fetching Master Node: {master_node_command}")
    make_request("POST", master_node_command)

    # Retrieve master node info (GET)
    get_master_command = "get !mnode"
    print(f"Fetching Master Node Info: {get_master_command}")
    master_node_response = make_request("GET", get_master_command)
    print(f"Master Node Response: {master_node_response}")

    # Insert policy into blockchain (POST)
    blockchain_insert_command = f"blockchain insert where policy = !{policy.name} and local = true and master = !mnode"
    print(f"Inserting Policy into Blockchain: {blockchain_insert_command}")
    make_request("POST", blockchain_insert_command)

    # Retrieve the policy from the blockchain (POST)
    blockchain_get_command = f"blockchain get {policy.name}"
    print(f"Fetching Policy from Blockchain: {blockchain_get_command}")
    blockchain_response = make_request("POST", blockchain_get_command)
    print(f"Blockchain Policy Response: {blockchain_response}")






def make_request(method, command):
    url = "http://127.0.0.1:32049"
    headers = {
        "User-Agent": "AnyLog/1.23",
        "command": command,
    }
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers)
        elif method.upper() == "POST":
            response = requests.post(url, headers=headers)
        else:
            raise ValueError("Invalid method. Use 'GET' or 'POST'.")
        
        response.raise_for_status()  # Raise an error for bad status codes
        return response.text  # Assuming response is text, change if needed
    except requests.exceptions.RequestException as e:
        print(f"Error making {method.upper()} request: {e}")
        return None