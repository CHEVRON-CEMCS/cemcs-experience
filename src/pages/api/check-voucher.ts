import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await axios({
      method: 'get',
      url: 'https://c-integration.azurewebsites.net/suregift/balance',
      headers: { 
        'Content-Type': 'application/json', 
        'apikey': '5fb808d57871fcacd36e2dd7ed9efe23'
      },
      data: req.body
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ message: 'Error checking voucher balance' });
  }
}