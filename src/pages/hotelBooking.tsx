import React, { useEffect, useState } from 'react'
import { NavTravel } from '../../components/NavTravel'
import axios, { AxiosError } from 'axios'
import { HotelCard, LoadingHotelCard } from '../../components/HotelCard';

interface HotelBooking {
    name: string;
    hotel_name: string;
  }

const hotelBooking = () => {
    const [bookings, setBookings] = useState<HotelBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/Hotel', {
          params: {
            fields: '["name", "hotel_name"]'
          }
        });        console.log('API Response:', response.data)
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
        <div className='max-w-7xl mx-auto'>
        <div>
              <h1 className='text-2xl font-semibold pb-1 mt-10'>Explore Hotel Bookings</h1>
            </div>
            <div className='w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8 mt-8 mb-10'>
                {loading ? (
                <>
                    <LoadingHotelCard />
                    <LoadingHotelCard />
                    <LoadingHotelCard />
                    <LoadingHotelCard />
                </>
                ) : error ? (
                <p>Error loading bookings: {error}</p>
                ) : (
                bookings.map((booking) => (
                    <HotelCard key={booking.name} booking={booking} />
                ))
                )}
            </div>
        </div>
    </div>
  )
}

export default hotelBooking