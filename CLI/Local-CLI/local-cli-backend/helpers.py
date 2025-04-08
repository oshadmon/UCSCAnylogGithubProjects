

from typing import Dict
import requests


def grab_network_nodes(conn: str) -> Dict:
    make_request(conn, "GET", "test network")


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