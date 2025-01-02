// pages/api/[endpoint].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint, category, featured, customer } = req.query
  const fields = {
    'Hotel': '["name","hotel_name"]',
    'Product': '["name","product_name","price","pro_image","category","featured"]',
    'Flight Booking': '["name","customer"]',
    'Tour Booking': '["name","customer"]',
    'Tour Package': '["name","package_name"]',
    'Experience Blog': '["name","title","featured_image","publish_date","status"]',
  }[endpoint as string] || '["name"]'
  
  try {
    let url = `https://staging.chevroncemcs.com/api/resource/${endpoint}?fields=${fields}&limit_page_length=10000`
    
    // Create an array of filters
    let filters = []
    
    // Add category filter if provided
    if (category) {
      filters.push(["category", "=", category])
    }
    
    // Add featured filter only if specifically requested
    if (featured === 'true') {
      filters.push(["featured", "=", "Yes"])
    }

    // Add customer filter if provided
    if (customer) {
      filters.push(["customer", "=", customer])
    }

    // Add status filter for Experience Blog
    if (endpoint === 'Experience Blog') {
      filters.push(["status", "=", "Published"])
    }
    
    // Add filters to URL if any exist
    if (filters.length > 0) {
      url += `&filters=${encodeURIComponent(JSON.stringify(filters))}`
    }
    
    const response = await axios.get(url, {
      auth: {
        username: 'd5ea6c1a0aaeb82',
        password: '0476216f7e4e8ca'
      }
    })
    res.status(200).json(response.data)
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}