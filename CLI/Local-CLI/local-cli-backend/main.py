from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from parsers import parse_response
from auth import supabase_signup
from helpers import make_request

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

class Command(BaseModel):
    type: str # "GET" or "POST"
    cmd: str

class UserSignupInfo(BaseModel):
    email: str
    password: str
    firstname: str
    lastname: str

@app.get("/")
def get_status():
    resp = make_request("127.0.0.1:32049", "GET", "test network")
    return {"status": resp} 

@app.post("/signup/")
def signup(info: UserSignupInfo):
    print("BITCHHSAFBVSDJHVFBJKHFBKJHBFKJHSDFKAJHV")
    print("info", info)
    response = supabase_signup(info.email, info.password, info.firstname, info.lastname)

    print("R1:", response)
    print("R3:", response.user.id)

    return {"id": response.user.id}


@app.post("/send-command/")
def send_command(conn: Connection, command: Command):
    raw_response = make_request(conn.conn, command.type, command.cmd)
    print("raw_response", {raw_response})

    structured_data = parse_response(raw_response)
    print("structured_data", structured_data)
    return structured_data


# def make_request(conn, method, command):
#     print("conn", conn)

#     url = f"http://{conn}"
#     # url = "http://127.0.0.1:32049" "23.239.12.151:32349"
#     headers = {
#         "User-Agent": "AnyLog/1.23",
#         "command": command,
#     }
    
#     try:
#         if method.upper() == "GET":
#             response = requests.get(url, headers=headers)
#         elif method.upper() == "POST":
#             response = requests.post(url, headers=headers)
#         else:
#             raise ValueError("Invalid method. Use 'GET' or 'POST'.")
        
#         response.raise_for_status()  # Raise an error for bad status codes
#         return response.text  # Assuming response is text, change if needed
#     except requests.exceptions.RequestException as e:
#         print(f"Error making {method.upper()} request: {e}")
#         return None