// pages/api/[endpoint].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint, category, sub_category, featured, customer } = req.query
  
  const fields = {
    'Hotel': '["name","hotel_name"]',
    'Product': '["name","product_name","price","pro_image","category","sub_category","featured"]',
    'Flight Booking': '["name","customer"]',
    'Tour Booking': '["name","customer"]',
    'Tour Package': '["name","package_name"]',
    'Experience Blog': '["name","title","featured_image","publish_date","status"]',
  }[endpoint as string] || '["name"]'
  
  try {
    let url = `https://staging.chevroncemcs.com/api/resource/${endpoint}?fields=${fields}&limit_page_length=10000`
    
    let filters = []
    
    if (category) {
      filters.push(["category", "=", category])
    }
    
    if (sub_category) {
      filters.push(["sub_category", "=", sub_category])
    }
    
    // Add featured filter when featured=true in query
    if (featured === 'true') {
      filters.push(["featured", "=", "Yes"])
    }
    
    if (filters.length > 0) {
      url += `&filters=${encodeURIComponent(JSON.stringify(filters))}`
    }

    console.log('Final URL:', url)
    console.log('Filters:', filters)
    
    const response = await axios.get(url, {
      auth: {
        username: 'd5ea6c1a0aaeb82',
        password: '0476216f7e4e8ca'
      }
    })

    // Handle both array and single object responses
    let responseData;
    if (Array.isArray(response.data.data)) {
      responseData = response.data.data;
    } else if (response.data.data && typeof response.data.data === 'object') {
      responseData = [response.data.data];
    } else {
      responseData = [];
    }

    res.status(200).json({ data: responseData })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}