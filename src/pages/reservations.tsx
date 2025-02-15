import React, { useEffect, useState } from 'react'
import { Navbar } from '../../components/Navbar'
import { ReservationSlider } from '../../components/ReservationSlider'
import { HotelCard, LoadingHotelCard } from '../../components/HotelCard'
import { NavTravel } from '../../components/NavTravel'
import SmallCard from '../../components/SmallCard'
import LargeCard from '../../components/LargeCard'
import Footer from '../../components/Footer'
import { AppleCardsCarouselDemo } from '../../components/AppleCardsCarousel'
import axios, { AxiosError } from 'axios'
import { useAuthStore } from '../../store/authStore'


interface HotelBooking {
  name: string;
  hotel_name: string;
}

const Reservations = () => {
  const [bookings, setBookings] = useState<HotelBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuthStore();
  console.log('User Authenticated?:',isAuthenticated)
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











  // Local array of card data
  const data = [
    {"img":"/visa1.jpg","location":"Singapore","distance":"Visa"},
    {"img":"/visa2.jpg","location":"Paris","distance":"Visa"},
    {"img":"/visa3.jpg","location":"USA","distance":"Visa"},
    {"img":"/visa4.jpg","location":"Canada","distance":"Visa"},
    {"img":"/visa5.jpg","location":"Netherlands","distance":"Visa"},
    {"img":"/visa6.jpg","location":"United Kingdom","distance":"Visa"},
    {"img":"/visa7.jpg","location":"Qatar","distance":"Visa"},
    {"img":"/visa5.jpg","location":"Dubai","distance":"Visa"}
  ];

  return (
    <div>
        <NavTravel />
        <div className='max-w-7xl mx-auto'>
            <div>
                <ReservationSlider />
            </div>
            <div className='mt-8'>
            <h2 className='text-2xl font-semibold pb-1'>Visa Applications</h2>
            <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>      {/* Mapping over the array and rendering SmallCard components */}
              {data.map(({img, location, distance}) => (
                <SmallCard 
                  key={img}  // Using img as the unique key
                  img={img}
                  distance={distance}
                  location={location}
                />
              ))}
            </div>
            </div>

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
            <div>
                <AppleCardsCarouselDemo />
              </div>
            <div>
            <LargeCard 
        img="/large.jpg"
        title="The Greatest Outdoors"
        description="Brought to you by CEMCS Travels."
        buttonText="Get Inspired"
      />
            </div>

              

            <div>
              <Footer />
            </div>
        </div>
    </div>
  )
}

export default Reservations