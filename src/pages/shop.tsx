import React, { useEffect, useState } from 'react'
import { Navbar } from '../../components/Navbar'
import { LoadingProductCard, ProductCard } from '../../components/ProductCard'
import Footer from '../../components/Footer'
import axios, { AxiosError } from 'axios'
import { Toaster, toast } from 'sonner'
import { CategoryNav } from '../../components/CategoryNav'
import ShoppingImageSlider from '../../components/ShoppingImageSlider'

interface Product {
  name: string;
  product_name: string; 
  price: number;
  pro_image: string;
  featured: string;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/Product?featured=true')
        console.log('product', response.data)
        
        // Make sure we're working with an array
        const productsData = Array.isArray(response.data.data) 
          ? response.data.data 
          : [response.data.data];
        
        // Add proper type to the filter function
        const featuredProducts = productsData.filter((product: Product) => product.featured === "Yes");
        setProducts(featuredProducts)
      } catch (err) {
        const errorMessage = err instanceof AxiosError 
          ? err.response?.data?.message || err.message
          : 'An unexpected error occurred'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div>
     <Navbar />
     <CategoryNav />
     <div className='max-w-7xl mx-auto mt-5'>
       <ShoppingImageSlider />
       <div>
         <h1 className='text-3xl font-bold mt-14'>Featured Products</h1>
       </div>
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

export default Shop