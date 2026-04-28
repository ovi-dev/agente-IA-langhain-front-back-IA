
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uuid

from agent import invoke_agent, get_history, clear_history

app = FastAPI(title="AI Agent Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Schemas ───────────────────────────────────────────────────────────────────

class MessageRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    session_id: str = Field(..., min_length=1)


class MessageResponse(BaseModel):
    id: str
    message: str
    session_id: str
    timestamp: str


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat/message", response_model=MessageResponse)
async def chat_message(body: MessageRequest):
    try:
        reply = await invoke_agent(body.message, body.session_id)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    from datetime import datetime, timezone
    return MessageResponse(
        id=str(uuid.uuid4()),
        message=reply,
        session_id=body.session_id,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@app.get("/chat/history/{session_id}")
def chat_history(session_id: str):
    history = get_history(session_id)
    return [
        {"role": "user" if msg.__class__.__name__ == "HumanMessage" else "assistant",
         "content": msg.content}
        for msg in history
    ]


@app.delete("/chat/history/{session_id}")
def delete_history(session_id: str):
    clear_history(session_id)
    return {"deleted": True}
