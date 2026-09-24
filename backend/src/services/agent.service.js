const assistantInstructions = `You are ChatAI, a personal AI assistant.
Be useful, clear, and concise. Remember the conversation context provided by the user.
Help with planning, learning, writing, coding, and everyday decisions.
If you do not know something, say so instead of inventing facts.`

export async function askPersonalAgent(messages) {
  const apiKey = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

  if (!apiKey) {
    const error = new Error('GEMINI_API_KEY is not configured')
    error.statusCode = 500
    throw error
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: assistantInstructions }],
        },
        contents: messages.map(({ role, content }) => ({
          role: role === 'assistant' ? 'model' : 'user',
          parts: [{ text: content }],
        })),
      }),
      },
    )

    const data = await response.json()
    if (!response.ok) {
      const error = new Error(data.error?.message || `Gemini request failed with status ${response.status}`)
      error.statusCode = response.status === 401 || response.status === 403 ? 502 : response.status
      throw error
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map(({ text }) => text || '')
      .join('')

    if (!reply) {
      const error = new Error('Gemini returned an empty response')
      error.statusCode = 502
      throw error
    }

    return reply
  } catch (error) {
    if (error.statusCode) throw error

    const connectionError = new Error(
      `Cannot connect to Gemini using model ${model}`,
    )
    connectionError.statusCode = 503
    throw connectionError
  }
}
