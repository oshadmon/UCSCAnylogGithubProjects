

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


def make_request(conn, method, command, headers=None):
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
        print("response", response)
        return response.text  # Assuming response is text, change if needed
    except requests.exceptions.RequestException as e:
        print(f"Error making {method.upper()} request: {e}")
        return None


def clean_payload_data(payload: str) -> str:
    """
    Cleans the payload string for PUT or POST requests.
    
    The data is organized as strings where each JSON instance is on a separate line.
    This function replaces extra New-Line (LF), Tab and Carriage Return (CR) characters 
    within each JSON instance with a single space and then rejoins the instances with a newline.
    
    Parameters:
        payload (str): The raw payload string potentially containing extra LF, CR, or tab characters.
    
    Returns:
        str: A cleaned payload string where individual JSON instances are separated by a newline.
    """
    # Split the payload by newline; these are presumed to be the intended JSON instance separators.
    lines = payload.splitlines()
    cleaned_lines = []
    for line in lines:
        # Replace tab (\t) and carriage return (\r) with space.
        cleaned_line = line.replace("\t", " ").replace("\r", " ")
        # Replace any extra whitespace within the line (including additional LF) with a single space.
        cleaned_line = " ".join(cleaned_line.split())
        if cleaned_line:
            cleaned_lines.append(cleaned_line)
    return "\n".join(cleaned_lines)

def execute_put_command(conn: str) -> Dict:
    """
    Executes a PUT request equivalent to the provided curl command.
    
    Curl command:
      curl --location --request PUT '10.0.0.226:32149' \
          --header 'type: json' \
          --header 'dbms: test' \
          --header 'table: table1' \
          --header 'Content-Type: text/plain' \
          --header 'User-Agent: AnyLog/1.23' \
          -w "\n" \
          --data-raw '[{"parentelement": "62e71893-92e0-11e9-b465", ...}]'
    
    Expected output:
      {"AnyLog.status": "Success", "AnyLog.hash": "0dd6b959e48c64818bf4748e4ae0c8cb" }
      
    Parameters:
        conn (str): The host and port, e.g. "10.0.0.226:32149".
    
    Returns:
        Dict: The JSON response from the endpoint if successful, otherwise an empty dict.
    """
    url = f"http://{conn}"
    headers = {
        "type": "json",
        "dbms": "test",
        "table": "table1",
        "Content-Type": "text/plain",
        "User-Agent": "AnyLog/1.23"
    }
    
    raw_data = (
        '[{"parentelement": "62e71893-92e0-11e9-b465", "webid": "F1AbEfLbwwL8F6EiS", "device_name": "ADVA FSP3000R7", "value": 0, "timestamp": "2019-10-11T17:05:08.0400085Z"}]\n'
        '[{"parentelement": "68ae8bef-92e1-11e9-b465", "webid": "F1AbEfLbwwL8F6EiS", "device_name": "Catalyst 3500XL", "value": 50, "timestamp": "2019-10-14T17:22:13.0510101Z"}]\n'
        '[{"parentelement": "68ae8bef-92e1-11e9-b465", "webid": "F1AbEfLbwwL8F6EiS", "device_name": "Catalyst 3500XL", "value": 50, "timestamp": "2019-10-14T17:22:18.0360107Z"}]'
    )

    data_payload = clean_payload_data(raw_data)
    
    try:
        # You can either use the customized make_request or call requests.put directly.
        # Here we call requests.put directly to better mirror the curl command.
        response = requests.put(url, headers=headers, data=data_payload)
        response.raise_for_status()  # Raise error for bad responses
        # The expected output is in JSON format
        result = response.json()
        print("PUT request successful:", result)
        return result
    except requests.exceptions.RequestException as e:
        print("Error executing PUT command:", e)
        return {}


execute_put_command('127.0.0.1:32049')