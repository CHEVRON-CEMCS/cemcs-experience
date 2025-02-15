"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const navbarTravelLinks = [
  {
    id: 0,
    name: "Home",
    href: "/reservations",
  },
  {
    id: 1,
    name: "Booking History",
    href: "/bookings",
  },
  {
    id: 2,
    name: "Book Flight",
    href: "/travel",
  },
  {
    id: 3,
    name: "Tour Packages",
    href: "/tourPackage",
  },
  {
    id: 4,
    name: "Book Hotel",
    href: "/hotelBooking",
  },
];

export function NavbarTravelLinks() {
  const location = usePathname();
  return (
    <div className="hidden md:flex justify-center items-center gap-x-2 ml-8">
      {navbarTravelLinks.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={cn(
            location === item.href
              ? "bg-muted"
              : "hover:bg-muted hover:bg-opacity-75",
            "group p-2 font-medium rounded-md"
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
