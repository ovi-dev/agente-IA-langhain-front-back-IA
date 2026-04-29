"""
agent.py
────────
Agente de IA con LangChain.
El modelo que usa viene definido en llm.py.
"""
import os
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.runnables import Runnable

# Carga el archivo .env de la raíz del proyecto (un nivel arriba de agents/).
# override=True hace que las variables del .env sobreescriban las del sistema.
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'), override=True)

# Importa el LLM definido en llm.py.
# Para cambiar de modelo, edita ese archivo.
from llm import llm

# Diccionario en memoria que guarda el historial de cada sesión de chat.
# Clave: session_id (string único por usuario/pestaña).
# Valor: lista de mensajes HumanMessage / AIMessage.
# NOTA: se resetea al reiniciar el servidor; para persistencia habría que usar BD.
_session_histories: dict[str, list] = {}


def _build_chain(llm: object) -> Runnable:
    # Define la estructura del prompt que recibe el modelo en cada llamada.
    prompt = ChatPromptTemplate.from_messages([
        (
            # Mensaje de sistema: instrucciones fijas que el modelo siempre ve.
            # Define la personalidad y el comportamiento base del asistente.
            "system",
            "Eres un asistente de IA inteligente y útil. "
            "Responde siempre en el mismo idioma en que te escriban. "
            "Sé claro, conciso y amigable.",
        ),
        # Placeholder que se reemplaza en cada llamada con el historial real
        # de la sesión (lista de HumanMessage + AIMessage anteriores).
        # Esto es lo que da "memoria" al modelo dentro de una conversación.
        MessagesPlaceholder(variable_name="historial"),
        # El mensaje del usuario en este turno.
        ("human", "{mensaje}"),
    ])
    # El operador | encadena prompt → llm (sintaxis LCEL de LangChain).
    # Primero se formatea el prompt y luego se envía al modelo.
    return prompt | llm


# Se construye la chain una sola vez cuando Python importa este módulo.
_chain = _build_chain(llm)


def get_history(session_id: str) -> list:
    # Devuelve el historial de una sesión o lista vacía si no existe.
    return _session_histories.get(session_id, [])


def clear_history(session_id: str) -> None:
    # Elimina el historial de una sesión (llamado desde el endpoint DELETE).
    _session_histories.pop(session_id, None)


async def invoke_agent(message: str, session_id: str) -> str:
    """
    Envía un mensaje al agente y devuelve la respuesta como string.
    Mantiene historial de conversación por sesión.
    """
    # Recupera el historial previo de esta sesión (puede ser lista vacía).
    history = _session_histories.get(session_id, [])

    # Llama al modelo de forma asíncrona pasando el mensaje actual
    # y todo el historial anterior para que tenga contexto de la conversación.
    response = await _chain.ainvoke({
        "mensaje": message,
        "historial": history,
    })

    # Añade el par pregunta/respuesta al historial DESPUÉS de obtener la respuesta,
    # para que en la siguiente llamada el modelo recuerde este turno.
    history.append(HumanMessage(content=message))
    history.append(AIMessage(content=response.content))
    _session_histories[session_id] = history

    # Devuelve solo el texto de la respuesta (sin metadatos del modelo).
    return response.content
