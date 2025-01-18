from IPython.display import Markdown
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.messages import HumanMessage
from langchain.document_loaders import TextLoader
from langchain.memory import ConversationBufferMemory
from pathlib import Path
import json


import base64
import mimetypes

from typing import Dict

from dotenv import load_dotenv
import os
import textwrap

# Load .env file
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
persist_directory = './db'





class helpers():
    session_chains: Dict[str, RetrievalQA] = {}
    session_history: Dict[str, list] = {}  # Track the session history for each session
    history_directory = './session_history'  # Directory to store session histories
    responseFormat="I want only plain text with punctuations nothing else"

      

    @staticmethod
    async def createEmbeddings(file_path):
        try:
            print("createEmbeddings")
            print(file_path)

            pdf_loader = PyPDFLoader(file_path)
            pages = pdf_loader.load_and_split()
            print(len(pages))
            context = "\n\n".join(str(p.page_content) for p in pages)

            text_splitter = RecursiveCharacterTextSplitter(chunk_size=5000, chunk_overlap=500)
            texts = text_splitter.split_text(context)
            embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001",google_api_key=GOOGLE_API_KEY)            
            return [embeddings, texts]
        except Exception as e:
            print(f"Error in createEmbeddings: {e}")
            return None

    @staticmethod
    async def createVectorDB(texts, embeddings):
        try:
            # Create and persist the Chroma object
            Chroma.from_texts(texts, embeddings, persist_directory=persist_directory)
            print("Saved vectorDB")
        except Exception as e:
            print(f"Error in createVectorDB: {e}")

    @staticmethod
    async def loadVectorIndex():
        try:
            embeddings =  GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GOOGLE_API_KEY)
            vector_index =  Chroma(persist_directory=persist_directory, embedding_function=embeddings).as_retriever(search_kwargs={"k": 5})
            return vector_index
        except Exception as e:
            print(f"Error in loadVectorIndex: {e}")
            return None

    @staticmethod
    async def loadModel(vector_index, model):
        try:
            qa_chain =  RetrievalQA.from_chain_type(model, retriever=vector_index, return_source_documents=True)
            return qa_chain
        except Exception as e:
            print(f"Error in loadModel: {e}")
            return None

    @staticmethod
    def loadSessionHistory(session_id: str):
        try:
            session_file = Path(helpers.history_directory) / f"{session_id}.json"
            if session_file.exists():
                with open(session_file, 'r') as f:
                    helpers.session_history[session_id] = json.load(f)
                print(f"Loaded history for session {session_id}")
            else:
                print(f"No previous history found for session {session_id}")
        except Exception as e:
            print(f"Error loading session history for {session_id}: {e}")


    @staticmethod
    def saveSessionHistory(session_id: str):
        try:
            session_file = Path(helpers.history_directory) / f"{session_id}.json"
            with open(session_file, 'w') as f:
                json.dump(helpers.session_history[session_id], f, indent=4)
            print(f"Saved history for session {session_id}")
        except Exception as e:
            print(f"Error saving session history for {session_id}: {e}")



    @staticmethod
    async def createChatSession(session_id: str, vector_index, model):
        try:
            if session_id not in helpers.session_history:
                qa_chain = RetrievalQA.from_chain_type(
                    model, retriever=vector_index, return_source_documents=True
                    )
                helpers.session_history[session_id] = [] 
                
                print("new session")
                helpers.session_chains[session_id] = qa_chain
            return helpers.session_chains[session_id]
        except Exception as e:
            print(f"Error in createChatSession: {e}")
            # return None
        




    @staticmethod
    async def chat_with_rag(session_id: str, reqChat: str,language,qa_chain):
        try:
            history = helpers.session_history.get(session_id, [])
            previous_conversation = "\n".join([f"User: {item['user']}\nAssistant: {item['assistant']}" for item in history])


            question = f"You're a doctor. Answer in a detailed. Structure of the answer should be plain text format,  bullet points if needed.if you are not conclusive towards diagnosis ask questions and then give possible outcomes. the subsequent chats will be added in the following prompts. following the diagnosis also give prognosis. do the conversation as you are the doctor. also consider the current timestamp of the previous chats and their effect. I want the possible diagnosis after maximum 10 questions. before 10 previous conversations conclude and prescribe some medicine whenever possible . if there is no prev chat do not mention directly that there is not prev chat, instead you can say something like as we have met for the first time and so. if age gender and name is required then only ask with the question.Strictly answer in {language}, keep the medicals terms in english only.do not repeat the prvious chats again and again, just consider them while answering . refer to the prev chat is required.Here is the prev conversation: {previous_conversation} . Here's the question: {reqChat}"
            qa_chain = helpers.session_chains.get(session_id)
            
            if qa_chain:
                result = qa_chain.invoke({"query": question})
                print(result["result"])
                if session_id in helpers.session_history:
                    helpers.session_history[session_id].append({"user": reqChat, "assistant": result["result"]})

                # Save the updated session history to a file
                helpers.saveSessionHistory(session_id)
                return result["result"]
            
            else:
                return "Session not found."
        except Exception as e:
            print(f"Error in chat_with_rag: {e}")
            return None
        
   