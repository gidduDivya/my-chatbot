import mongoose from 'mongoose'

export default async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chatbot'
  await mongoose.connect(mongoUri)
  console.log('MongoDB connected')
}
