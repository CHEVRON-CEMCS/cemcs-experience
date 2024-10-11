import React from 'react'
import Image from 'next/image'

// Define the type for the props
interface LargeCardProps {
  img: string;
  title: string;
  description: string;
  buttonText: string;
}

// Define the functional component with typed props
const LargeCard: React.FC<LargeCardProps> = ({ img, title, description, buttonText }) => {
  return (
    <section className='relative py-16 cursor-pointer'>
      <div className='relative h-96 min-w-[300px]'>
        {/* Container for image with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent rounded-2xl z-10"></div>
        <Image src={img} layout="fill" alt='' objectFit='cover' className='rounded-2xl' />
      </div>

      <div className='absolute top-32 left-12 z-20'>
        <h3 className='text-5xl mb-3 w-64 text-white font-bold'>{title}</h3>
        <p className='text-white font-bold'>{description}</p>

        <button className='text-sm text-white bg-gray-900 px-4 py-2 rounded-lg mt-5'>
          {buttonText}
        </button>
      </div>
    </section>
  )
}

export default LargeCard;
