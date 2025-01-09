// pages/category/[category]/[subcategory].tsx
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { LoadingProductCard, ProductCard } from '../../../../components/ProductCard'
import Footer from '../../../../components/Footer'
import { CategoryNav } from '../../../../components/CategoryNav'
import axios, { AxiosError } from 'axios'
import { Navbar } from '../../../../components/Navbar'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

const ITEMS_PER_PAGE = 12;

const SubCategoryPage: React.FC = () => {
  const router = useRouter()
  const { category, subcategory } = router.query
  const [products, setProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category || !subcategory) return

      try {
        const requestUrl = `/api/Product?category=${encodeURIComponent(category as string)}&sub_category=${encodeURIComponent(subcategory as string)}`
        console.log('Making request to:', requestUrl)
        
        const response = await axios.get(requestUrl)
        
        if (response.data) {
          if (Array.isArray(response.data.data)) {
            setProducts(response.data.data)
          } else if (typeof response.data.data === 'object' && response.data.data !== null) {
            setProducts([response.data.data])
          } else {
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

  // Calculate pagination values
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  // Get current page's products
  const indexOfLastProduct = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };

  if (!category || !subcategory) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Navbar />
      <CategoryNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className='text-3xl font-bold mb-8'>
          {category} - {subcategory}
        </h1>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
              <LoadingProductCard key={index} />
            ))}
          </div>
        ) : error ? (
          <p>Error loading products: {error}</p>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No products found for {subcategory} in {category}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {currentProducts.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    // Show first page, last page, and pages around current page
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={page === currentPage}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default SubCategoryPage