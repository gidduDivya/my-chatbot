import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/user.model.js'

function createToken(user) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured')

  return jwt.sign(
    { userId: user._id.toString(), email: user.email },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  )
}

function publicUser(user) {
  return {
    id: user._id,
    userName: user.userName,
    email: user.email,
  }
}

export async function registerUser({ userName, email, password }) {
  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    const error = new Error('An account with this email already exists')
    error.statusCode = 409
    throw error
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({ userName, email, password: passwordHash })

  return {message:"user Registered successfully." ,user: publicUser(user), token: createToken(user) }
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
  const passwordMatches = user && await bcrypt.compare(password, user.password)

  if (!passwordMatches) {
    const error = new Error('Invalid email or password')
    error.statusCode = 401
    throw error
  }

  return {message:"User logged in successfully.", user: publicUser(user), token: createToken(user) }
}
