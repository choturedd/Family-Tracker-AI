from fastapi import FastAPI
from pydantic import BaseModel
from openai import AzureOpenAI
import os
from dotenv import load_dotenv
import uvicorn
import requests

load_dotenv()

app = FastAPI()

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2024-02-15-preview",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

class Prompt(BaseModel):
    question: str

@app.post("/ask")
def ask_llm(prompt: Prompt):

    # 1. Fetch RAG Context from Backend
    context_str = "No recent user entries found."
    backend_url = os.getenv("BACKEND_URL", "http://localhost:5055")
    try:
        res = requests.get(f"{backend_url}/api/activity/rag-context", timeout=5)
        if res.status_code == 200:
            activities = res.json()
            if activities:
                lines: list[str] = []
                for a in activities:
                    lines.append(f"Date: {a['date']}, Email: {a['email']}, User: {a['name']}, Description: {a['description']}, Image: {a['imageUrl']}")
                context_str = "\n".join(lines)
    except Exception as e:
        print(f"Error fetching RAG context: {e}")

    # 2. Build Prompt with Context
    system_prompt = f"You are a helpful AI assistant. You have access to the following recent user activities to answer user questions.\n\nContext:\n{context_str}\n\nUse this context to answer the user's question if relevant."

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt.question}
        ],
        temperature=0.7,
        max_tokens=800
    )

    return {
        "answer": response.choices[0].message.content
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)