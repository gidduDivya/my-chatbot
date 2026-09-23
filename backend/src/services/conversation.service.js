import Conversation from '../models/conversation.model.js'
import { askPersonalAgent } from './agent.service.js'

export async function createAssistantReply({ userId, conversationId, message }) {
  let conversation = conversationId
    ? await Conversation.findOne({ _id: conversationId, user: userId })
    : null

  if (conversationId && !conversation) {
    const error = new Error('Conversation not found')
    error.statusCode = 404
    throw error
  }

  conversation ||= new Conversation({ user: userId })
  conversation.messages.push({ role: 'user', content: message })

  const reply = await askPersonalAgent(conversation.messages.map(({ role, content }) => ({ role, content })))
  conversation.messages.push({ role: 'assistant', content: reply })

  if (conversation.title === 'New conversation') {
    conversation.title = message.slice(0, 60)
  }

  await conversation.save()
  return { conversationId: conversation._id, message: reply, conversation }
}

export function listConversations(userId) {
  return Conversation.find({ user: userId }).sort({ updatedAt: -1 }).select('title messages createdAt updatedAt')
}

export function getConversation(userId, conversationId) {
  return Conversation.findOne({ _id: conversationId, user: userId })
}
