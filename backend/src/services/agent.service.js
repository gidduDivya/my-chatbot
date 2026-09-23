const assistantInstructions = `You are ChatAI, a personal AI assistant.
Be useful, clear, and concise. Remember the conversation context provided by the user.
Help with planning, learning, writing, coding, and everyday decisions.
If you do not know something, say so instead of inventing facts.`

export async function askPersonalAgent(messages) {
  const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434'
  const model = process.env.OLLAMA_MODEL || 'llama3.2:3b'

  try {
    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: 'system', content: assistantInstructions },
          ...messages.map(({ role, content }) => ({ role, content })),
        ],
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      const error = new Error(data.error || `Ollama request failed with status ${response.status}`)
      error.statusCode = response.status === 404 ? 503 : 502
      throw error
    }

    if (!data.message?.content) {
      const error = new Error('Ollama returned an empty response')
      error.statusCode = 502
      throw error
    }

    return data.message.content
  } catch (error) {
    if (error.statusCode) throw error

    const connectionError = new Error(
      `Cannot connect to Ollama at ${ollamaUrl}. Start Ollama and install ${model} with: ollama run ${model}`,
    )
    connectionError.statusCode = 503
    throw connectionError
  }
}
