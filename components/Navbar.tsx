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


export function Navbar() {
  const total = 0; // Placeholder for cart total

  return (
    <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-black font-bold text-xl lg:text-3xl">
            CEMCS<span className="text-blue-500">Ecommerce</span>
          </h1>
        </Link>
        <NavbarLinks />
      </div>

      <div className="flex items-center">
        <div className="group p-2 flex items-center mr-2">
          <Sheet>
            <SheetTrigger>
            <ShoppingBagIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>My Cart</SheetTitle>
              </SheetHeader>
              <div className='flex h-full flex-col items-center justify-center space-y-1'>
            <div
              aria-hidden='true'
              className='relative mb-4 h-60 w-60 text-muted-foreground'>
              <Image
                src='/empty-cart.png'
                fill
                alt='empty shopping cart hippo'
              />
            </div>
            <div className='text-xl font-semibold'>
              Your cart is empty
            </div>
            <SheetTrigger asChild>
              <Link
                href='#'
                className={buttonVariants({
                  variant: 'link',
                  size: 'sm',
                  className:
                    'text-sm text-muted-foreground',
                })}>
                Add items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
            </SheetContent>
          </Sheet>
          <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
            {total}
          </span>
        </div>
      </div>
    </nav>
  );
}
