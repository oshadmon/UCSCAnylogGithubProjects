from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict
from parsers import parse_response
from auth import supabase_signup, supabase_get_user, supabase_login, supabase_logout, supabase_bookmark_node, supabase_get_bookmarked_nodes
from helpers import make_request, grab_network_nodes, monitor_network, make_policy, send_json_data

app = FastAPI()

# Allow CORS (React frontend -> FastAPI backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your React app's URL for security
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Allows all headers
)

app.mount("/static", StaticFiles(directory="static"), name="static")


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
    resp = make_request("23.239.12.151:32349", "GET", "blockchain get *")
    return {"status": resp} 
    # user = supabase_get_user()
    # return {"data": user}

# AUTHENTICATION USING SUPABASE

@app.post("/signup/")
def signup(info: UserSignupInfo):
    print("info", info)
    response = supabase_signup(info.email, info.password, info.firstname, info.lastname)

    print("Resp:", response)
    # print("GET USER", supabase_get_user())
    return {"data": response}

@app.post("/get-user/")
def get_user(token: AccessToken):
    print("getuser token", token)
    user = supabase_get_user(token.jwt)
    # print("token", token.jwt)
    # user = supabase_refresh_session()
    return {"data": user}

@app.post("/login/")
def login(info: UserLoginInfo):  
    response = supabase_login(info.email, info.password)
    return {"data": response}

@app.get("/logout/")
def logout():
    response = supabase_logout()
    print(response)
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

    raw_response = send_json_data(conn=conn.conn, dbms=dbconn.dbms, table=dbconn.table, data=data)

    structured_data = parse_response(raw_response)
    return structured_data


@app.post("/bookmark-node/")
def bookmark_node(token: AccessToken, conn: Connection):
    """
    Bookmark a node by sending a command to the AnyLog server.
    """
    print("token", token.jwt)
    print("node", conn.conn)

    user = supabase_get_user(token.jwt)

    print(user.user.id)

    user_id = user.user.id

    resp = supabase_bookmark_node(user_id, conn.conn)
    print("Bookmark response:", resp)

    return {"data": resp}


@app.post("/get-bookmarked-nodes/")
def get_bookmarked_nodes(token: AccessToken):
    """
    Get all bookmarked nodes for the authenticated user.
    """
    print("token: ", token)
    user = supabase_get_user(token.jwt)
    user_id = user.user.id
    print("User ID:", user_id)
    resp = supabase_get_bookmarked_nodes(user_id)
    print("Bookmarked nodes response:", resp)
    return {"data": resp.data}



@app.post("/view-blobs/")
def view_blobs(conn: Connection, blobs: dict):
    print("conn", conn.conn)
    # print("blobs", blobs['blobs'])
    
    file_list = []
    for blob in blobs['blobs']:
        print("blob", blob)
        # Here you would implement the logic to view the blob

        ip_port = f"{blob['ip']}:{blob['port']}"
        operator_dbms = blob['dbms_name']
        operator_table = blob['table_name']
        operator_file = blob['file']
        file_list.append(operator_file)

        # blobs_dir = "/app/Remote-CLI/djangoProject/static/blobs/current/"
        blobs_dir = "/app/CLI/Local-CLI/local-cli-backend/static/"
        print("IP:Port", ip_port)

        # cmd = f'run client ({ip_port}) file get !!blockchain_file !blockchain_file'
        # cmd = f'run client ({ip_port}) file get !!blobs_dir/{operator_file} !blobs_dir/{operator_file}'

        cmd = f"run client ({ip_port}) file get (dbms = blobs_{operator_dbms} and table = {operator_table} and id = {operator_file}) {blobs_dir}{operator_dbms}.{operator_table}.{operator_file}"  # Add file full path and name for the destination on THIS MACHINE
        raw_response = make_request(conn.conn, "POST", cmd)

        print("raw_response", raw_response)


    return {"data": file_list}



# streaming
# info = (dest_type = rest) 
# for streaming — views.py method stream_process
# uses post
# cmd: source_url = f"http://{ip}:{port}/?User-Agent=AnyLog/1.23?command=file retrieve where dbms={dbms} and table={table} and id={file} and stream = true"

# build image or video or audio (aka any file) viewer




# http://45.33.110.211:31800