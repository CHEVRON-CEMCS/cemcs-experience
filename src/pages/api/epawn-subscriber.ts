// pages/api/epawn-subscriber.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await axios.post(
      'https://staging.chevroncemcs.com/api/resource/Epawn%20Subscriber',
      req.body,
      {
        auth: {
          username: 'd5ea6c1a0aaeb82',
          password: '0476216f7e4e8ca'
        }
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to register subscriber',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}