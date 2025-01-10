// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { baseUrl, ...loginData } = req.body

  try {
    const response = await axios.post(
      `https://${baseUrl}/api/method/login`,
      loginData,
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

    return res.status(200).json(response.data)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Forward the exact status code and error message from Frappe
      return res.status(error.response.status).json(error.response.data)
    }
    
    return res.status(500).json({ 
      message: 'Failed to login',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}