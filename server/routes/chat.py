import logging

from auth import get_current_user
from config import chat_chain, memory, supabase
from fastapi import APIRouter, Depends, HTTPException
from schema import ChatRequest
from utils import extract_text_from_url

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/")
async def chat_resume(request: ChatRequest, user: dict = Depends(get_current_user)):
    """Chat with the AI using the resume content"""
    try:
        user_id = user.id
        # Get the resume file URL from Supabase storage
        file_url = supabase.storage.from_("uploads").get_public_url(
            f"{user_id}/Resume.pdf"
        )
        resume_content = await extract_text_from_url(file_url)

        response = chat_chain.invoke(
            {"input": resume_content, "user_question": request.question}
        )

        memory.chat_memory.add_ai_message(response)

        return {"response": response}
    except Exception as e:
        logger.error(f"Error in chat_resume: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
