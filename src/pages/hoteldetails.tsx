// import Image from "next/image";
// import React, { useState, useRef, useEffect } from "react";
// import { BiChevronDown } from "react-icons/bi";
// import { FaBath, FaSpotify } from "react-icons/fa";
// import { FiHeart, FiMapPin, FiShare2, FiUser } from "react-icons/fi";
// import { FcLike } from "react-icons/fc";
// import { GiRoundStar } from "react-icons/gi";
// import { IoIosBed } from "react-icons/io";
// import { MdOutlineWaterDrop, MdSupervisorAccount } from "react-icons/md";

// import roomImage from "../../public/checkout-thank-you.jpg";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { DateRange, RangeKeyDict } from 'react-date-range';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';
// import Head from "next/head";
// import Link from "next/link";
// import { AiFillCheckCircle, AiOutlineMail, AiOutlinePhone, AiOutlineWhatsApp } from "react-icons/ai";
// import { IoBulbOutline } from 'react-icons/io5'
// import { HiOutlineSparkles } from 'react-icons/hi'
// import { BsHeadset, BsHouseDoor } from "react-icons/bs";
// import { RiGasStationFill } from "react-icons/ri";
// import { GiNuclearWaste, GiUmbrella } from "react-icons/gi";
// import { SlScreenDesktop } from 'react-icons/sl'
// import { addDays, format } from "date-fns";
// import { Navbar } from "../../components/Navbar";

// // Define types for the range selection
// interface Range {
//   startDate: Date;
//   endDate: Date;
//   key: string;
// }

// export default function Hoteldetails() {
//   const [hasBeenLiked, setHasBeenLiked] = useState<boolean>(false);
//   const [startDate, setStartDate] = useState<Date>(new Date());
//   const [endDate, setEndDate] = useState<Date>(new Date());
//   const [numGuests, setNumGuests] = useState<number>(1);
//   const [showDropdown, setShowDropdown] = useState<boolean>(false);
//   const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for the dropdown
//   const [openDateRange, setOpenDateRange] = useState<boolean>(false);

//   const selectionRange: Range = {
//     startDate: startDate,
//     endDate: endDate,
//     key: 'selection',
//   };

//   const handleGuestClick = (): void => {
//     setShowDropdown(!showDropdown);
//   };

//   const handleIncrement = (): void => {
//     setNumGuests((prevGuests) => prevGuests + 1);
//   };

//   const handleDecrement = (): void => {
//     setNumGuests((prevGuests) => (prevGuests > 1 ? prevGuests - 1 : 1));
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleSelect = (ranges: RangeKeyDict): void => {
//     const selectedStartDate = ranges.selection.startDate ?? startDate;
//     const selectedEndDate = ranges.selection.endDate ?? endDate;

//     setStartDate(selectedStartDate);
//     setEndDate(selectedEndDate);
//   };

//   return (
//     <div className="font-sora">
//       <div className="h-[6rem] w-full">
//         <Navbar />
//       </div>
//       <section className="xl:mx-auto mb-14 xl:max-w-full xl:px-10">
//         <div className="">
//           <h1 className="text-2xl font-bold text-gray-800">Property Name</h1>
//         </div>

//         <div className="flex flex-col xl:space-y-0 space-y-3 xl:flex-row xl:justify-between mt-2">
//           <div className="flex flex-col xl:flex-row space-y-3 xl:space-y-0 xl:self-end xl:space-x-2">
//             <div className="flex items-center space-x-1">
//               <FiMapPin className="hidden xl:block w-4 h-4 text-primary" />
//               <h1 className="text-sm font-normal text-secondary">Street</h1>
//             </div>
//             <div className="flex items-center space-x-1">
//               <FiUser className="hidden xl:block w-4 h-4 text-primary" />
//               <h1 className="text-sm font-normal text-secondary">Host Name</h1>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <button className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg">
//               <FiShare2 className="w-3 h-3 text-gray-900" />
//               <h1 className="text-sm font-normal">Share</h1>
//             </button>
//             <button
//               onClick={() => setHasBeenLiked(!hasBeenLiked)}
//               className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg"
//             >
//               {hasBeenLiked ? (
//                 <FcLike className="w-3 h-3 text-gray-900" />
//               ) : (
//                 <FiHeart className="w-3 h-3 text-gray-900" />
//               )}
//               <h1 className="text-sm font-normal">Like</h1>
//             </button>
//           </div>
//         </div>

//         <div className="mt-9">
//           <div className="flex h-[32.5rem] w-full">
//             <div className="relative w-full xl:w-1/2 h-full">
//               <Image
//                 src={roomImage}
//                 alt="room image"
//                 className="absolute h-full w-full rounded-md rounded-tl-[10px] rounded-bl-[10px]"
//                 layout="fill"
//                 objectFit="cover"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Property info and booking details */}
//         <div className="mt-8 font-sora">
//           <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between w-full mt-4">
//             <div className="w-full xl:w-2/3 ">
//               <div className="w-11/12">
//                 <h1 className="mb-4 text-lg font-bold text-gray-800">Property Description</h1>
//                 <p className="text-sm text-justify font-normal leading-6 text-gray-600 ">
//                   Property description goes here.
//                 </p>
//               </div>

//               <div className="mt-8 mr-5">
//                 <h1 className="mb-4 text-lg font-bold text-gray-800">Property Details</h1>
//                 <div className="flex flex-wrap xl:flex-nowrap justify-between gap-5 text-sm font-normal text-secondary">
//                   <div className="flex w-[6.875rem] flex-col space-y-3 rounded-lg border-gray-200 p-3">
//                     <MdSupervisorAccount className="w-4 h-4 text-primary" />
//                     <h1>Guests</h1>
//                   </div>

//                   <div className="flex w-[6.875rem] flex-col space-y-3 rounded-lg border-gray-200 p-3">
//                     <IoIosBed className="w-4 h-4 text-primary" />
//                     <h1>Bedrooms</h1>
//                   </div>

//                   <div className="flex w-[6.875rem] flex-col space-y-3 rounded-lg border-gray-200 p-3">
//                     <FaBath className="w-4 h-4 text-primary" />
//                     <h1>Bathrooms</h1>
//                   </div>

//                   <div className="flex w-[6.875rem] flex-col space-y-3 rounded-lg border-gray-200 p-3">
//                     <FaSpotify className="w-4 h-4 text-primary" />
//                     <h1>Guests</h1>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-5 border-b pb-7">
//                 <h1 className="text-lg font-bold text-gray-800">All bills inclusive</h1>
//                 <div className="grid xl:grid-cols-2 gap-4 xl:gap-2 mt-3">
//                   <div className="flex items-center space-x-4 max-w-[80%]">
//                     <IoBulbOutline className="w-5 h-5 text-primary" /> <h1 className="text-sm">Power Supply</h1>
//                   </div>
//                   <div className="flex items-center space-x-4 max-w-[80%]">
//                     <HiOutlineSparkles className="w-5 h-5 text-primary" /> <h1 className="text-sm">Cleaning</h1>
//                   </div>
//                   <div className="flex items-center space-x-4 max-w-[80%]">
//                     <MdOutlineWaterDrop className="w-5 h-5 text-primary" /> <h1 className="text-sm">Water Supply</h1>
//                   </div>

//                   <div className="flex items-center space-x-4 max-w-[80%]">
//                     <BsHeadset className="w-5 h-5 text-primary" /> <h1 className="text-sm">24-hours Support</h1>
//                   </div>
//                   <div className="flex items-center space-x-4 max-w-[80%]">
//                     <RiGasStationFill className="w-5 h-5 text-primary" />
//                     <h1 className="text-sm">Gas Supply</h1>
//                   </div>
//                   <div className="flex items-center space-x-4 max-w-[80%]">
//                     <GiNuclearWaste className="w-5 h-5 text-primary" /> <h1 className="text-sm">Waste management</h1>
//                   </div>

//                   <div className="flex items-center space-x-4 max-w-[80%]">
//                     <BsHouseDoor className="w-5 h-5 text-primary" /> <h1 className="text-sm">Estate dues</h1>
//                   </div>
//                   <div className="flex items-center space-x-4 max-w-[80%]">
//                     <GiUmbrella className="w-5 h-5 text-primary" /> <h1 className="text-sm">Amenities</h1>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-5 border-b pb-7">
//                 <h1 className="text-lg font-bold text-gray-800">Booking Details</h1>

//                 <div className="text-sm font-normal text-secondary text-opacity-40">
//                   <div className="flex items-center justify-between relative">
//                     <div>
//                       <p className="font-bold text-gray-800 text-xs mb-1">Check In</p>
//                       <div
//                         className="flex w-full xl:w-[8.384rem] items-center justify-between rounded-lg border border-gray-800 py-3 px-4"
//                         onClick={() => setOpenDateRange(!openDateRange)}
//                       >
//                         <input
//                           value={format(new Date(startDate), "MM/dd/yyyy")}
//                           placeholder="Check-in"
//                           className="touch-manipulation w-full outline-none bg-transparent text-gray-800"
//                         />
//                         <BiChevronDown className="w-4 h-5 text-black" />
//                       </div>
//                     </div>

//                     <div>
//                       <p className="font-bold text-xs mb-1 text-gray-800 ml-2 xl:ml-0">Check Out</p>
//                       <div
//                         className="flex w-full xl:w-[8.384rem] items-center justify-between rounded-lg ml-2 xl:ml-0 border border-gray-800 py-3 px-4"
//                         onClick={() => setOpenDateRange(!openDateRange)}
//                       >
//                         <input
//                           value={format(new Date(endDate), "MM/dd/yyyy")}
//                           placeholder="Check-out"
//                           className="touch-manipulation w-full outline-none bg-transparent text-gray-800"
//                         />
//                         <BiChevronDown className="w-4 h-5 text-black" />
//                       </div>
//                     </div>

//                     {openDateRange && (
//                       <DateRange
//                         editableDateInputs={true}
//                         ranges={[selectionRange]}
//                         onChange={handleSelect}
//                         moveRangeOnFirstSelection={false}
//                         minDate={addDays(new Date(), 1)}
//                         className="absolute top-14 border z-30 bg-white shadow-lg"
//                         rangeColors={["#DB5461"]}
//                       />
//                     )}
//                   </div>
//                   <p className="mt-3 font-bold text-xs text-gray-800 mb-1">Number of Guests</p>

//                   <div className="flex items-center justify-center w-full border border-gray-800 rounded-md">
//                     <div className="relative" ref={dropdownRef}>
//                       <button
//                         className="text-gray-700 font-semibold py-4 px-2 xl:px-4 w-full rounded inline-flex items-center"
//                         onClick={handleGuestClick}
//                       >
//                         <span className="mr-1">{numGuests} Guests</span>
//                         <BiChevronDown
//                           className={`fill-current ml-48 xl:ml-40 h-4 w-4 ${
//                             showDropdown ? "transform rotate-180" : ""
//                           }`}
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 20 20"
//                         >
//                           <path d="M15 7l-5 5-5-5 1-1 4 4 4-4 1 1z" />
//                         </BiChevronDown>
//                       </button>
//                       {showDropdown && (
//                         <div className="absolute z-10 mt-1 w-full rounded-md py-3 bg-gray-100 drop-shadow-md">
//                           <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
//                             <div className="flex justify-between items-center">
//                               <div>
//                                 <h1 className="font-bold text-black ml-2">Guest No.</h1>
//                               </div>
//                               <div className="flex space-x-5 justify-center items-center mr-2">
//                                 <button
//                                   className="block px-4 py-2 text-xl font-bold border rounded-full hover:border-black text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                                   role="menuitem"
//                                   onClick={handleDecrement}
//                                 >
//                                   -
//                                 </button>
//                                 <span className="text-black">{numGuests}</span>
//                                 <button
//                                   className="block px-4 py-2 text-xl font-bold text-gray-700 border hover:border-black rounded-full hover:bg-gray-100 hover:text-gray-900"
//                                   role="menuitem"
//                                   onClick={handleIncrement}
//                                 >
//                                   +
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//       </section>
//     </div>
//   );
// };

import React from 'react'

const hoteldetails = () => {
  return (
    <div>hoteldetails</div>
  )
}

export default hoteldetails