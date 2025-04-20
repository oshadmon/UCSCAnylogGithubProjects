from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
from parsers import parse_response, infer_schema, build_msg_client_command, prep_to_add_data, parse_check_clients
from auth import supabase_signup, supabase_get_user, supabase_login, supabase_logout
from helpers import make_request, grab_network_nodes, monitor_network, make_policy

app = FastAPI()

# Allow CORS (React frontend -> FastAPI backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your React app's URL for security
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Allows all headers
)
class Connection(BaseModel):
    conn: str

class DBConnection(BaseModel):
    dbms: str
    table: str

class Command(BaseModel):
    type: str # "GET" or "POST"
    cmd: str

class UserSignupInfo(BaseModel):
    email: str
    password: str
    firstname: str
    lastname: str

class UserLoginInfo(BaseModel):
    email: str
    password: str

class AccessToken(BaseModel):
    jwt: str

class Policy(BaseModel):
    name: str  # Policy name
    data: Dict[str, str]  # Key-value pairs

@app.get("/")
def get_status():
    # print("GET STATUS RUNNING")
    # resp = make_request("23.239.12.151:32349", "GET", "blockchain get *")
    # return {"status": resp} 
    user = supabase_get_user()
    return {"data": user}

# AUTHENTICATION USING SUPABASE

@app.post("/signup/")
def signup(info: UserSignupInfo):
    print("info", info)
    response = supabase_signup(info.email, info.password, info.firstname, info.lastname)

    print("Resp", response)
    # print("GET USER", supabase_get_user())
    return {"data": response}

@app.post("/get-user/")
def get_user(token: AccessToken):
    user = supabase_get_user(token.jwt)
    return {"data": user}

@app.post("/login/")
def login(info: UserLoginInfo):  
    response = supabase_login(info.email, info.password)
    return {"data": response}

@app.get("/logout/")
def logout():
    response = supabase_logout()
    return {"data": response}



# NODE API ENDPOINTS

@app.post("/send-command/")
def send_command(conn: Connection, command: Command):
    raw_response = make_request(conn.conn, command.type, command.cmd)
    print("raw_response", raw_response)

    structured_data = parse_response(raw_response)
    print("structured_data", structured_data)
    return structured_data

@app.post("/get-network-nodes/")
def get_connected_nodes(conn: Connection):
    connected_nodes = grab_network_nodes(conn.conn)
    return {"data": connected_nodes}

@app.post("/monitor/")
def monitor(conn: Connection):
    monitored_nodes = monitor_network(conn.conn)
    return {"data": monitored_nodes}

@app.post("/submit-policy/")
def submit_policy(conn: Connection, policy: Policy):
    print("conn", conn)
    print("policy", policy)
    raw_response = make_policy(conn.conn, policy)

    structured_data = parse_response(raw_response)
    return structured_data


@app.post("/add-data/")
def send_data(conn: Connection, dbconn: DBConnection, data: list[Dict]):
    print("conn", conn.conn)
    print("db", dbconn.dbms)
    print("table", dbconn.table)
    print("data", type(data))

    # infer the schema of the data
    inferred_schema = infer_schema(data)

    # build the msg client command
    msg_client_cmd = build_msg_client_command(inferred_schema)
    print("msg_client_cmd", msg_client_cmd)

    # prep data with dbms and table
    prepped_data = prep_to_add_data(data, dbconn.dbms, dbconn.table)

    # check for existing msg client
    check_clients = make_request(conn.conn, "GET", "get msg client where topic = new-data")
    if "No message client subscriptions" in check_clients:
        # create new client
        resp = make_request(conn.conn, "POST", msg_client_cmd)
        print("New Client:", resp)
    else: 
        # get old client id
        old_client_id = parse_check_clients(check_clients)
        print(old_client_id)

        # kill old client
        kill_cmd = f'exit msg client {old_client_id}'
        make_request(conn.conn, "POST", kill_cmd)

        # create new client
        resp = make_request(conn.conn, "POST", msg_client_cmd)
        print("New Client:", resp)

    # send data
    response = make_request(conn=conn.conn, method="POST", command='data', topic='new-data', payload=prepped_data)
    print("Data send resp:", response)

    # get streaming to check if data was sent
    response = make_request(conn.conn, "GET", "get streaming")
    print("Streaming:", response)

    return {"data": response}