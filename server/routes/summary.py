import json
import logging

from auth import get_current_user
from config import memory, summary_chain, supabase
from fastapi import APIRouter, Depends, HTTPException
from utils import extract_text_from_url

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/")
async def get_summary(user: dict = Depends(get_current_user)):
    """Get the summary of the chat history and resume content"""
    try:
        chat_history = memory.chat_memory.messages
        if not chat_history:
            raise HTTPException(
                status_code=400, detail="Chat history is empty")
        file_url = supabase.storage.from_("uploads").get_public_url(
            f"{user.id}/Resume.pdf"
        )
        resume_content = await extract_text_from_url(file_url)

        response = summary_chain.invoke(
            {"chat_history": chat_history, "resume_content": resume_content}
        )

        cleaned_summary_response = response[8:-3]
        logger.debug(f"Cleaned summary response: {cleaned_summary_response}")
        try:
            summary_sections = json.loads(cleaned_summary_response)
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {str(e)}")
            raise HTTPException(
                status_code=500, detail="Internal server error: \
                    Invalid JSON format"
            )

        return {"summary_sections": summary_sections}
    except Exception as e:
        logger.error(f"Error in get_summary: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
