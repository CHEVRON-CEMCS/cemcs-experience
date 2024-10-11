import React from 'react'
import { NavTravel } from '../../components/NavTravel'
import Image from 'next/image'

const Bookings = () => {
  return (
    <div>
        <NavTravel />
        <div className="xl:mx-auto mb-14 xl:max-w-7xl xl:px-10 mt-8">
            <div className=' mt-8 pb-3'>
                <h5 className='font-Sora text-3xl text-[#162748] font-bold'>Bookings</h5>
            </div>
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
  {/* <button className="px-8 py-4 mt-6 text-sm font-medium text-center text-white rounded-xl bg-primary w-fit">
    Start Searching
  </button> */}
</div>

        </div>
    </div>
  )
}

export default Bookings