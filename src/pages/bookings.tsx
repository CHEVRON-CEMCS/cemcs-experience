import React, { useEffect, useState } from 'react'
import { NavTravel } from '../../components/NavTravel'
import Image from 'next/image'
import axios, { AxiosError } from 'axios'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from '../../store/authStore'

interface Booking {
  name: string;
}

type BookingType = 'flight' | 'tour';

const CombinedBookings = () => {
  const { memberDetails } = useAuthStore();
  const [activeTab, setActiveTab] = useState<BookingType>('flight')
  const [flightBookings, setFlightBookings] = useState<Booking[]>([])
  const [tourBookings, setTourBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState({ flight: true, tour: true })
  const [error, setError] = useState({ flight: null, tour: null })

  const bookingConfigs = {
    flight: {
      title: 'Flight Bookings',
      apiEndpoint: '/api/Flight Booking',
      linkPrefix: '/bookings',
      imageSrc: '/flightbook.jpg',
      setState: setFlightBookings,
      data: flightBookings,
    },
    tour: {
      title: 'Tour Bookings',
      apiEndpoint: '/api/Tour Booking',
      linkPrefix: '/tourbooking',
      imageSrc: '/tourbook.jpg',
      setState: setTourBookings,
      data: tourBookings,
    }
  }

  const fetchBookings = async (type: BookingType) => {
    if (!memberDetails?.membership_number) {
      setError(prev => ({ ...prev, [type]: "Please login to view your bookings" }));
      setLoading(prev => ({ ...prev, [type]: false }));
      return;
    }

    try {
      const response = await axios.get(bookingConfigs[type].apiEndpoint, {
        params: {
          customer: memberDetails.membership_number
        }
      });
      console.log(`${type} API Response:`, response.data);
      bookingConfigs[type].setState(response.data.data);
      setError(prev => ({ ...prev, [type]: null }));
    } catch (err) {
      console.error(`${type} API Error:`, err);
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message || err.message
        : 'An unexpected error occurred';
      setError(prev => ({ ...prev, [type]: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  }

  useEffect(() => {
    fetchBookings('flight')
    fetchBookings('tour')
  }, [memberDetails?.membership_number])

  const renderBookings = (type: BookingType) => {
    if (loading[type]) {
      return <div className="text-center mt-20">Loading...</div>
    }

    if (error[type]) {
      return <div className="text-red-500 mt-4">{error[type]}</div>
    }

    const bookings = bookingConfigs[type].data

    if (bookings.length === 0) {
      return (
        <div className="text-center mt-20 space-y-2 pb-20">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <Image 
              src='/empty-cart.png' 
              alt='Empty cart' 
              layout='fill'
              objectFit='contain' 
            />
          </div>
          <h5 className='font-Sora text-1xl text-gray-900'>No {type} bookings yet!</h5>
          <p className='text-xs text-gray-600 font-normal'>
            Time to dust off your bags and start planning your next adventure.
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bookings.map(booking => (
          <Link 
            href={`${bookingConfigs[type].linkPrefix}/${booking.name}`} 
            key={booking.name}
          >
            <div className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="relative h-[250px] mb-4">
                <Image
                  src={bookingConfigs[type].imageSrc}
                  alt={`${type} booking image`}
                  fill
                  className="object-cover object-center rounded-lg"
                />
              </div>
              <p className="font-medium text-center">Booking Reference: {booking.name}</p>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div>
      <NavTravel />
      <div className="xl:mx-auto mb-14 xl:max-w-7xl xl:px-10 mt-8">
        <div className='mt-8 pb-3'>
          <h5 className='font-Sora text-3xl text-[#162748] font-bold'>My Booking History</h5>
        </div>
        
        <Tabs defaultValue="flight" className="mt-6" onValueChange={(value) => setActiveTab(value as BookingType)}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="flight">Flight Bookings</TabsTrigger>
            <TabsTrigger value="tour">Tour Bookings</TabsTrigger>
          </TabsList>
          <TabsContent value="flight" className="mt-6">
            {renderBookings('flight')}
          </TabsContent>
          <TabsContent value="tour" className="mt-6">
            {renderBookings('tour')}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CombinedBookings