import { loginUser, registerUser } from '../services/auth.service.js'

function requireFields(values, fields) {
  for (const field of fields) {
    if (!values[field] || typeof values[field] !== 'string' || !values[field].trim()) {
      const error = new Error(`${field} is required`)
      error.statusCode = 400
      throw error
    }
  }
}

export async function register(request, response, next) {
  try {
    const { userName, email, password, confirmPassword } = request.body
    requireFields(request.body, ['userName', 'email', 'password', 'confirmPassword'])

    if (password !== confirmPassword) {
      const error = new Error('Passwords do not match')
      error.statusCode = 400
      throw error
    }

    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters')
      error.statusCode = 400
      throw error
    }

    const result = await registerUser({ userName: userName.trim(), email: email.trim(), password })
    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body
    requireFields(request.body, ['email', 'password'])
    const result = await loginUser({ email: email.trim(), password })
    response.json(result)
  } catch (error) {
    next(error)
  }
}
