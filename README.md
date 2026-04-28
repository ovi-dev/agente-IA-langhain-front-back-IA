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
