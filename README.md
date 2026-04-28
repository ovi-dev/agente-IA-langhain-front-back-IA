# Agente IA — LangChain · NestJS · Next.js

Proyecto full-stack con tres servicios independientes:

| Servicio  | Tecnología          | Puerto |
| --------- | ------------------- | ------ |
| Frontend  | Next.js 16          | 3000   |
| Backend   | NestJS              | 3001   |
| Agente IA | FastAPI + LangChain | 8000   |

---

## Requisitos previos

- Node.js >= 18
- Python >= 3.9
- [uv](https://docs.astral.sh/uv/) (gestor de paquetes Python)

### Instalar uv (primera vez)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.local/bin/env   # o reinicia el terminal
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Proveedor de IA: "google" u "openai"
AI_PROVIDER=google

# Google Gemini
GOOGLE_API_KEY=tu_clave_aqui
AI_MODEL_GOOGLE=gemini-2.5-flash

# OpenAI (solo si AI_PROVIDER=openai)
OPENAI_API_KEY=tu_clave_aqui
AI_MODEL_OPENAI=gpt-4o-mini

# Temperatura del modelo (0.0 - 1.0)
AI_TEMPERATURE=0.7
```

---

## Instalación de dependencias

```bash
# Instalar dependencias de frontend y backend
npm install

# Instalar dependencias del agente
cd agents && uv sync
```

---

## Iniciar servicios

Cada servicio se ejecuta en una terminal separada.

### Frontend (Next.js — puerto 3000)

```bash
npm run dev:frontend
```

### Backend (NestJS — puerto 3001)

```bash
npm run dev:backend
```

### Agente IA (FastAPI — puerto 8000)

```bash
npm run dev:agents
```

O directamente desde la carpeta `agents/`:

```bash
cd agents
uv run uvicorn main:app --reload --port 8000
```

---

## Estructura del proyecto

```
├── frontend/        # Next.js — interfaz de chat
├── backend/         # NestJS — API REST + WebSocket
├── agents/          # FastAPI + LangChain — agente de IA
│   ├── agent.py
│   ├── main.py
│   ├── pyproject.toml
│   └── .env         # cargado automáticamente por agent.py
├── .env             # variables de entorno compartidas
└── package.json     # scripts raíz con npm workspaces
```
