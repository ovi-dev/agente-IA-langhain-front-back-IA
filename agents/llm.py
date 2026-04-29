"""
llm.py
──────
Define qué modelo LLM usa el agente.
Para cambiar de modelo, comenta la línea activa y descomenta la que quieras.
Cada proveedor necesita su paquete instalado y su API key en el .env.
"""
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'), override=True)

# ── Google Gemini ─────────────────────────────────────────────────────────────
# Requiere: GOOGLE_API_KEY
from langchain_google_genai import ChatGoogleGenerativeAI
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)

# ── OpenAI ────────────────────────────────────────────────────────────────────
# Requiere: OPENAI_API_KEY
# from langchain_openai import ChatOpenAI
# llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)

# ── Anthropic (Claude) ────────────────────────────────────────────────────────
# Requiere: pip install langchain-anthropic  |  ANTHROPIC_API_KEY
# from langchain_anthropic import ChatAnthropic
# llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", temperature=0.7)

# ── Groq (Llama, Mixtral — muy rápido) ───────────────────────────────────────
# Requiere: pip install langchain-groq  |  GROQ_API_KEY
# from langchain_groq import ChatGroq
# llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.7)

# ── Ollama (modelos locales, sin API key) ─────────────────────────────────────
# Requiere: pip install langchain-ollama  |  Ollama instalado y corriendo
# from langchain_ollama import ChatOllama
# llm = ChatOllama(model="llama3.2", temperature=0.7)
