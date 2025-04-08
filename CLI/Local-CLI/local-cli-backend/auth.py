import psycopg2
from dotenv import load_dotenv
import os
from supabase import create_client, Client

# Load environment variables from .env
load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)



def supabase_signup(email, password, firstname, lastname):
    response = supabase.auth.sign_up(
        {
            "email": email,
            "password": password,
            "options": {"data": {"first_name": firstname, "last_name": lastname}},
        }
    )
    return response


# resp = supabase_signup("ppurathe@ucsc.edu", "pass1234", "peter", "pp")

# print(resp.user.id)