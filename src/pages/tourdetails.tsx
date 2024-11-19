import React, { useEffect, useRef, useState } from 'react'
import { Navbar } from '../../components/Navbar'
import Image from 'next/image';
import { TbGridDots } from "react-icons/tb";
import { GiRoundStar } from "react-icons/gi";
import { DatePickerWithRange } from '../../components/DatePick';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { NavTravel } from '../../components/NavTravel';

const tourdetails = () => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [numGuests, setNumGuests] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleGuestClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleIncrement = () => {
    setNumGuests(numGuests + 1);
  };

  const handleDecrement = () => {
    setNumGuests(numGuests > 1 ? numGuests - 1 : 1);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  
  


  const guests = ["1", "2", "3", "4", "5"];

  const [selectedGuests, setSelectedGuests] = useState(guests[0]);

  // const handleSelectChange = (event) => {
  //   setSelectedGuests(event.target.value);
  // };

  return (
    <div>
      <NavTravel />
      <div className="xl:mx-auto mb-14 xl:max-w-7xl xl:px-10 mt-8"> 
        <div className="">
            <h1 className="text-2xl font-bold text-gray-800 font-sora">
              Formula 1 Tour Trip
            </h1>
          </div> 
          <div className="mt-9">
  <div className="h-[32.5rem] w-full">
    <div className="relative w-full h-full">
      <Image
        src="/tourPackage1.png"
        alt="hotel image"
        className="absolute h-full w-full rounded-[10px]"
        layout="fill"
        objectFit="cover"
      />
      
    </div>
  </div>
</div>
          <div className="mt-8 font-sora">
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between w-full mt-4">
              <div className="w-full xl:w-2/3 ">
              <div className="w-11/12">
                  <h1 className="mb-4 text-lg font-bold text-gray-800">
                    Tour Description
                  </h1>
                  
                  <p className="text-sm  text-justify font-normal leading-6 text-gray-600 ">
                    About Taj Hotels Resorts and Palaces: Established in 1901, Taj Hotels Resorts and Palaces is one of Asia's largest and finest group of hotels, comprising over 119 hotels in 61 locations across India with an additional 17 international hotels in the Maldives, Malaysia, UK, USA, Bhutan, Sri Lanka, Africa and the Middle East. From world-renowned landmarks to modern business hotels, idyllic beach resorts to authentic Grand Palaces, each Taj hotel offers an unrivalled fusion of warm Indian hospitality, world-class service and modern luxury. For over a century, The Taj Mahal Palace, Mumbai, the iconic flagship has set a benchmark for fine living with exquisite refinement, inventiveness and warmth. Taj Hotels Resorts and Palaces is part of the Tata Group, India's premier business house.
                  </p>
                  
                </div>
              </div>
              <div className="sticky top-5 mt-6 xl:mt-0 flex flex-col w-full xl:w-1/3 bg-white  rounded-md border-black drop-shadow-xl ">
                <div className="self-end p-6 border border-gray-200 rounded-lg w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center space-x-1 text-[#031C43]">
                      {/* <h1 className="text-2xl font-medium ">{property.propertyRentalPrice}</h1> */}
                      <h1 className="text-sm font-normal">₦ 150,000 / night</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                      <GiRoundStar className="w-4 h-4 text-primary" />
                      <h1 className="text-sm font-medium text-black">
                        5.0{" "}
                      </h1>
                      <div className="w-1 h-1 rounded-full bg-secondary"></div>
                      <h1 className="text-sm font-medium text-black text-opacity-60">
                        50 reviews
                      </h1>
                    </div>
                  </div>
                  <div className='mt-5'>
                    <DatePickerWithRange />
                  </div>
                  <div className='mt-5'>
                    <div className="flex items-center justify-center w-full border border-gray-200 rounded-md">
                      <div className="relative w-full" ref={dropdownRef}>
                        <button
                          className="text-gray-700 font-semibold py-4 px-2 xl:px-4 w-full rounded inline-flex items-center"
                          onClick={handleGuestClick}
                        >
                          <span className="mr-1">{numGuests} Guests</span>
                          <svg
                            className={`fill-current ml-48 xl:ml-40 h-4 w-4 ${showDropdown ? 'transform rotate-180' : ''}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M15 7l-5 5-5-5 1-1 4 4 4-4 1 1z" />
                          </svg>
                        </button>
                        {showDropdown && (
                          <div className="absolute z-10 mt-1 w-full rounded-md py-3 bg-white drop-shadow-md">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h1 className="font-bold text-black ml-2">Guest No.</h1>
                                </div>
                                <div className="flex space-x-5 justify-center items-center mr-2">
                                  <button
                                    className="block px-4 py-2 text-xl font-bold border rounded-full hover:border-black text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    role="menuitem"
                                    onClick={handleDecrement}
                                  >
                                    -
                                  </button>
                                  <span className="text-black">{numGuests}</span>
                                  <button
                                    className="block px-4 py-2 text-xl font-bold text-gray-700 border hover:border-black rounded-full hover:bg-gray-100 hover:text-gray-900"
                                    role="menuitem"
                                    onClick={handleIncrement}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                  <div>
                    <div className='mt-5 mb-2'>
                      <Label>First and Last Name</Label>
                    </div>
                    <div>
                      <Input />
                    </div>
                    <Button className='mt-5 w-full'>Book</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>      
      </div>
    </div>
  )
}

export default tourdetails