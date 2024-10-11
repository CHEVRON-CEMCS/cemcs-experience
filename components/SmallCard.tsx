import React from 'react'
import Image from 'next/image'

// Define the type for the props
interface SmallCardProps {
  img: string;
  location: string;
  distance: string;
}

// Define the functional component with typed props
const SmallCard: React.FC<SmallCardProps> = ({ img, location, distance }) => {
  return (
    <div className='flex font-sora items-center m-2 mt-5 space-x-4 rounded-xl
    cursor-pointer hover:bg-white hover:scale-90 hover:drop-shadow-md p-4 transition transform duration-200
    ease-out'>
      <div className='relative h-24 w-24'>
        <Image src={img} layout="fill" alt='' className='rounded-lg' />
      </div>

      <div>
        <h2 className='font-bold text-2xl'>{location}</h2>
        <h3 className='text-gray-500 text-lg'>{distance}</h3>
      </div>
    </div>
  )
}

export default SmallCard;
