// pages/api/Epawn Biddings/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const requestData = {
    doctype: 'Epawn Biddings',
    ...req.body,
    status: req.body.status || "0"
  };

  try {
    console.log('Received bid data:', req.body);
    console.log('Sending request to Frappe with data:', requestData);

    const response = await axios.post(
      'https://staging.chevroncemcs.com/api/resource/Epawn%20Biddings',
      requestData,
      {
        auth: {
          username: 'd5ea6c1a0aaeb82',
          password: '0476216f7e4e8ca'
        }
      }
    );

    console.log('Response from Frappe:', response.data);

    // Check if response.data.data exists, otherwise return the whole response.data
    const responseData = response.data.data || response.data;
    res.status(200).json({ data: responseData });
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to create bid',
      details: error.response?.data?.message || error.message || 'Unknown error',
      debug: {
        requestData: requestData,
        responseError: error.response?.data
      }
    });
  }
}