import React from 'react'
import { Navbar } from '../../components/Navbar'
import { ReservationSlider } from '../../components/ReservationSlider'
import { HotelCard } from '../../components/HotelCard'
import { NavTravel } from '../../components/NavTravel'

const Reservations = () => {
  return (
    <div>
        <NavTravel />
        <div className='max-w-7xl mx-auto'>
            <div>
                <ReservationSlider />
            </div>
          <div className='w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8 mt-8 mb-10'>
                <HotelCard />
            </div>
        </div>
    </div>
  )
}

export default Reservations