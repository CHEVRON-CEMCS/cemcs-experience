import Link from "next/link";
import { NavbarLinks } from "./NavbarLinks";
import { ShoppingBagIcon, ShoppingCartIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";


export function NavTravel() {

  return (
    <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-black font-bold text-xl lg:text-3xl">
            CEMCS<span className="text-blue-500">Travels</span>
          </h1>
        </Link>
        <NavbarLinks />
      </div>

      
    </nav>
  );
}
