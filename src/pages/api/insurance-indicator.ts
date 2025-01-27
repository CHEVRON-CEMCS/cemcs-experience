import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(400).json({
      message: "method not supported",
    });
  }

  try {
    const response = await axios.post(
      "https://staging.chevroncemcs.com/api/resource/Insurance%20Indicator",
      req.body,
      {
        auth: {
          username: "d5ea6c1a0aaeb82",
          password: "0476216f7e4e8ca",
        },
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "",
        },
      }
    );

    const cookies = response.headers["set-cookie"];
    if (cookies) {
      res.setHeader("Set-Cookie", cookies);
    }

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.log("API Error:", error);

    const errorResponse = error?.response?.data;
    return res.status(error?.response?.status || 500).json({
      message: errorResponse?.message || "Failed to create insurance indicator",
      error:
        errorResponse ||
        (error instanceof Error ? error.message : "Unknown error"),
    });
  }
}
