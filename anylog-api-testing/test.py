
# REST connection information (IP + Port) 
import datetime
import json
import random
import requests

import anylog_api.anylog_connector as anylog_connector

# Connect to AnyLog / EdgeLake connector
conn = '10.0.0.11:32249'
# conn = '127.0.0.1:32149'

auth = ()
timeout = 30
anylog_conn = anylog_connector.AnyLogConnector(conn=conn, auth=auth, timeout=timeout)

# Generate and serialize data
DATA = []
for i in range(5):
    DATA.append({
        'dbms': 'anylog_node_db',
        'table': 'rand_data',
        "timestamp": datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f'),
        "value": random.randint(1, 100)
    })

SERIALIZED_DATA = json.dumps(DATA)


if anylog_connector.check_status(anylog_conn=anylog_conn) is True: # validate able to communicate with the node
    # # prepare msg client
    # anylog_conn.post(command=command, topic=None, destination=None, payload=None) # publish message client
    # msg_client = anylog_conn.get(command='get msg client', destination=None)
    # print(msg_client)

    # publish data
    # status = anylog_conn.post(command='data', topic='new-data', destination=None, payload=SERIALIZED_DATA)
    # print('success' if status is True else 'fail')

    # validate data has been published
    msg_client = anylog_conn.get(command='get msg client', destination=None)
    print(msg_client)
    # show streaming
    output = anylog_conn.get(command='get streaming')
    print(output)

# # create message client

# headers = {
#     'command': 'data',
#     'topic': 'new-data',
#     'User-Agent': 'AnyLog/1.23',
#     'Content-Type': 'text/plain'
# }

# # data to POST 
# data = [
#     {"dbms" : "anylog_node_db", "table" : "rand_data", "value": 50, "timestamp": "2019-10-14T17:22:13.051101Z"},
#     {"dbms" : "anylog_node_db", "table" : "rand_data", "value": 501, "timestamp": "2019-10-14T17:22:13.050101Z"},
#     {"dbms" : "anylog_node_db", "table" : "rand_data", "value": 501, "timestamp": "2019-10-14T17:22:13.050101Z"}
# ]

# # Convert to JSON 
# jdata = json.dumps(data) 

# print('Serialized data: %s' % jdata)

# # POST proces 
# command = 'run msg client where broker=rest and user-agent=anylog and log=false and topic=(name=new-data and dbms="bring [dbms]" and table="bring [table]" and column.timestamp.timestamp="bring [timestamp]" and column.value=(type=int and value=bring [value]))'

# try:
#     if anylog_connector.check_status(anylog_conn=anylog_conn) is True: # validate able to communicate with the node
#         anylog_conn.post(command=command, topic=None, destination=None, payload=None) # publish message client
#         msg_client = anylog_conn.get(command='get msg client', destination=None)
#         print(msg_client)

#     r = requests.post('http://%s' % conn, headers=headers, data=SERIALIZED_DATA)
#     r.raise_for_status()

#     if anylog_connector.check_status(anylog_conn=anylog_conn) is True: # validate able to communicate with the node
#         # validate data has been published
#         msg_client = anylog_conn.get(command='get msg client', destination=None)
#         print(msg_client)
#         # show streaming
# except Exception as e: 
#     print('Failed to POST data to %s (Error: %s)' % (conn, e))
# else: 
#     if r.status_code != 200: 
#         print('Failed to POST data to %s due to network error: %s' % (conn, r.status_code))
#     else:
#         print('Success') 

