from dotenv import load_dotenv
load_dotenv()
from langchain_google_vertexai import ChatVertexAI

model = ChatVertexAI(model="gemini-1.5-pro")

from langchain_core.messages import HumanMessage

query = input("Enter your Question here:")

prompts = "You are an AI assistant."

response = model.invoke([HumanMessage(content=f"{prompts} Here is your question {query}")])

print(response.content)