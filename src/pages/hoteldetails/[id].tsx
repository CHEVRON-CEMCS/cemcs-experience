import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TbGridDots } from "react-icons/tb";
import { GiRoundStar } from "react-icons/gi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NavTravel } from "../../../components/NavTravel";
import { useRouter } from "next/router";
import axios from "axios";
// import { toast } from "@/hooks/use-toast";
import { Toaster, toast } from "sonner";
import { useAuthStore } from "../../../store/authStore";
import ImageModal from "../../../components/ImageModal";
// import { LoginModal } from '../../../components/LoginModal'

interface HotelFacility {
  facility: string;
  category: string;
}

interface HotelImages {
  main_image: string;
  image_2: string;
  image_3: string;
  image_4: string;
  image_5: string;
}

interface RoomType {
  room_type: string;
  capacity: number;
  base_price: number;
}

interface HotelDetails {
  name: string;
  hotel_name: string;
  main_image: string;
  image_2: string;
  image_3: string;
  image_4: string;
  image_5: string;
  star_rating: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  check_in_time: string;
  check_out_time: string;
  status: string;
  facilities: HotelFacility[];
  room_types: RoomType[];
}

interface BookingData {
  hotel: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  room_bookings: RoomBooking[];
  special_requests: string;
}

interface RoomBooking {
  room_type: string;
  number_of_persons: number;
  rate_per_night: number;
}

const HotelDetails = () => {
  const [hotelData, setHotelData] = useState<HotelDetails | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [numGuests, setNumGuests] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [checkInDateError, setCheckInDateError] = useState<string | null>(null);
  const [checkOutDateError, setCheckOutDateError] = useState<string | null>(
    null
  );
  const router = useRouter();
  const { id } = router.query;
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { memberDetails, loginUser } = useAuthStore();
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.chevroncemcs.com";

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    checkInDate: "",
    checkOutDate: "",
    specialRequests: "",
  });

  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (!id) return;

      try {
        const response = await axios.get(`/api/Hotel/${id}`);
        setHotelData(response.data.data);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  const getAllImages = (): string[] => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://staging.chevroncemcs.com";
    if (!hotelData) return [];

    return [
      hotelData.main_image ? `${baseUrl}${hotelData.main_image}` : "/home1.jpg",
      hotelData.image_2 ? `${baseUrl}${hotelData.image_2}` : "/home2.jpg",
      hotelData.image_3 ? `${baseUrl}${hotelData.image_3}` : "/home3.jpg",
      hotelData.image_4 ? `${baseUrl}${hotelData.image_4}` : "/home4.jpg",
      hotelData.image_5 ? `${baseUrl}${hotelData.image_5}` : "/home5.jpg",
    ];
  };

  const handleGuestClick = () => setShowDropdown(!showDropdown);
  const handleIncrement = () => setNumGuests(numGuests + 1);
  const handleDecrement = () => setNumGuests(numGuests > 1 ? numGuests - 1 : 1);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleBooking = async () => {
    if (!memberDetails?.membership_number) {
      // Redirect to signin page with return URL
      router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }

    if (loginUser?.userType === "erp") {
      toast.error("Not allowed");
      return;
    }

    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone ||
      !formData.checkInDate ||
      !formData.checkOutDate ||
      !selectedRoom
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const bookingData = {
        doctype: "Hotel Booking",
        hotel: id as string,
        guest_name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
        check_in_date: formData.checkInDate,
        check_out_date: formData.checkOutDate,
        booking_date: new Date().toISOString().split("T")[0],
        number_of_guests: numGuests,
        special_requests: formData.specialRequests,
        customer: memberDetails.membership_number,
        room_bookingss: [
          {
            room_type: selectedRoom.room_type,
            number_of_persons: numGuests,
            rate_per_night: selectedRoom.base_price,
          },
        ],
      };

      console.log("Request Data:", bookingData);
      const response = await axios.post("/api/hotel-booking", bookingData);
      console.log("Response:", response.data);

      toast.success("Booking confirmed");
      router.push("/bookingSuccess");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Booking failed");
    }
  };

  // const handleLoginSuccess = () => {
  //   setShowLoginModal(false);
  //   handleBooking();
  // };

  useEffect(() => {
    // Validate check-in date
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        setCheckInDateError("Check-in date cannot be in the past");
      } else if (checkIn > checkOut) {
        setCheckInDateError("Check-in date cannot be after check-out date");
        setCheckOutDateError(null);
      } else {
        setCheckInDateError(null);
      }

      // Validate check-out date
      if (checkOut < today) {
        setCheckOutDateError("Check-out date cannot be in the past");
      } else if (checkOut < checkIn) {
        setCheckOutDateError("Check-out date cannot be before check-in date");
        setCheckInDateError(null);
      } else {
        setCheckOutDateError(null);
      }
    }
  }, [formData.checkInDate, formData.checkOutDate]);

  const today = new Date().toISOString().split("T")[0];

  if (loading) return <div>Loading...</div>;
  if (!hotelData) return <div>No hotel data found</div>;

  const handleBack = () => {
    router.push("/reservations");
  };

  return (
    <div>
      <NavTravel />
      <div className="mx-auto mb-14 max-w-full px-4 md:px-6 xl:max-w-7xl xl:px-10 mt-8">
        <div className="block md:hidden mb-2">
          <Button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-black-700 py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            ← Back
          </Button>
        </div>
        <div>
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-bold text-gray-800 font-sora">
            {hotelData.hotel_name}
          </h1>
          <div className="flex flex-wrap items-center mt-2 space-x-2 text-sm sm:text-base">
            <span>{hotelData.star_rating} Star Hotel</span>
            <span>
              {hotelData.city}, {hotelData.country}
            </span>
          </div>
        </div>

        <div className="mt-6 md:mt-9">
          {/* Image Player */}
          <div className="flex flex-col md:flex-row h-auto md:h-[32.5rem] w-full">
            {/* Big Image */}
            <div className="relative w-full md:w-1/2 h-64 sm:h-96 md:h-full">
              <Image
                src={
                  hotelData.main_image
                    ? `${baseUrl}${hotelData.main_image}`
                    : "/home1.jpg"
                }
                alt={`${hotelData.hotel_name} main image`}
                className="absolute h-full w-full rounded-md md:rounded-tl-[10px] md:rounded-bl-[10px]"
                layout="fill"
                objectFit="cover"
              />
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  setIsImageModalOpen(true)
                }
                className="block md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 mt-4 px-4 py-2 bg-white border border-black rounded-lg text-sm font-medium"
              >
                <TbGridDots className="inline w-4 h-4 mr-2" />
                Show all Photos
              </button>
            </div>

            {/* Sub Images */}
            <div className="hidden md:flex flex-col justify-between w-1/2 h-full ml-6 space-y-4">
              {[
                hotelData.image_2,
                hotelData.image_3,
                hotelData.image_4,
                hotelData.image_5,
              ].map((img, index) => (
                <div
                  key={index}
                  className="relative w-full h-40 sm:h-48 md:h-[15.688rem] rounded-lg overflow-hidden"
                >
                  <Image
                    src={img ? `${baseUrl}${img}` : `/home${index + 2}.jpg`}
                    alt={`${hotelData.hotel_name} image ${index + 2}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 font-sora">
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between w-full mt-4">
            {/* Hotel Description */}
            <div className="w-full xl:w-2/3 mr-4">
              <h2 className="mb-4 text-lg font-bold text-gray-800">
                Hotel Description
              </h2>
              <p className="text-sm text-justify leading-6 text-gray-600">
                {hotelData.description}
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-bold mb-3">Facilities</h3>
                <div className="grid grid-cols-2 gap-4">
                  {hotelData.facilities.map((facility) => (
                    <div
                      key={facility.facility}
                      className="flex items-center space-x-2"
                    >
                      <span>{facility.facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Section */}
            <div className="sticky top-5 mt-6 xl:mt-0 w-full xl:w-1/3 bg-white border border-gray-200 rounded-lg p-6 drop-shadow-lg">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Book Your Stay</h3>
                <div className="mt-5">
                  <div className="flex items-center justify-center w-full border border-gray-200 rounded-md">
                    <div className="relative w-full" ref={dropdownRef}>
                      <button
                        className="text-gray-700 font-semibold py-4 px-2 xl:px-4 w-full rounded inline-flex items-center"
                        onClick={handleGuestClick}
                      >
                        <span className="mr-1">{numGuests} Guests</span>
                        <svg
                          className={`fill-current ml-48 xl:ml-40 h-4 w-4 ${showDropdown ? "transform rotate-180" : ""}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M15 7l-5 5-5-5 1-1 4 4 4-4 1 1z" />
                        </svg>
                      </button>
                      {showDropdown && (
                        <div className="absolute z-10 mt-1 w-full rounded-md py-3 bg-white drop-shadow-md">
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h1 className="font-bold text-black ml-2">
                                  Guest No.
                                </h1>
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
                <div className="space-y-4 mt-5">
                  <div>
                    <Label>Full Name</Label>{" "}
                    <span className="text-red-600">*</span>
                    <Input
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <span className="text-red-600">*</span>
                    <Input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerEmail: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label>Phone Number</Label>
                    <span className="text-red-600">*</span>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^\d+]/g, "");

                        if (value.startsWith("+234")) {
                          if (value.length > 14) return;
                        } else {
                          if (value.length > 11) return;
                        }

                        setFormData({
                          ...formData,
                          customerPhone: value,
                        });
                      }}
                      required
                    />
                  </div>

                  <div>
                    <Label>Check-in Date</Label>
                    <Input
                      type="date"
                      value={formData.checkInDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          checkInDate: e.target.value,
                        })
                      }
                      min={today}
                      className={checkInDateError ? "border-red-500" : ""}
                      required
                    />
                    {checkInDateError && (
                      <p className="text-red-500 text-sm mt-1">
                        {checkInDateError}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Check-out Date</Label>
                    <Input
                      type="date"
                      value={formData.checkOutDate}
                      min={formData.checkInDate || today}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          checkOutDate: e.target.value,
                        })
                      }
                      className={checkOutDateError ? "border-red-500" : ""}
                      required
                    />
                    {checkOutDateError && (
                      <p className="text-red-500 text-sm mt-1">
                        {checkOutDateError}
                      </p>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-4">
                      Available Rooms
                    </h2>
                    {hotelData.room_types.map((room) => (
                      <div
                        key={room.room_type}
                        className={`mb-4 p-4 border rounded-lg cursor-pointer ${
                          selectedRoom?.room_type === room.room_type
                            ? "border-primary bg-primary/10"
                            : ""
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialRequests: e.target.value,
                        })
                      }
                      placeholder="Any special requests or requirements?"
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleBooking}
                    disabled={
                      !formData.customerName ||
                      !formData.customerEmail ||
                      !formData.customerPhone ||
                      !formData.checkInDate ||
                      !formData.checkOutDate ||
                      !selectedRoom
                    }
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        <ImageModal
          images={getAllImages()}
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
        />
      </div>
      <Toaster expand={true} richColors position="bottom-center" />
    </div>
  );
};

export default HotelDetails;
