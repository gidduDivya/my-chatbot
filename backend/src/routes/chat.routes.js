import { Router } from 'express'

import requireAuth from '../middleware/auth.middleware.js'
import { getConversationById, getConversations, sendMessage } from '../controllers/chat.controller.js'

const router = Router()

router.use(requireAuth)
router.post('/messages', sendMessage)
router.get('/conversations', getConversations)
router.get('/conversations/:id', getConversationById)

export default router
