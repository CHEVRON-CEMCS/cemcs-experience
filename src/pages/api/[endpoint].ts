// pages/api/[endpoint].ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    endpoint = "",
    category,
    sub_category,
    featured,
    search,
    id,
    product_id,
  } = req.query;

  const endpointStr = Array.isArray(endpoint) ? endpoint[0] : endpoint;

  const fields =
    {
      Hotel: '["name","hotel_name"]',
      Product:
        '["name","product_name","price","pro_image","category","sub_category","featured","status"]',
      "Flight Booking": '["name","customer"]',
      "Tour Booking": '["name","customer"]',
      "Hotel Booking": '["name", "customer"]',
      "Tour Package": '["name","package_name"]',
      "Experience Blog":
        '["name","title","featured_image","publish_date","status"]',
      Carousel: '["name","carousel_name","slides"]',
      "Epawn Products":
        '["name","product_name","price","image","image_2","image_3","image_4","status","description","owner_name","subscriber_id","member_id","is_deleted"]',
      "Epawn Biddings":
        '["name","name1","price","email","phone","status","creation","product","member_id"]',
    }[endpointStr] || '["name"]';

  try {
    if (id && endpointStr === "Epawn Subscriber") {
      const url = `https://staging.chevroncemcs.com/api/resource/${endpointStr}/SUB-${id}`;

      try {
        await axios.head(url, {
          auth: {
            username: "d5ea6c1a0aaeb82",
            password: "0476216f7e4e8ca",
          },
        });
      } catch (error) {
        return res
          .status(404)
          .json({ exists: false, error: "Resource not found" });
      }

      const response = await axios.get(url, {
        auth: {
          username: "d5ea6c1a0aaeb82",
          password: "0476216f7e4e8ca",
        },
      });
      return res.status(200).json({ data: response.data.data });
    }

    if (id && endpointStr === "Epawn Products") {
      const productUrl = `https://staging.chevroncemcs.com/api/resource/${endpointStr}/${id}`;
      const response = await axios.get(productUrl, {
        auth: {
          username: "d5ea6c1a0aaeb82",
          password: "0476216f7e4e8ca",
        },
        params: {
          filters: {
            status: "0",
          },
        },
      });
      return res.status(200).json({ data: response.data.data });
    }

    // Handle Epawn Biddings with product_id filter
    if (endpointStr === "Epawn Biddings" && product_id) {
      const url = `https://staging.chevroncemcs.com/api/resource/${endpointStr}`;
      const response = await axios.get(url, {
        auth: {
          username: "d5ea6c1a0aaeb82",
          password: "0476216f7e4e8ca",
        },
        params: {
          fields: fields,
          filters: JSON.stringify([["product", "=", product_id]]),
        },
      });

      let biddingData = [];
      if (response.data && response.data.data) {
        biddingData = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];
      }
      return res.status(200).json({ data: biddingData });
    }

    let url = `https://staging.chevroncemcs.com/api/resource/${endpoint}?fields=${fields}&limit_page_length=10000`;

    let filters = [];

    // Handle status filters for different product types
    if (endpointStr === "Product") {
      filters.push(["status", "=", "Active"]);
      // filters.push(["status", "=", "Out%20of%20Stock"]);
    }

    // Add search filter if search query exists
    if (search && typeof search === "string") {
      filters.push(["product_name", "like", `%${search}%`]);
    }

    if (category) {
      filters.push(["category", "=", category]);
    }

    if (sub_category) {
      filters.push(["sub_category", "=", sub_category]);
    }

    if (featured === "true") {
      filters.push(["featured", "=", "Yes"]);
    }

    if (filters.length > 0) {
      url += `&filters=${encodeURIComponent(JSON.stringify(filters))}`;
    }

    console.log("Final URL:", url);
    console.log("Filters:", filters);

    const response = await axios.get(url, {
      auth: {
        username: "d5ea6c1a0aaeb82",
        password: "0476216f7e4e8ca",
      },
    });

    let responseData;
    if (Array.isArray(response.data.data)) {
      responseData = response.data.data;
    } else if (response.data.data && typeof response.data.data === "object") {
      responseData = [response.data.data];
    } else {
      responseData = [];
    }

    res.status(200).json({ data: responseData });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: "Failed to fetch data",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
