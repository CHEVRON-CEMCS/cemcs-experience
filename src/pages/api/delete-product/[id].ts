import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    console.error("❌ Error: No valid product ID provided.");
    return res.status(400).json({ message: "Product ID is required" });
  }

  const baseUrl = "https://staging.chevroncemcs.com/api/resource";
  const auth = {
    username: "d5ea6c1a0aaeb82",
    password: "0476216f7e4e8ca",
  };

  try {
    console.log(`🟡 Updating product ${id} -> Setting is_deleted to "Yes"`);

    const response = await axios.put(
      `${baseUrl}/Epawn Products/${id}`,
      { is_deleted: 1 }, // ✅ Updating is_deleted field
      { auth }
    );

    console.log("✅ Success Response:", response.status, response.data);

    return res
      .status(200)
      .json({ message: "Product marked as deleted successfully" });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.message || JSON.stringify(error.response?.data);

      console.error("❌ API Error:", {
        status: statusCode,
        message: errorMessage,
        path: req.url,
      });

      return res.status(statusCode).json({
        error: "Failed to update product",
        message: errorMessage,
      });
    }

    console.error("❌ Unknown Error:", error);
    return res.status(500).json({
      error: "Failed to update product",
      message: "An unexpected error occurred",
    });
  }
}
