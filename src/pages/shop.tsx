import React from 'react'
import { ImageSlider } from '../../components/Banner'
import { Navbar } from '../../components/Navbar'
import { ProductCard } from '../../components/ProductCard'
import Footer from '../../components/Footer'

const Shop: React.FC = () => {
  return (
    <div>
        <Navbar />
        <div className='max-w-7xl mx-auto'>
          <ImageSlider />
          <div>
            <h1 className='text-3xl font-bold mt-14'>Featured Products</h1>
          </div>
          <div className='w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8 mt-8 mb-10'>
            <ProductCard />
          </div>
        </div>
        <div>
          <Footer />
        </div>
    </div>
  )
}

export default Shop