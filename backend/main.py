import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uuid


from pydantic import BaseModel
import re

from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os
import google.generativeai as genai
from helpers import helpers
import asyncio



load_dotenv()

# Access environment variable
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY is not set in the .env file")

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Define request body model
class ImageUrls(BaseModel):
    ogImageUrl: str
    susImageUrl: str

class SessionId(BaseModel):
    session_id: str

# Define request body model
class Terms(BaseModel):
    registeredName: str
    suspiciousTerm: str

class ChatsBody(BaseModel):
    reqChat:str
    session_id:str


class SearchRequest(BaseModel):
    brand_name: str
    manufacturer_name: str


def read_cache(CACHE_FILE):
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as file:
            return json.load(file)
    return {}

# Helper function to write to the cache file
def write_cache(data,CACHE_FILE):
    with open(CACHE_FILE, "w") as file:
        json.dump(data, file, indent=4)

  
@app.post("/api/delete_session")
async def delete_session(session_id: SessionId):
    try:
        if session_id.session_id in helpers.session_chains:
            del helpers.session_chains[session_id.session_id]
        return {"message": "Session deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/create_session")
async def create_session():
    try:
        # Generate a new unique session ID
        session_id = str(uuid.uuid4())
        return {"session_id": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/api/chat")
async def chat_rag(chats_body: ChatsBody):
    try:
        # Initialize the model
        model = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro",
            google_api_key=GOOGLE_API_KEY,
            temperature=0.2,
            convert_system_message_to_human=True
        )

        # Load the vector index and QA chain
        vector_index = await helpers.loadVectorIndex()

        # Create or retrieve the chat session
        qa_chain = await helpers.createChatSession(chats_body.session_id, vector_index, model)

        # Perform the chat with the RAG model
        result = await helpers.chat_with_rag(chats_body.session_id, chats_body.reqChat,qa_chain)

        # Return the result
        return {"result": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
