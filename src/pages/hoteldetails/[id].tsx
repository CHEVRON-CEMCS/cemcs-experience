import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { TbGridDots } from "react-icons/tb"
import { GiRoundStar } from "react-icons/gi"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { NavTravel } from '../../../components/NavTravel'
import { useRouter } from 'next/router'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'
import { useAuthStore } from '../../../store/authStore'
// import { LoginModal } from '../../../components/LoginModal'

interface HotelFacility {
 facility: string
 category: string
}

interface RoomType {
 room_type: string
 capacity: number
 base_price: number
}

interface HotelDetails {
 hotel_name: string
 code: string
 star_rating: string
 description: string
 address: string
 city: string
 country: string
 phone: string
 check_in_time: string
 check_out_time: string
 status: string
 facilities: HotelFacility[]
 room_types: RoomType[]
}

interface BookingData {
 hotel: string
 customer_name: string
 customer_email: string
 customer_phone: string
 check_in_date: string
 check_out_date: string
 number_of_guests: number
 room_bookings: RoomBooking[]
 special_requests: string
}

interface RoomBooking {
 room_type: string
 number_of_persons: number
 rate_per_night: number
}

const HotelDetails = () => {
  const { memberDetails } = useAuthStore();
 const [hotelData, setHotelData] = useState<HotelDetails | null>(null)
 const [loading, setLoading] = useState(true)
 const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null)
 const [showLoginModal, setShowLoginModal] = useState(false);
 const [numGuests, setNumGuests] = useState(1)
 const [showDropdown, setShowDropdown] = useState(false)
 const [formData, setFormData] = useState({
   customerName: '',
   customerEmail: '',
   customerPhone: '',
   checkInDate: '',
   checkOutDate: '',
   specialRequests: ''
 })

 const router = useRouter()
 const { id } = router.query
 const dropdownRef = useRef<HTMLDivElement | null>(null)

 useEffect(() => {
   const fetchHotelDetails = async () => {
     try {
       const response = await axios.get(`/api/Hotel/${id}`)
       setHotelData(response.data.data)
     } catch (error) {
       console.error('Error fetching hotel details:', error)
     } finally {
       setLoading(false)
     }
   }

   if (id) {
     fetchHotelDetails()
   }
 }, [id])

 const handleGuestClick = () => setShowDropdown(!showDropdown)
 const handleIncrement = () => setNumGuests(numGuests + 1)
 const handleDecrement = () => setNumGuests(numGuests > 1 ? numGuests - 1 : 1)

 useEffect(() => {
   const handleClickOutside = (event: MouseEvent) => {
     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
       setShowDropdown(false)
     }
   }
   
   document.addEventListener('mousedown', handleClickOutside)
   return () => document.removeEventListener('mousedown', handleClickOutside)
 }, [dropdownRef])

 const handleBooking = async () => {
  if (!memberDetails?.membership_number) {
    // Redirect to signin page with return URL
    router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
    return;
  }

  if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || 
      !formData.checkInDate || !formData.checkOutDate || !selectedRoom) {
    toast({
      title: "Error",
      description: "Please fill all required fields"
    });
    return;
  }

  try {
    const bookingData = {
      doctype: "Hotel Booking",
      hotel: id as string,
      guest_name: formData.customerName,
      customer_email: formData.customerEmail,
      customer_phone: formData.customerPhone,
      check_in_date: formData.checkInDate,
      check_out_date: formData.checkOutDate,
      booking_date: new Date().toISOString().split('T')[0],
      number_of_guests: numGuests,
      special_requests: formData.specialRequests,
      customer: memberDetails.membership_number,
      room_bookingss: [{
        room_type: selectedRoom.room_type,
        number_of_persons: numGuests,
        rate_per_night: selectedRoom.base_price
      }]
    };

    console.log('Request Data:', bookingData);
    const response = await axios.post('/api/hotel-booking', bookingData);
    console.log('Response:', response.data);

    toast({ title: "Success", description: "Booking confirmed!" });
    router.push('/bookingSuccess');
  } catch (error) {
    console.error('Error:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Booking failed"
    });
  }
};

// const handleLoginSuccess = () => {
//   setShowLoginModal(false);
//   handleBooking();
// };

 if (loading) return <div>Loading...</div>
 if (!hotelData) return <div>No hotel data found</div>

  return (
    <div>
      <NavTravel />
      <div className="xl:mx-auto mb-14 xl:max-w-7xl xl:px-10 mt-8"> 
        <div className="">
            <h1 className="text-2xl font-bold text-gray-800 font-sora">
                {hotelData.hotel_name}
            </h1>
            <div className="flex items-center mt-2 space-x-2">
                <span>{hotelData.star_rating} Star Hotel</span>
                <span>{hotelData.city}, {hotelData.country}</span>
          </div>
          </div> 
          <div className="mt-9">
            {/* Image player ideally */}
            <div className="flex h-[32.5rem] w-full">
              {/* Big Image */}
              <div className="relative w-full xl:w-1/2 h-full">
                <Image
                  src="/home1.jpg"
                  alt="room image"
                  className="absolute h-full w-full rounded-md rounded-tl-[10px] rounded-bl-[10px]"
                  layout="fill"
                  objectFit="cover"
                />
                <button  className="xl:hidden flex justify-center items-center absolute bottom-0 left-1/2 transform -translate-x-1/5 -translate-y-1/2 mt-7 h-[2.375rem] w-[10rem] rounded-[10px] border border-black bg-white hover:bg-[#F7F7F7] text-sm font-medium text-black">
                      <TbGridDots className="w-4 h-4 mr-2" /> 
                      Show all Photos
                    </button>
              </div>
              {/* Sub images */}
              <div className="flex xl:flex flex-col justify-between w-1/2 h-full ml-6">
                <div className="flex justify-between space-x-5">
                  <div className="relative h-[15.688rem] w-1/2 ">
                    <Image
                  src="/home2.jpg"
                  alt="room image"
                      className="absolute w-full h-full"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="relative h-[15.688rem] w-1/2 ">
                    <Image
                  src="/home3.jpg"
                  alt="room image"
                      className="absolute h-full w-full rounded-tr-[10px]"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between space-x-5">
                  <div className="relative h-[15.688rem] w-1/2">
                    <Image
                  src="/home4.jpg"
                  alt="room image"
                      className="absolute w-full h-full"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="relative h-[15.688rem] w-1/2">
                    <Image
                  src="/home5.jpg"
                  alt="room image"
                      className="absolute h-full w-full rounded-br-[10px]"
                      layout="fill"
                      objectFit="cover"
                    />
                    <button className="flex justify-center items-center absolute bottom-0 left-1/2 transform -translate-x-1/3 -translate-y-1/2 mt-7 h-[2.375rem] w-[10rem] rounded-[10px] border border-black bg-white hover:bg-[#F7F7F7] text-sm font-medium text-black">
                      <TbGridDots className="w-4 h-4 mr-2" /> 
                      Show all Photos
                    </button>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 font-sora">
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between w-full mt-4">
              <div className="w-full xl:w-2/3 ">
              <div className="w-11/12">
                  <h1 className="mb-4 text-lg font-bold text-gray-800">
                    Hotel Description
                  </h1>
                  
                  <p className="text-sm  text-justify font-normal leading-6 text-gray-600 ">
                  {hotelData?.description}
                  </p>
                  <div className="mt-6">
                  <h2 className="text-lg font-bold mb-3">Facilities</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {hotelData.facilities.map((facility) => (
                      <div key={facility.facility} className="flex items-center space-x-2">
                        <span>{facility.facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
                </div>
              </div>
              <div className="sticky top-5 mt-6 xl:mt-0 flex flex-col w-full xl:w-1/3 bg-white  rounded-md border-black drop-shadow-xl ">
                <div className="self-end p-6 border border-gray-200 rounded-lg w-full">
                {/* <div>
                  <h2 className="text-lg font-semibold mb-4">Available Rooms</h2>
                  {hotelData.room_types.map((room) => (
                    <div key={room.room_type} className="mb-4 p-4 border rounded-lg">
                      <h3 className="font-medium">{room.room_type}</h3>
                      <p className="text-primary font-semibold">₦{room.base_price.toLocaleString()} / night</p>
                    </div>
                  ))}
                </div> */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center space-x-1 text-[#031C43]">
                      {/* <h1 className="text-sm font-normal">₦ 150,000 / night</h1> */}
                    </div>
                    {/* <div className="flex items-center space-x-2">
                      <GiRoundStar className="w-4 h-4 text-primary" />
                      <h1 className="text-sm font-medium text-black">
                        5.0{" "}
                      </h1>
                      <div className="w-1 h-1 rounded-full bg-secondary"></div>
                      <h1 className="text-sm font-medium text-black text-opacity-60">
                        50 reviews
                      </h1>
                    </div> */}
                  </div>

                  {/* Guest Number Selection */}
               <div className="mt-5">
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
                         <div className="py-1" role="menu" aria-orientation="vertical">
                           <div className="flex justify-between items-center">
                             <div>
                               <h1 className="font-bold text-black ml-2">Guest No.</h1>
                             </div>
                             <div className="flex space-x-5 justify-center items-center mr-2">
                               <button
                                 className="block px-4 py-2 text-xl font-bold border rounded-full hover:border-black text-gray-700 hover:bg-gray-100"
                                 onClick={handleDecrement}
                               >
                                 -
                               </button>
                               <span className="text-black">{numGuests}</span>
                               <button
                                 className="block px-4 py-2 text-xl font-bold border hover:border-black rounded-full hover:bg-gray-100"
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
                  {/* Booking Form */}
               <div className='space-y-4 mt-5'>
                 <div>
                   <Label>Full Name</Label>
                   <Input
                     value={formData.customerName}
                     onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                     required
                   />
                 </div>

                 <div>
                   <Label>Email</Label>
                   <Input 
                     type="email"
                     value={formData.customerEmail}
                     onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                     required
                   />
                 </div>

                 <div>
                   <Label>Phone Number</Label>
                   <Input
                     type="tel" 
                     value={formData.customerPhone}
                     onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                     required
                   />
                 </div>

                 <div>
                   <Label>Check-in Date</Label>
                   <Input
                     type="date"
                     value={formData.checkInDate}
                     onChange={(e) => setFormData({...formData, checkInDate: e.target.value})}
                     required
                   />
                 </div>

                 <div>
                   <Label>Check-out Date</Label>
                   <Input 
                     type="date"
                     value={formData.checkOutDate}
                     onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})}
                     required
                   />
                 </div>

                 <div>
  <h2 className="text-lg font-semibold mb-4">Available Rooms</h2>
  {hotelData.room_types.map((room) => (
    <div 
      key={room.room_type} 
      className={`mb-4 p-4 border rounded-lg cursor-pointer ${
        selectedRoom?.room_type === room.room_type ? 'border-primary bg-primary/10' : ''
      }`}
      onClick={() => setSelectedRoom(room)}
    >
      <h3 className="font-medium">{room.room_type}</h3>
      <p className="text-primary font-semibold">
        ₦{room.base_price.toLocaleString()} / night
      </p>
      {selectedRoom?.room_type === room.room_type && (
        <span className="text-sm text-primary">Selected</span>
      )}
    </div>
  ))}
</div>

                 <div>
                   <Label>Special Requests</Label>
                   <Textarea
                     value={formData.specialRequests}
                     onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                     placeholder="Any special requests or requirements?"
                   />
                 </div>

                 <Button 
                   className='w-full'
                   onClick={handleBooking}
                   disabled={!formData.customerName || !formData.customerEmail || 
                           !formData.customerPhone || !formData.checkInDate || 
                           !formData.checkOutDate || !selectedRoom}
                 >
                   Book Now
                 </Button>
               </div>
                  
                  
                </div>
              </div>
            </div>
          </div> 
          {/* <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />      */}
      </div>
    </div>
  )
}

export default HotelDetails