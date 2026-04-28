"""
agent.py
────────
Agente de IA con LangChain. Soporta Google Gemini y OpenAI.
El proveedor se controla con la variable AI_PROVIDER en .env.
"""
import os
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.runnables import Runnable

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'), override=True)

# ── Historial de conversación por sesión (en memoria) ─────────────────────────
_session_histories: dict[str, list] = {}


def _build_llm() -> object:
    """Construye el LLM según AI_PROVIDER."""
    provider = os.getenv("AI_PROVIDER", "google").lower()
    temperature = float(os.getenv("AI_TEMPERATURE", "0.7"))

    if provider == "openai":
        from langchain_openai import ChatOpenAI
        model = os.getenv("AI_MODEL_OPENAI", "gpt-4o-mini")
        return ChatOpenAI(model=model, temperature=temperature)

    # Default: Google Gemini
    from langchain_google_genai import ChatGoogleGenerativeAI
    model = os.getenv("AI_MODEL_GOOGLE", "gemini-2.5-flash")
    return ChatGoogleGenerativeAI(model=model, temperature=temperature)


def _build_chain(llm: object) -> Runnable:
    """Construye la cadena LCEL con historial."""
    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            "Eres un asistente de IA inteligente y útil. "
            "Responde siempre en el mismo idioma en que te escriban. "
            "Sé claro, conciso y amigable.",
        ),
        MessagesPlaceholder(variable_name="historial"),
        ("human", "{mensaje}"),
    ])
    return prompt | llm


# Inicializar LLM y cadena una sola vez al importar
_llm = _build_llm()
_chain = _build_chain(_llm)


def get_history(session_id: str) -> list:
    return _session_histories.get(session_id, [])


def clear_history(session_id: str) -> None:
    _session_histories.pop(session_id, None)


async def invoke_agent(message: str, session_id: str) -> str:
    """
    Envía un mensaje al agente y devuelve la respuesta como string.
    Mantiene historial de conversación por sesión.
    """
    history = _session_histories.get(session_id, [])

    response = await _chain.ainvoke({
        "mensaje": message,
        "historial": history,
    })

    # Actualizar historial
    history.append(HumanMessage(content=message))
    history.append(AIMessage(content=response.content))
    _session_histories[session_id] = history

    return response.content
