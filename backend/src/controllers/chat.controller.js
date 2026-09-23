import { createAssistantReply, getConversation, listConversations } from '../services/conversation.service.js'

export async function sendMessage(request, response, next) {
  try {
    const { message, conversationId } = request.body
    if (!message || typeof message !== 'string' || !message.trim()) {
      return response.status(400).json({ message: 'Message is required' })
    }

    const result = await createAssistantReply({
      userId: request.user.userId,
      conversationId,
      message: message.trim(),
    })
    response.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getConversations(request, response, next) {
  try {
    response.json({ conversations: await listConversations(request.user.userId) })
  } catch (error) {
    next(error)
  }
}

export async function getConversationById(request, response, next) {
  try {
    const conversation = await getConversation(request.user.userId, request.params.id)
    if (!conversation) return response.status(404).json({ message: 'Conversation not found' })
    response.json({ conversation })
  } catch (error) {
    next(error)
  }
}
