import json

# data = [
#     {"timestamp": "2025-01-01 08:15:23", "device": "my-device1", "value": 12},
#     {"timestamp": "2025-01-01 10:32:45", "device": "my-device3", "value": 16},
#     {"timestamp": "2025-01-02 14:05:11", "device": "my-device2", "value": 23},
#     {"timestamp": "2025-01-03 09:47:58", "device": "my-device5", "value": 8},
#     {"timestamp": "2025-01-04 16:12:34", "device": "my-device4", "value": 42},
#     {"timestamp": "2025-01-05 11:29:07", "device": "my-device1", "value": 37},
#     {"timestamp": "2025-01-06 07:55:49", "device": "my-device3", "value": 19},
#     {"timestamp": "2025-01-07 13:22:16", "device": "my-device2", "value": 28},
#     {"timestamp": "2025-01-08 18:40:02", "device": "my-device5", "value": 14},
#     {"timestamp": "2025-01-09 12:03:55", "device": "my-device4", "value": 31},
#     {"timestamp": "2025-01-10 15:17:30", "device": "my-device1", "value": 26},
#     {"timestamp": "2025-01-11 10:44:21", "device": "my-device3", "value": 21},
#     {"timestamp": "2025-01-12 08:08:09", "device": "my-device2", "value": 17},
#     {"timestamp": "2025-01-13 17:33:47", "device": "my-device5", "value": 29},
#     {"timestamp": "2025-01-14 14:59:13", "device": "my-device4", "value": 34}
# ]

# # Write the JSON data to a file
# file_path = 'readings.json'
# with open(file_path, 'w') as f:
#     json.dump(data, f, indent=2)

# print(f"Data saved to {file_path}")


dbms = 'anylog_node_db'
table = 'rand_data'
# Read the JSON data from the file
with open('readings.json', 'r') as f:
    data = json.load(f)
    for record in data:
        record['dbms'] = dbms
        record['table'] = table
    
# Serialize the data to JSON
serialized_data = json.dumps(data)
print(serialized_data)  # Print the serialized data