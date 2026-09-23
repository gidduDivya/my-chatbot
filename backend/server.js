import 'dotenv/config'
import cors from 'cors'
import express from 'express'

import connectDatabase from './src/config/database.js'
import authRoutes from './src/routes/auth.routes.js'
import chatRoutes from './src/routes/chat.routes.js'

const app = express()
const port = Number(process.env.PORT) || 5000
const configuredClientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || origin === configuredClientUrl || /^http:\/\/localhost:\d+$/.test(origin)) {
			return callback(null, true)
		}
		return callback(new Error('CORS origin not allowed'))
	},
}))
app.use(express.json())

app.get('/api/health', (_request, response) => {
	response.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)

app.use((error, _request, response, _next) => {
	console.error(error)
	if (error.code === 11000) {
		return response.status(409).json({ message: 'An account with this email already exists' })
	}

	if (error.name === 'ValidationError' || error instanceof SyntaxError) {
		return response.status(400).json({ message: error.message })
	}

	response.status(error.statusCode || 500).json({
		message: error.statusCode ? error.message : 'Internal server error',
	})
})

connectDatabase()
	.then(() => {
		app.listen(port, () => {
			console.log(`Server running on port ${port}`)
		})
	})
	.catch((error) => {
		console.error('Database connection failed:', error.message)
		process.exit(1)
	})
