import React, { useEffect, useState } from 'react'
import { NavTravel } from '../../components/NavTravel'
import Image from 'next/image'
import axios, { AxiosError } from 'axios'
import Link from 'next/link';

interface Booking {
  name: string;
}

const TourBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/Tour Booking')
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

  if (loading) {
    return (
      <div>
        <NavTravel />
        <div className="xl:mx-auto mb-14 xl:max-w-7xl xl:px-10 mt-8">
          <div className='mt-8 pb-3'>
            <h5 className='font-Sora text-3xl text-[#162748] font-bold'>Tour Bookings</h5>
          </div>
          <div className="text-center mt-20">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <NavTravel />
        <div className="xl:mx-auto mb-14 xl:max-w-7xl xl:px-10 mt-8">
          <div className='mt-8 pb-3'>
            <h5 className='font-Sora text-3xl text-[#162748] font-bold'>Tour Bookings</h5>
          </div>
          <div className="text-red-500 mt-4">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <NavTravel />
      <div className="xl:mx-auto mb-14 xl:max-w-7xl xl:px-10 mt-8">
        <div className='mt-8 pb-3'>
          <h5 className='font-Sora text-3xl text-[#162748] font-bold'>Tour Bookings</h5>
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
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {bookings.map(booking => (
                <Link 
                  href={`/tourbooking/${booking.name}`} 
                  key={booking.name}
                >
                  <div className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="relative h-[250px] mb-4">
                      <Image
                        src="/tourbook.jpg"
                        alt="Product Image"
                        fill
                        className="object-cover object-center rounded-lg"
                      />
                    </div>
                    <p className="font-medium text-center">Booking Reference: {booking.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TourBookings