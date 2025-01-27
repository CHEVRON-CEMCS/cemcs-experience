// pages/api/epawn-bid-status-update.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { bidId, newStatus, product, previous_status, subscriber_id } = req.body;

    const statusUpdateData = {
      doctype: "Epawn Bid Status Update",
      bid_id: bidId,
      product: product,
      new_status: newStatus,
      previous_status: previous_status,
      subscriber_id: subscriber_id,
      update_date: new Date().toISOString(),
      comments: `Status updated to ${newStatus === "1" ? "Accepted" : newStatus === "2" ? "Rejected" : "Pending"}`
    };

    const response = await axios.post(
      `https://staging.chevroncemcs.com/api/resource/Epawn Bid Status Update`,
      statusUpdateData
    );

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error updating bid status:', error.response?.data || error);
    return res.status(500).json({ 
      message: 'Failed to update bid status',
      error: error.response?.data || error.message 
    });
  }
}