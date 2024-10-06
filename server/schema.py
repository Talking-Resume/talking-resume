from pydantic import BaseModel

class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    question: str