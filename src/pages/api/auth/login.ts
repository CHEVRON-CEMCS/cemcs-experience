// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const response = await axios.post(
      'https://retiree.chevroncemcs.com/api/method/login',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )

    // Get cookies from response
    const cookies = response.headers['set-cookie']
    if (cookies) {
      // Forward all cookies to the client
      res.setHeader('Set-Cookie', cookies)
    }

    // Get the session id if it exists
    const sessionCookie = cookies?.find(cookie => cookie.startsWith('sid='))
    if (sessionCookie) {
      // Set up session cookie specifically
      res.setHeader('Set-Cookie', sessionCookie)
    }

    return res.status(200).json(response.data)
  } catch (error) {
    console.error('Login Error:', error)
    return res.status(500).json({ 
      message: 'Failed to login',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}