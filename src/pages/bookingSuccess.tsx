import { Plane, Send } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

function BookingSuccess() {

  return (
    <div>
        <div className="flex flex-col items-center justify-center h-screen font-sora">
            <Send className='w-28 h-28 text-primary' />
            <h1 className='text-2xl font-bold mt-4'>Successful</h1>
            <p className='text-sm text-[#667085]'>You have successfully booked your reservation.</p>
            <Link href={'/reservations'}><button className="px-32 xl:px-40 py-2 mt-6 text-xs font-medium text-center text-white rounded-xl bg-primary w-fit">
          Continue
        </button></Link>        
        </div>
    </div>
  )
}

export default BookingSuccess