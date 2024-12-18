// pages/api/flight-booking.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // First make the request with basic auth
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
          // Forward any cookies from the client request
          Cookie: req.headers.cookie || '',
        }
      }
    );

    // If the response has any cookies, forward them to the client
    const cookies = response.headers['set-cookie'];
    if (cookies) {
      res.setHeader('Set-Cookie', cookies);
    }

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('API Error:', error);
    
    // More detailed error handling
    const errorResponse = error.response?.data;
    return res.status(error.response?.status || 500).json({ 
      message: errorResponse?.message || 'Failed to create flight booking',
      error: errorResponse || (error instanceof Error ? error.message : 'Unknown error')
    });
  }
}