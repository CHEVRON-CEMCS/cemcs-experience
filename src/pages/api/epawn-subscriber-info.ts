// pages/api/epawn-subscriber-info.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { member_id } = req.query;

    const response = await axios.get(
      `https://staging.chevroncemcs.com/api/resource/Epawn%20Subscriber/${member_id}`,
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
      error: 'Failed to fetch subscriber information',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}