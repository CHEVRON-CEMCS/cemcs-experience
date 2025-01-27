// pages/api/epawn-bid-status-update.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { bidId, newStatus, product, previous_status, subscriber_id } =
      req.body;

    const statusUpdateData = {
      doctype: "Epawn Biddings",
      status: newStatus,
    };

    const response = await axios.put(
      `https://staging.chevroncemcs.com/api/resource/Epawn Biddings/${bidId}`,
      statusUpdateData,
      {
        auth: {
          username: "d5ea6c1a0aaeb82",
          password: "0476216f7e4e8ca",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error updating bid status:", error.response?.data || error);
    return res.status(500).json({
      message: "Failed to update bid status",
      error: error.response?.data || error.message,
    });
  }
}
