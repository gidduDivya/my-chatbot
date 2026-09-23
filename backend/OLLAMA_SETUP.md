# Local AI setup

This backend uses Ollama instead of a paid cloud API.

## 1. Install Ollama

Download it from https://ollama.com/download and install it for your operating system.

## 2. Download a model

```bash
ollama run llama3.2:3b
```

The first run downloads the model. Keep Ollama running while using the chat app.

## 3. Start the backend

```bash
npm start
```

The backend uses these values from `.env`:

```env
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:3b
```

## API

Send an authenticated request to:

```text
POST http://localhost:5000/api/chat/messages
```

```json
{
  "message": "Help me plan my study day"
}
```

Include the login token:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```
