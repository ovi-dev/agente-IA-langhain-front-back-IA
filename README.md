# Agente IA — LangChain · NestJS · Next.js

Proyecto full-stack con tres servicios independientes:

| Servicio  | Tecnología          | Puerto |
| --------- | ------------------- | ------ |
| Frontend  | Next.js 16          | 3000   |
| Backend   | NestJS              | 3001   |
| Agente IA | FastAPI + LangChain | 8000   |

---

## Primeros pasos (clonar y arrancar)

Sigue estos pasos en orden la primera vez que descargues el proyecto.

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd <nombre-carpeta>
```

### 2. Instalar Node.js >= 18 y Python >= 3.9

Comprueba que los tienes instalados:

```bash
node -v   # debe mostrar v18 o superior
python3 --version  # debe mostrar 3.9 o superior
```

### 3. Instalar uv (gestor de paquetes Python)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.local/bin/env   # o reinicia el terminal
```

Verifica la instalación:

```bash
uv --version
```

### 4. Configurar variables de entorno

Crea el archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env   # si existe plantilla
# o créalo manualmente
```

Contenido del `.env`:

```env
# ── AI Providers (pon las keys de los proveedores que vayas a usar) ───────────
GOOGLE_API_KEY=tu_clave_aqui
OPENAI_API_KEY=tu_clave_aqui

# ── Python Agent Service ──────────────────────────────────────────────────────
AGENT_SERVICE_URL=http://localhost:8000

# ── NestJS Backend ────────────────────────────────────────────────────────────
PORT=3001
CORS_ORIGIN=http://localhost:3000

# ── Next.js Frontend ──────────────────────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

### 5. Instalar dependencias de Node.js (frontend + backend)

Desde la raíz del proyecto:

```bash
npm install
```

### 6. Instalar dependencias de Python (agente IA)

```bash
cd agents && uv sync
```

`uv sync` lee el `pyproject.toml`, crea el entorno virtual automáticamente en `agents/.venv` e instala todas las dependencias. No necesitas crear el entorno manualmente.

Vuelve a la raíz cuando termine:

```bash
cd ..
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
uv run fastapi dev main.py
```

---

## Cambiar el modelo LLM

El modelo activo se define en `agents/llm.py`. Para cambiarlo, comenta la línea
`llm = ...` activa y descomenta la del proveedor que quieras. Solo puede haber
una línea `llm = ...` sin comentar a la vez.

Si el proveedor no está instalado, añade su paquete en `agents/pyproject.toml`
y ejecuta `cd agents && uv sync`.

### Proveedores disponibles en LangChain

| Proveedor          | Paquete (`pyproject.toml`)      | Import                                                      | Variable en `.env`                                                   |
| ------------------ | ------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------- |
| Google Gemini      | `langchain-google-genai`        | `from langchain_google_genai import ChatGoogleGenerativeAI` | `GOOGLE_API_KEY`                                                     |
| OpenAI             | `langchain-openai`              | `from langchain_openai import ChatOpenAI`                   | `OPENAI_API_KEY`                                                     |
| Anthropic (Claude) | `langchain-anthropic`           | `from langchain_anthropic import ChatAnthropic`             | `ANTHROPIC_API_KEY`                                                  |
| Groq               | `langchain-groq`                | `from langchain_groq import ChatGroq`                       | `GROQ_API_KEY`                                                       |
| Ollama (local)     | `langchain-ollama`              | `from langchain_ollama import ChatOllama`                   | —                                                                    |
| Cohere             | `langchain-cohere`              | `from langchain_cohere import ChatCohere`                   | `COHERE_API_KEY`                                                     |
| Mistral            | `langchain-mistralai`           | `from langchain_mistralai import ChatMistralAI`             | `MISTRAL_API_KEY`                                                    |
| AWS Bedrock        | `langchain-aws`                 | `from langchain_aws import ChatBedrock`                     | `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` + `AWS_DEFAULT_REGION` |
| Azure OpenAI       | `langchain-openai`              | `from langchain_openai import AzureChatOpenAI`              | `AZURE_OPENAI_API_KEY` + `AZURE_OPENAI_ENDPOINT`                     |
| HuggingFace        | `langchain-huggingface`         | `from langchain_huggingface import ChatHuggingFace`         | `HUGGINGFACEHUB_API_TOKEN`                                           |
| Nvidia             | `langchain-nvidia-ai-endpoints` | `from langchain_nvidia_ai_endpoints import ChatNVIDIA`      | `NVIDIA_API_KEY`                                                     |
| Together AI        | `langchain-together`            | `from langchain_together import ChatTogether`               | `TOGETHER_API_KEY`                                                   |
| Fireworks          | `langchain-fireworks`           | `from langchain_fireworks import ChatFireworks`             | `FIREWORKS_API_KEY`                                                  |

Referencia completa: [python.langchain.com/docs/integrations/chat](https://python.langchain.com/docs/integrations/chat/)

---

## Dependencias por servicio

### Agente IA (`agents/pyproject.toml`)

| Paquete                  | Versión | Para qué sirve                                        |
| ------------------------ | ------- | ----------------------------------------------------- |
| `fastapi[standard]`      | 0.115.6 | Servidor HTTP + CLI de desarrollo                     |
| `python-dotenv`          | 1.0.1   | Leer el archivo `.env`                                |
| `langchain`              | 0.3.14  | Framework principal de LangChain                      |
| `langchain-core`         | 0.3.29  | Tipos base (prompts, mensajes, runnables)             |
| `langchain-openai`       | 0.2.14  | Integración con OpenAI                                |
| `langchain-google-genai` | 2.0.8   | Integración con Google Gemini                         |
| `pydantic`               | 2.10.4  | Validación de datos en los endpoints                  |
| `httpx`                  | 0.28.1  | Cliente HTTP async (usado internamente por LangChain) |

Instalar: `cd agents && uv sync`

---

### Backend NestJS (`backend/package.json`)

| Paquete                    | Para qué sirve                               |
| -------------------------- | -------------------------------------------- |
| `@nestjs/common`           | Decoradores, módulos, controladores          |
| `@nestjs/core`             | Núcleo del framework NestJS                  |
| `@nestjs/platform-express` | Adaptador HTTP con Express                   |
| `@nestjs/websockets`       | Soporte WebSocket en NestJS                  |
| `@nestjs/platform-ws`      | Adaptador WebSocket nativo                   |
| `rxjs`                     | Programación reactiva (requerido por NestJS) |
| `reflect-metadata`         | Polyfill para decoradores TypeScript         |
| `ws`                       | Librería WebSocket de bajo nivel             |

Instalar: `npm install` (desde la raíz)

---

### Frontend Next.js (`frontend/package.json`)

| Paquete                 | Para qué sirve                                       |
| ----------------------- | ---------------------------------------------------- |
| `next`                  | Framework React con SSR/SSG                          |
| `react` / `react-dom`   | UI library                                           |
| `@tanstack/react-query` | Gestión de estado del servidor y caché de peticiones |
| `axios`                 | Cliente HTTP para llamadas a la API                  |
| `lucide-react`          | Iconos SVG como componentes React                    |
| `tailwindcss`           | CSS utility-first                                    |

Instalar: `npm install` (desde la raíz)

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

```
npm install uuid --workspace=frontend && npm install --save-dev @types/uuid --workspace=frontend
```
