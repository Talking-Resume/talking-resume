import os

import vertexai
from dotenv import load_dotenv
from langchain.memory import ConversationBufferMemory
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_vertexai import ChatVertexAI
from supabase import create_client

load_dotenv()

# Initialize Supabase client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

# Initialize Vertex AI with the project ID
project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
vertexai.init(project=project_id)

# Initialize LangChain model
model = ChatVertexAI(model="gemini-1.5-pro", temperature=0.3)


chat_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are an AI assistant. Your job is to \
            analyze the resume {input} \
                  and based on that you have to \
                    ask questions to the user based on their \
                    Technical skills, Experience, Achievements, and Projects. \
                    Every time you have  \
                    to ask a Technical question from the user.",
        ),
        ("human", "{user_question}"),
    ]
)
parser = StrOutputParser()
memory = ConversationBufferMemory()
chat_chain = chat_prompt | model | parser


summary_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are an AI assistant. Speak as if in \
            second party rather than third party , First \
            Summarize the following chat history and provide suggestions \
            for improvements, strengths, and weaknesses based on the resume \
            content and use html for the text.Format the response as a JSON \
            object with the keys 'summary', 'improvements', \
            'strengths', and 'weaknesses'.",
        ),
        ("human", "{chat_history}\n{resume_content}"),
    ]
)

summary_chain = summary_prompt | model | parser
