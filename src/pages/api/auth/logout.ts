// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Clear all auth-related cookies
    res.setHeader('Set-Cookie', [
      'sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'full_name=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'user_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'system_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'user_image=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    ]);

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to logout' });
  }
}