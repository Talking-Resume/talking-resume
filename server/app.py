import logging
import requests
import aiohttp
import base64,uuid
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from supabase import create_client, Client
import PyPDF2
from langchain_google_vertexai import ChatVertexAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.memory import ConversationBufferMemory
from dotenv import load_dotenv
import os
import io
from io import BytesIO
import vertexai

load_dotenv()

# Initialize Supabase client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the security scheme
security = HTTPBearer()

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Initialize Vertex AI with the project ID
project_id = os.getenv("GOOGLE_CLOUD_PROJECT")

vertexai.init(project=project_id)

# Initialize LangChain model
model = ChatVertexAI(model="gemini-1.5-pro", temperature=0.3)

class ChatRequest(BaseModel):
    question: str

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are an AI assistant. Your job is to analyze the resume {input} and based on that you have to ask questions to the user based on their Technical skills, Experience, Achievements, and Projects. Every time you have to ask a Technical question from the user."),
        ("human", "{user_question}")
    ]
)
parser = StrOutputParser()
memory = ConversationBufferMemory()
chain = prompt | model | parser

def extract_text_from_pdf(pdf_file):
    reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text


async def extract_text_from_url(file_url):
    try:
        # Download the PDF file from the URL using aiohttp
        async with aiohttp.ClientSession() as session:
            async with session.get(file_url) as response:
                response.raise_for_status()  # Raise an error for bad status codes
                pdf_file = BytesIO(await response.read())

        # Extract text from the PDF file
        extracted_text = extract_text_from_pdf(pdf_file)
        
        return extracted_text
    except aiohttp.ClientError as e:
        print(f"Error downloading the file: {e}")
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user_response = supabase.auth.get_user(token)

    logger.info(f"User response: {user_response}")

    # Check if the user attribute exists in the user_response object
    if not user_response or not hasattr(user_response, 'user'):
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    return user_response.user

@app.post("/chat")
async def chat_resume(request: ChatRequest, user: dict = Depends(get_current_user)):
    try:
        user_id=user.id
        # Get the resume file URL from Supabase storage
        file_url = supabase.storage.from_('uploads').get_public_url(f'{user_id}/Resume.pdf')
        resume_content=await extract_text_from_url(file_url)
        
        response = chain.invoke({
            "input": resume_content,
            "user_question": request.question
        })
        
        memory.chat_memory.add_ai_message(response)

        return {"response": response}
    except Exception as e:
        logger.error(f"Error in chat_resume: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
@app.get("/summary")
async def get_summary(user: dict = Depends(get_current_user)):
    try:
        # Get the chat history from memory
        chat_history = memory.chat_memory.messages
        file_url = supabase.storage.from_('uploads').get_public_url(f'{user.id}/Resume.pdf')
        resume_content=await extract_text_from_url(file_url)
        # Summarize the chat history
        summary_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", f"You are an AI assistant. Summarize the following chat history and provide suggestions for improvements, strengths, and weaknesses based on the {resume_content}."),
                ("human", f"{chat_history}")
            ]
        )
        summary_chain = summary_prompt | model | parser
        summary_response = summary_chain.invoke({"input": chat_history})

        return {"summary": summary_response}
    except Exception as e:
        logger.error(f"Error in get_summary: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")