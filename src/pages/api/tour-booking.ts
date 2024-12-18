// pages/api/tour-booking.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check if customer field exists in the request body
  if (!req.body.customer) {
    return res.status(400).json({ 
      message: 'Customer field is required'
    });
  }

  try {
    const response = await axios.post(
      'https://staging.chevroncemcs.com/api/resource/Tour%20Booking',
      req.body,
      {
        auth: {
          username: 'd5ea6c1a0aaeb82',
          password: '0476216f7e4e8ca'
        },
        headers: {
          'Content-Type': 'application/json',
          Cookie: req.headers.cookie || '', // Forward auth cookies if any
        }
      }
    );

    // Forward any cookies from the response
    const cookies = response.headers['set-cookie'];
    if (cookies) {
      res.setHeader('Set-Cookie', cookies);
    }

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: 'Failed to create tour booking',
      error: error.response?.data?.message || error.message || 'Unknown error'
    });
  }
}