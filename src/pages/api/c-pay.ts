import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "invalid method" });
  }

  try {
    const response = await axios({
      method: "post",
      url: "https://retiree.chevroncemcs.com/api/method/member_experience.api.ecommerce.create_cpay_loan",
      auth: {
        username: "687e5004352a67d",
        password: "411865a5b745cf9",
      },
      data: req.body,
    });
    // console.log(response);

    return res.status(200).json(response.data);
  } catch (err) {
    console.log("error: ", err);
    return res.status(500).json({
      message: "error creating loan",
    });
  }
}
