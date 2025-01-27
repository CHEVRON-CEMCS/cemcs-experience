import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { product_id, newStatus } = req.body;

    const productStatusUpdateData = {
      doctype: "Epawn Products",
      status: newStatus,
    };

    const responseProduct = await axios.put(
      `https://staging.chevroncemcs.com/api/resource/Epawn Products/${product_id}`,
      productStatusUpdateData,
      {
        auth: {
          username: "d5ea6c1a0aaeb82",
          password: "0476216f7e4e8ca",
        },
      }
    );

    return res.status(200).json(responseProduct.data);
  } catch (error: any) {
    console.error("Error updating bid status:", error.response?.data || error);
    return res.status(500).json({
      message: "Failed to product status",
      error: error.response?.data || error.message,
    });
  }
}
