import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { NavTravel } from '../../../components/NavTravel'
import Image from 'next/image'
import axios, { AxiosError } from 'axios'

interface FlightSegment {
  flight_number: string;
  airline: string;
  from_city: string;
  to_city: string;
  departure_date: string;
  arrival_date: string;
  cabin_class: string;
}

interface Passenger {
  title: string;
  first_name: string;
  last_name: string;
  passenger_type: string;
  gender: string;
}

interface BookingDetails {
  name: string;
  booking_date: string;
  booking_status: string;
  booking_type: string;
  contact_email: string;
  contact_phone: string;
  total_amount: number;
  payment_status: string;
  flight_segments: FlightSegment[];
  passengers: Passenger[];
}

const BookingDetails = () => {
  const router = useRouter()
  const { id } = router.query
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!id) return
      
      try {
        const response = await axios.get(`/api/Flight Booking/${id}`)
        setBooking(response.data.data)
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

    fetchBookingDetails()
  }, [id])

  if (loading) return (
    <div>
      <NavTravel />
      <div className="xl:mx-auto mb-14 xl:max-w-7xl xl:px-10 mt-8">
        <div className="text-center mt-20">Loading...</div>
      </div>
    </div>
  )

  if (error) return (
    <div>
      <NavTravel />
      <div className="xl:mx-auto mb-14 xl:max-w-7xl xl:px-10 mt-8">
        <div className="text-red-500 mt-4">{error}</div>
      </div>
    </div>
  )

  if (!booking) return null

  return (
    <div>
      <NavTravel />
      <div className="xl:mx-auto mb-14 xl:max-w-7xl xl:px-10 mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Booking Details: {booking.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Flight Information</h2>
              {booking.flight_segments.map((segment, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">{segment.airline} - {segment.flight_number}</p>
                    <p className="text-sm">{segment.cabin_class}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">From</p>
                      <p className="font-medium">{segment.from_city}</p>
                      <p className="text-sm">{segment.departure_date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">To</p>
                      <p className="font-medium">{segment.to_city}</p>
                      <p className="text-sm">{segment.arrival_date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><span className="font-medium">Booking Date:</span> {booking.booking_date}</p>
                <p><span className="font-medium">Status:</span> {booking.booking_status}</p>
                <p><span className="font-medium">Type:</span> {booking.booking_type}</p>
                <p><span className="font-medium">Payment Status:</span> {booking.payment_status}</p>
                <p><span className="font-medium">Total Amount:</span> ₦{booking.total_amount}</p>
              </div>

              <h2 className="text-xl font-semibold mb-4">Passenger Information</h2>
              {booking.passengers.map((passenger, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p>
                    {passenger.title} {passenger.first_name} {passenger.last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {passenger.passenger_type} • {passenger.gender}
                  </p>
                </div>
              ))}

              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><span className="font-medium">Email:</span> {booking.contact_email}</p>
                <p><span className="font-medium">Phone:</span> {booking.contact_phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingDetails