import React, { useEffect, useState } from "react";
import { NavTravel } from "../../components/NavTravel";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "../../store/authStore";

interface Booking {
  name: string;
}

interface FlightRes {
  name: string;
  customer: string;
}

type BookingType = "flight" | "tour" | "hotel";

const CombinedBookings = () => {
  const { memberDetails } = useAuthStore();
  const [activeTab, setActiveTab] = useState<BookingType>("flight");
  const [flightBookings, setFlightBookings] = useState<Booking[]>([]);
  const [tourBookings, setTourBookings] = useState<Booking[]>([]);
  const [hotelBookings, setHotelBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState({
    flight: true,
    tour: true,
    hotel: true,
  });
  const [error, setError] = useState({ flight: null, tour: null, hotel: null });

  const bookingConfigs = {
    flight: {
      title: "Flight Bookings",
      apiEndpoint: "/api/Flight Booking",
      linkPrefix: "/bookings",
      imageSrc: "/flightbook.jpg",
      setState: setFlightBookings,
      data: flightBookings,
    },
    tour: {
      title: "Tour Bookings",
      apiEndpoint: "/api/Tour Booking",
      linkPrefix: "/tourbooking",
      imageSrc: "/tourbook.jpg",
      setState: setTourBookings,
      data: tourBookings,
    },
    hotel: {
      title: "Hotel Bookings",
      apiEndpoint: "api/Hotel Booking",
      linkPrefix: "/hotelbooking",
      imageSrc: "/tourbook.jpg",
      setState: setHotelBookings,
      data: hotelBookings,
    },
  };

  const fetchBookings = async (type: BookingType) => {
    if (!memberDetails?.membership_number) {
      setError((prev) => ({
        ...prev,
        [type]: "Please login to view your bookings",
      }));
      setLoading((prev) => ({ ...prev, [type]: false }));
      return;
    }

    try {
      const response = await axios.get(`${bookingConfigs[type].apiEndpoint}`, {
        params: {
          customer: memberDetails.membership_number,
        },
      });
      if (Array.isArray(response.data.data)) {
        const filteredData = response.data.data.filter(
          (item: FlightRes) => item.customer === memberDetails.membership_number
        );
        console.log(`${type} filtered data:`, filteredData);

        bookingConfigs[type].setState(filteredData);
      }
      // console.log(`${type} API Response:`, response.data);

      setError((prev) => ({ ...prev, [type]: null }));
    } catch (err) {
      console.error(`${type} API Error:`, err);
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : "An unexpected error occurred";
      setError((prev) => ({ ...prev, [type]: errorMessage }));
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    fetchBookings("flight");
    fetchBookings("tour");
    fetchBookings("hotel");
  }, [memberDetails?.membership_number]);

  const renderBookings = (type: BookingType) => {
    if (loading[type]) {
      return (
        <div className="text-center mt-10 text-sm sm:text-base">Loading...</div>
      );
    }

    if (error[type]) {
      return (
        <div className="text-red-500 mt-4 text-sm sm:text-base">
          {error[type]}
        </div>
      );
    }

    const bookings = bookingConfigs[type].data;

    if (bookings.length === 0) {
      return (
        <div className="text-center mt-20 space-y-4 sm:space-y-2 pb-20">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center">
            <Image
              src="/empty-cart.png"
              alt="Empty cart"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h5 className="font-Sora text-sm sm:text-1xl text-gray-900">
            No {type} bookings yet!
          </h5>
          <p className="text-xs sm:text-sm text-gray-600 font-normal">
            Time to dust off your bags and start planning your next adventure.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {bookings.map((booking) => (
          <Link
            href={`${bookingConfigs[type].linkPrefix}/${booking.name}`}
            key={booking.name}
          >
            <div className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="relative h-[200px] sm:h-[250px] mb-4">
                <Image
                  src={bookingConfigs[type].imageSrc}
                  alt={`${type} booking image`}
                  fill
                  className="object-cover object-center rounded-lg"
                />
              </div>
              <p className="font-medium text-center text-sm sm:text-base">
                Booking Reference: {booking.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div>
      <NavTravel />
      <div className="px-4 sm:px-6 xl:mx-auto mb-14 xl:max-w-7xl xl:px-10 mt-8">
        <div className="mt-4 sm:mt-8 pb-3">
          <h5 className="font-Sora text-xl sm:text-3xl text-[#162748] font-bold">
            My Booking History
          </h5>
        </div>

        <Tabs
          defaultValue="flight"
          className="mt-4 sm:mt-6"
          onValueChange={(value) => setActiveTab(value as BookingType)}
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="flight" className="text-sm sm:text-base">
              Flight Bookings
            </TabsTrigger>
            <TabsTrigger value="tour" className="text-sm sm:text-base">
              Tour Bookings
            </TabsTrigger>
            <TabsTrigger value="hotel" className="text-sm sm:text-base">
              Hotel Bookings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="flight" className="mt-4 sm:mt-6">
            {renderBookings("flight")}
          </TabsContent>
          <TabsContent value="tour" className="mt-4 sm:mt-6">
            {renderBookings("tour")}
          </TabsContent>
          <TabsContent value="hotel" className="mt-4 sm:mt-6">
            {renderBookings("hotel")}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CombinedBookings;
