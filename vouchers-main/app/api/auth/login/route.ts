/**
 * Login API Route
 * 
 * POST /api/auth/login
 * 
 * Authenticates a user with email and password.
 * Uses bcrypt to verify password against stored hash.
 * Returns user information on successful authentication.
 * 
 * Request body:
 * ```json
 * {
 *   "email": "user@example.com",
 *   "password": "securepassword"
 * }
 * ```
 * 
 * Success response (200):
 * ```json
 * {
 *   "message": "Login successful",
 *   "user": {
 *     "id": 1,
 *     "email": "user@example.com",
 *     "role": "buyer"
 *   }
 * }
 * ```
 * 
 * Error responses:
 * - 400: Missing email or password
 * - 401: Invalid credentials
 * - 500: Internal server error
 * 
 * @see prisma - Database client
 * @see bcryptjs - Password comparison
 */

import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Handle POST request for user login
 * 
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<NextResponse>} JSON response with authentication result
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Compare password
    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    return NextResponse.json(
      {
        message: 'Login successful',
        user: { id: user.id, email: user.email, role: user.role }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
