import React, { useEffect, useState } from 'react';
import { NavTravel } from '../../components/NavTravel';
import { TourSlider } from '../../components/TourSlider';
import { TourCard } from '../../components/TourCard';
import axios, { AxiosError } from 'axios'
import Image from 'next/image';
import Link from 'next/link';

interface TourPackage {
  name: string;
}

const tourPackage = () => {
  const [bookings, setBookings] = useState<TourPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/Tour Package')
        console.log('API Response:', response.data)
        setBookings(response.data.data)
      } catch (err) {
        console.error('API Error:', err)
        const errorMessage = err instanceof AxiosError 
          ? err.response?.data?.message || err.message
          : 'An unexpected error occurred'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  return (
    <div>
      <NavTravel />
      <div className="max-w-7xl mx-auto px-4">
        <div>
          <TourSlider />
        </div>
        <div className="mt-7">
          <h1 className="text-2xl font-bold">Discover Travel Packages</h1>
        </div>
        {bookings.length === 0 ? (
          <div className="text-center mt-20 space-y-2 pb-20">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <Image 
                src='/empty-cart.png' 
                alt='Empty cart' 
                layout='fill'
                objectFit='contain' 
              />
            </div>
            <h5 className='font-Sora text-1xl text-gray-900'>No trips booked...yet!</h5>
            <p className='text-xs text-gray-600 font-normal'>
              Time to dust off your bags and start planning your next adventure.
            </p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8 mt-8 mb-10">
          {bookings.map((booking, index) => (
            <Link 
            href={`/tourdetails/${booking.name}`} 
            key={booking.name}
          >
            <TourCard key={index} name={booking.name} />
            </Link>
          ))}
        </div>
        )}
      </div>
      
    </div>
  );
};

export default tourPackage;
