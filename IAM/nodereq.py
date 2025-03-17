import requests

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
    
def process_commands_from_file(file_path):
    try:
        with open(file_path, "r") as file:
            for line in file:
                parts = line.strip().split(" ", 1)
                if len(parts) != 2:
                    print(f"Skipping invalid line: {line.strip()}")
                    continue
                method, command = parts
                response = make_request(method, command)
                if response:
                    print(f"Response for {method} '{command}':", response)
    except FileNotFoundError:
        print(f"File not found: {file_path}")
    except Exception as e:
        print(f"Error processing file: {e}")


if __name__ == "__main__":
    # file_path = input("Enter the path to the command file: ").strip()
    file_path = "test.txt"
    process_commands_from_file(file_path)
