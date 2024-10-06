from config import supabase
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get the current user from the Supabase auth service"""
    token = credentials.credentials
    user_response = supabase.auth.get_user(token)

    if not user_response or not hasattr(user_response, "user"):
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    return user_response.user
