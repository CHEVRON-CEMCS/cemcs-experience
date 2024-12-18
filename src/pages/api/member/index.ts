// pages/api/member/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Check if we have cookies
  if (!req.headers.cookie) {
    return res.status(401).json({ message: 'No session found' })
  }

  try {
    const response = await axios.get(
      'https://retiree.chevroncemcs.com/api/resource/Member',
      {
        headers: {
          'Cookie': req.headers.cookie,
          'Content-Type': 'application/json',
        }
      }
    )
    return res.status(200).json(response.data)
  } catch (error) {
    console.error('Member List Error:', error)
    return res.status(500).json({ 
      message: 'Failed to fetch member list',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}