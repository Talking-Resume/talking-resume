import PyPDF2
from langchain_google_vertexai import ChatVertexAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.memory import ConversationBufferMemory
import json
import os

load_dotenv()

# config={
#   "type":os.getenv("type"),
#   "project_id":os.getenv("project_id") ,
#   "private_key_id":os.getenv("private_key_id"),
#   "private_key": os.getenv("private_key"),
#   "client_email":os.getenv("client_email") ,
#   "client_id":os.getenv("client_id"),
#   "auth_uri":os.getenv("auth_uri") ,
#   "token_uri":os.getenv("token_uri") ,
#   "auth_provider_x509_cert_url":os.getenv("auth_provider_x509_cert_url") ,
#   "client_x509_cert_url":os.getenv("client_x509_cert_url") ,
#   "universe_domain": os.getenv("universe_domain")
# }


# with open('soy-coast-435711-v9-46fd5dfd314e.json', 'w') as json_file:
#     json.dump(config, json_file, indent=2)

model = ChatVertexAI(model="gemini-1.5-pro", temperature = 0.3)

def extract_text_from_pdf(pdf_file_path):
    with open(pdf_file_path, 'rb') as pdf_file:
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text


doct_path = 'RishiJain_Resume.pdf'
doct = extract_text_from_pdf(doct_path)

prompt = ChatPromptTemplate.from_messages(
    [
        ("system","You are an AI assistant.Your job is to analyze the resume {input} and based on that you have to ask questions to user based on his Technical skills, Experience, Achivements and Projects. Everytime you have to ask a Technical question from the user"),
        ("human","{user_question}")
    ]
)
parser = StrOutputParser()

memory = ConversationBufferMemory()

chain = prompt | model | parser

# user_question = input("Enter Your Queries here: ")

response = chain.invoke({
    "input":doct,
    "user_question":'Ask me one question based on my resume'
})
memory.chat_memory.add_ai_message(response)
print(response)
while True:
    user = input("Enter Your Queries here: ")    
    if(user.lower() == 'x'):break

    response = chain.invoke({
       "input":doct,
       "user_question":user
    })
    memory.chat_memory.add_user_message(user)
    memory.chat_memory.add_ai_message(response)
    print(response)