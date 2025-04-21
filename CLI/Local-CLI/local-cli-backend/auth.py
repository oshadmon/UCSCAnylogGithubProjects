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

def supabase_login(email, password):
    try:
        response = supabase.auth.sign_in_with_password(
            {
                "email": email,
                "password": password,
            }
        )
        return response
    except Exception as e:
        print("Error logging in:", e)
        return e

def supabase_logout():
    response = supabase.auth.sign_out()
    return response

def supabase_get_user(jwt):
    user = supabase.auth.get_user(jwt)
    print("User", user)
    return user

def supabase_refresh_session():
    session = supabase.auth.refresh_session()
    print("session", session)
    return session

# resp = supabase_signup("ppurathe@ucsc.edu", "pass1234", "peter", "pp")

# print(resp.user.id)




# clear local storage by going to the browser , inspect, application, storage, clear site data