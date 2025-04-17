
from pydantic import BaseModel
from typing import Dict
import requests
from parsers import parse_response
import datetime
import json
import requests

import anylog_api.anylog_connector as anylog_connector

# Connect to AnyLog / EdgeLake connector
conn = '10.0.0.11:32249'
# conn = '127.0.0.1:32149'

auth = ()
timeout = 30
anylog_conn = anylog_connector.AnyLogConnector(conn=conn, auth=auth, timeout=timeout)

class Policy(BaseModel):
    name: str  # Policy name
    data: Dict[str, str]  # Key-value pairs


def monitor_network(conn: str) -> Dict:
    raw_response = make_request(conn, "GET", "get monitored operators")
    structured_data = parse_response(raw_response)
    data = structured_data.get("data", {})
    vals = list(data.values())
    monitored_nodes_filtered = filter_dicts_by_keys(vals, [
        "Node",
        "node name",
        "operational time",
        "elapsed time",
        "new rows",
        "total rows",
        "Free Space Percent",
        "CPU Percent",
        "Packets Recv",
        "Packets Sent",
        "Network Error"
      ])
    return monitored_nodes_filtered

def filter_dicts_by_keys(dict_list, keys_to_keep):
    """
    Filters each dictionary in dict_list to keep only the keys in keys_to_keep.

    Parameters:
        dict_list (list of dict): The list of dictionaries to filter.
        keys_to_keep (list of str): The list of keys to retain in each dictionary.

    Returns:
        list of dict: A new list of dictionaries containing only the specified keys.
    """
    return [
        {key: d[key] for key in keys_to_keep if key in d}
        for d in dict_list
    ]

def grab_network_nodes(conn: str) -> Dict:
    raw_response = make_request(conn, "GET", "test network")
    print(raw_response)

    structured_data = parse_response(raw_response)
    data = structured_data.get("data", {})

    connected_nodes = [node['Address'] for node in data if node['Status'] == "+"]
    connected_nodes = [node[:-1] + "9" for node in connected_nodes]
    return connected_nodes


def make_policy(conn:str, policy: Policy):
    # Construct the policy command
    policy_command = f'{policy.name} = create policy {policy.name} where '
    key_value_pairs = [f"{k} = {v}" for k, v in policy.data.items()]
    policy_command += " and ".join(key_value_pairs)

    # Submit the policy (POST)
    print(f"Submitting Policy: {policy_command}")
    make_request(conn, "POST", policy_command)

    # Retrieve the created policy (GET)
    get_policy_command = f"get !{policy.name}"
    print(f"Fetching Policy: {get_policy_command}")
    policy_response = make_request(conn, "GET", get_policy_command)
    print(f"Policy Response: {policy_response}")

    # Get the master node IP/Port (POST)
    master_node_command = 'mnode = blockchain get master bring.ip_port'
    print(f"Fetching Master Node: {master_node_command}")
    make_request(conn, "POST", master_node_command)

    # Retrieve master node info (GET)
    get_master_command = "get !mnode"
    print(f"Fetching Master Node Info: {get_master_command}")
    master_node_response = make_request(conn, "GET", get_master_command)
    print(f"Master Node Response: {master_node_response}")

    # Insert policy into blockchain (POST)
    blockchain_insert_command = f"blockchain insert where policy = !{policy.name} and local = true and master = !mnode"
    print(f"Inserting Policy into Blockchain: {blockchain_insert_command}")
    make_request(conn, "POST", blockchain_insert_command)

    # Retrieve the policy from the blockchain (POST)
    blockchain_get_command = f"blockchain get {policy.name}"
    print(f"Fetching Policy from Blockchain: {blockchain_get_command}")
    blockchain_response = make_request(conn, "POST", blockchain_get_command)
    print(f"Blockchain Policy Response: {blockchain_response}")

    return blockchain_response

def make_request(conn, method, command, topic=None, destination=None, payload=None):


    auth = ()
    timeout = 30
    anylog_conn = anylog_connector.AnyLogConnector(conn=conn, auth=auth, timeout=timeout)


    if command.startswith("run client () sql"):
        destination = 'network'
        command = command.replace("run client () ", '')
    elif command.startswith("run client ("):
        end_index = command.find(")")
        if end_index != -1:
            destination = command[len("run client ("):end_index].strip()
            command = command[end_index + 1:].strip()
    

    print("conn", conn)
    print("command", command)
    print("destination", destination)

    # url = f"http://{conn}"
    # # url = "http://127.0.0.1:32049" "23.239.12.151:32349"
    # headers = {
    #     "User-Agent": "AnyLog/1.23",
    #     "command": command,
    # }
    
    try:
        if method.upper() == "GET":
            response = anylog_conn.get(command=command, destination=destination)
            # response = requests.get(url, headers=headers)
        elif method.upper() == "POST":
            response = anylog_conn.post(command=command, topic=topic, destination=destination, payload=payload)
            # response = requests.post(url, headers=headers)
        else:
            raise ValueError("Invalid method. Use 'GET' or 'POST'.")
        
        # response.raise_for_status()  # Raise an error for bad status codes
        print("response", response)
        return response  # Assuming response is text, change if needed
    except requests.exceptions.RequestException as e:
        print(f"Error making {method.upper()} request: {e}")
        return None

# blockchain delete policy where id = a29bcfd55cef20c6834f29fbb3aaf882 and master = 172.24.0.2:32048