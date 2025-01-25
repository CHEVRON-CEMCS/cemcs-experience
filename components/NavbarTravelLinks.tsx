"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Hamburger Menu Button for Mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden absolute top-3 right-4 z-50"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Desktop Links */}
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

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            {navbarTravelLinks.map((item) => (
              <Link
                href={item.href}
                key={item.id}
                onClick={toggleMenu}
                className={cn(
                  location === item.href
                    ? "bg-muted"
                    : "hover:bg-muted hover:bg-opacity-75",
                  "w-3/4 text-center p-4 font-medium rounded-md text-xl"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default NavbarTravelLinks;
