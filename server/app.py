from dotenv import load_dotenv
from decouple import config
import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from supabase import create_client, Client
from starlette.middleware.cors import CORSMiddleware
import logging
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

security = HTTPBearer()

app = FastAPI()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user_response = supabase.auth.get_user(token)
    if user_response.error:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return user_response.user

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    try:
        # Print authenticated user details
        logger.info(f"Authenticated user: {user}")

        # Read the file content
        file_content = await file.read()
        logger.info(f"Uploading file: {file.filename}")

        # Upload the file to Supabase storage
        response = supabase.storage.from_('uploads').upload(f'public/{file.filename}', file_content)

        print(response)

        logger.info(f"File uploaded successfully: {response['data']}")
        return {"message": "File uploaded successfully", "data": response['data']}
    except Exception as e:
        logger.error(f"Internal server error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)