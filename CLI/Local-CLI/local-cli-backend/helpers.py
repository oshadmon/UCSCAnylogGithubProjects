

from typing import Dict
import requests
from parsers import parse_response

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
    