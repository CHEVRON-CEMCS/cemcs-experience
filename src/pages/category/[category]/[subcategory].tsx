// pages/category/[category]/[subcategory].tsx
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { LoadingProductCard, ProductCard } from '../../../../components/ProductCard'
import Footer from '../../../../components/Footer'
import { CategoryNav } from '../../../../components/CategoryNav'
import axios, { AxiosError } from 'axios'
import { Navbar } from '../../../../components/Navbar'

interface Product {
    name: string;
    product_name: string;
    price: number;
    pro_image: string;
    featured: string;
    category: string;
    sub_category: string;
    status: string;
    discounted_price: number;
    stock_qty: number;
  }

// pages/category/[category]/[subcategory].tsx
const SubCategoryPage: React.FC = () => {
    const router = useRouter()
    const { category, subcategory } = router.query
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
  
    useEffect(() => {
      const fetchProducts = async () => {
        if (!category || !subcategory) return
  
        try {
          const requestUrl = `/api/Product?category=${encodeURIComponent(category as string)}&sub_category=${encodeURIComponent(subcategory as string)}`
          console.log('Making request to:', requestUrl)
          
          const response = await axios.get(requestUrl)
          console.log('Full API Response:', response)
          console.log('Response data:', response.data)
          console.log('Response data type:', typeof response.data)
          console.log('Response data.data type:', typeof response.data.data)
          
          if (response.data) {
            if (Array.isArray(response.data.data)) {
              console.log('Setting array of products:', response.data.data)
              setProducts(response.data.data)
            } else if (typeof response.data.data === 'object' && response.data.data !== null) {
              console.log('Setting single product as array:', [response.data.data])
              setProducts([response.data.data])
            } else {
              console.log('No valid products found in response')
              setProducts([])
            }
          } else {
            setError('No data returned from API')
          }
        } catch (err) {
          console.error('Detailed API Error:', err)
          const errorMessage = err instanceof AxiosError 
            ? err.response?.data?.message || err.message
            : 'An unexpected error occurred'
          setError(errorMessage)
        } finally {
          setLoading(false)
        }
      }
  
      fetchProducts()
    }, [category, subcategory])
  
    // Add this console log to check the current state
    console.log('Current state:', { category, subcategory, products, loading, error })
  
    if (!category || !subcategory) {
      return <div>Loading...</div>
    }
  
    return (
      <div>
        <Navbar />
        <CategoryNav />
        <div className='max-w-7xl mx-auto mt-5'>
          <h1 className='text-3xl font-bold mt-14'>
            {category} - {subcategory}
          </h1>
          <div className='w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8 mt-8 mb-10'>
            {loading ? (
              <>
                <LoadingProductCard />
                <LoadingProductCard />
                <LoadingProductCard />
                <LoadingProductCard />
              </>
            ) : error ? (
              <p>Error loading products: {error}</p>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No products found for {subcategory} in {category}</p>
                <pre className="mt-4 text-left text-sm text-gray-400">
                  Debug Info:
                  Category: {category}
                  Subcategory: {subcategory}
                  Products Count: {products.length}
                </pre>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))
            )}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

export default SubCategoryPage