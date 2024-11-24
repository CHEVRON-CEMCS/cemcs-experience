import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await axios.post(
      'https://staging.chevroncemcs.com/api/resource/Flight%20Booking',
      req.body,
      {
        auth: {
          username: 'd5ea6c1a0aaeb82',
          password: '0476216f7e4e8ca'
        },
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: 'Failed to create flight booking',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}