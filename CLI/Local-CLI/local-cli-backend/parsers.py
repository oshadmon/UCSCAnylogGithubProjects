# parsers.py
import json

def parse_table(text: str) -> list:
    """
    Parse a table formatted text into a list of dictionaries.
    Assumes the table uses '|' as delimiter and first row as header.
    """
    lines = text.strip().splitlines()
    if not lines:
        print("No lines found in the input text.")
        return []
    
    # Remove any lines that are purely separators
    # Assume first line is header
    header_line = lines[0]
    headers = [h.strip() for h in header_line.split('  ') if h.strip()]

    
    # Process each row
    data = []
    for line in lines[2:]:
        # print(line)
        # Skip if line is a separator line or empty
        if set(line.strip()) in [{'|'}]:
            continue
        # Remove borders if present and then split
        parts = [p.strip() for p in line.split('|')]
        parts.pop()
        if len(parts) == len(headers):
            row = dict(zip(headers, parts))
            data.append(row)
    return data

def parse_json(text: str) -> dict:
    """
    Parse JSON text into a dictionary.
    """
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {}

def parse_response(raw_text: str) -> dict:
    """
    Unified response parser.
    Checks if the response is JSON, table formatted, or a simple string,
    and returns a standardized JSON structure.
    """

    # Check if text resembles a table (e.g., has headers and delimiters)
    if '|' in raw_text:
        print("FOUND TABLE")
        table_data = parse_table(raw_text)
        if table_data:
            return {"type": "table", "data": table_data}
        
    # Try to parse as JSON first
    parsed = parse_json(raw_text)
    if parsed:
        return {"type": "json", "data": parsed}
    
    
    
    # Otherwise, treat it as a simple message
    return {"type": "string", "data": raw_text.strip()}



raw = '\r\n    Process         Status       Details                                                                     \r\n    ---------------|------------|---------------------------------------------------------------------------|\r\n    TCP            |Running     |Listening on: 10.10.1.31:32348, Threads Pool: 6                            |\r\n    REST           |Running     |Listening on: 23.239.12.151:32349, Threads Pool: 5, Timeout: 20, SSL: False|\r\n    Operator       |Not declared|                                                                           |\r\n    Blockchain Sync|Running     |Sync every 30 seconds with master using: 10.10.1.10:32048                  |\r\n    Scheduler      |Running     |Schedulers IDs in use: [0 (system)] [1 (user)]                             |\r\n    Blobs Archiver |Not declared|                                                                           |\r\n    MQTT           |Not declared|                                                                           |\r\n    Message Broker |Not declared|No active connection                                                       |\r\n    SMTP           |Not declared|                                                                           |\r\n    Streamer       |Not declared|                                                                           |\r\n    Query Pool     |Running     |Threads Pool: 3                                                            |\r\n    Kafka Consumer |Not declared|                                                                           |\r\n    gRPC           |Not declared|                                                                           |\r\n    OPC-UA Client  |Not declared|                                                                           |\r\n    Publisher      |Not declared|                                                                           |\r\n    Distributor    |Not declared|                                                                           |\r\n    Consumer       |Not declared|                                                                           |\r\n'

if __name__ == "__main__":
    print("Testing parse_table")
    table_result = parse_response(raw)
    print("Parsed Table Result:", table_result)