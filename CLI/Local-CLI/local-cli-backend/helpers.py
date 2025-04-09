

from typing import Dict
import requests
from parsers import parse_response


def grab_network_nodes(conn: str) -> Dict:
    raw_response = make_request(conn, "GET", "test network")
    print(raw_response)

    structured_data = parse_response(raw_response)
    data = structured_data.get("data", {})

    connected_nodes = [node['Address'] for node in data if node['Status'] == "+"]
    connected_nodes = [node[:-1] + "9" for node in connected_nodes]
    return connected_nodes


def make_request(conn, method, command):
    print("conn", conn)

    url = f"http://{conn}"
    # url = "http://127.0.0.1:32049" "23.239.12.151:32349"
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
    
