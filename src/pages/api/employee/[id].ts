// pages/api/employee/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Check if we have cookies
  if (!req.headers.cookie) {
    return res.status(401).json({ message: "No session found" });
  }

  const { id } = req.query;
  // Get the baseUrl from the request headers
  const baseUrl = req.headers["x-base-url"];

  if (!baseUrl) {
    return res.status(400).json({ message: "Base URL is required" });
  }

  try {
    const response = await axios.get(
      `https://${baseUrl}/api/resource/Employee/${id}`,
      {
        headers: {
          Cookie: req.headers.cookie,
          "Content-Type": "application/json",
        },
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Staff Details Error:", error);
    return res.status(500).json({
      message: "Failed to staff member details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
