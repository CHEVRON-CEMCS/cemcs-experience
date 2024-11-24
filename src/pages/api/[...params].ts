// pages/api/[...params].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { params } = req.query
  const endpoint = Array.isArray(params) ? params.join('/') : params
  
  try {
    const response = await axios.get(`https://staging.chevroncemcs.com/api/resource/${endpoint}`, {
      auth: {
        username: 'd5ea6c1a0aaeb82',
        password: '0476216f7e4e8ca'
      }
    })
    res.status(200).json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' })
  }
}