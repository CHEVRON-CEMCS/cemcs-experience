import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface HotelBooking {
  name: string;
  hotel_name: string;
  logo: string;
}

export function HotelCard({ booking }: { booking: HotelBooking }) {
  const [hotelLogo, setHotelLogo] = useState("");

  useEffect(() => {
    const fetchHotelImage = async () => {
      try {
        const response = await axios.get(`/api/Hotel/${booking.name}`);
        setHotelLogo(response.data.data.logo);
      } catch (err) {
        console.log(err);
      }
    };

    fetchHotelImage();
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || `https://staging.chevroncemcs.com$`;
  const imageUrl = hotelLogo ? `${baseUrl}${hotelLogo}` : "/hotelimage.jpg";

  return (
    <div className="rounded-lg">
      <div className="relative h-[250px]">
        <Image
          src={imageUrl}
          alt="Hotel Image"
          fill
          className="object-cover object-center w-full h-full rounded-lg"
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <h1 className="font-bold text-xl uppercase">{booking.hotel_name}</h1>
        {/* <h3 className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary ring-1 ring-inset ring-primary/10">
          NGN100
        </h3> */}
      </div>
      {/* <p className="text-gray-600 text-sm mt-2 line-clamp-2">
        This is a brief product description.
      </p> */}

      <Button asChild className="w-full mt-5">
        <Link href={`/hoteldetails/${booking.name}`}>View Details</Link>
      </Button>
    </div>
  );
}

export function LoadingHotelCard() {
  return (
    <div className="flex flex-col">
      <Skeleton className="w-full h-[330px]" />
      <div className="flex flex-col mt-2 gap-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="w-full h-6" />
      </div>
      <Skeleton className="w-full h-10 mt-5" />
    </div>
  );
}
