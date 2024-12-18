import Link from "next/link";
import { NavbarLinks } from "./NavbarLinks";
import { ShoppingBagIcon, ShoppingCartIcon, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCartStore } from "../store/cartStore";
import QuantityControl from "./QuantityControl";


export function Navbar() {
  const total = 0; // Placeholder for cart total
  const { items, totalItems, removeItem, increaseQuantity, decreaseQuantity } = useCartStore();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://staging.chevroncemcs.com';


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
        <div className="flex space-x-3">
         <ShoppingBagIcon />
         <span className="ml-2 text-base font-medium text-gray-700 group-hover:text-gray-800">
          {totalItems}
         </span>
        </div>
       </SheetTrigger>
       <SheetContent className="w-full sm:max-w-lg">
 <SheetHeader>
   <SheetTitle>Shopping Cart ({totalItems} items)</SheetTitle>
 </SheetHeader>

 {items.length === 0 ? (
   <div className='flex h-full flex-col items-center justify-center space-y-4'>
     <div className='relative h-48 w-48'>
       <Image
         src='/empty-cart.png'
         fill
         alt='Empty cart'
         className="object-contain"
       />
     </div>
     <div className='text-lg font-medium text-gray-900'>Your cart is empty</div>
     <Link href="/shop" className="text-sm text-blue-600 hover:text-blue-500">
       Continue Shopping
     </Link>
   </div>
 ) : (
   <div className="flex flex-col h-full">
     {/* Cart Items Section - Scrollable */}
     <div className="flex-1 overflow-y-auto py-4">
       <div className="space-y-6">
         {items.map((item) => (
           <div 
             key={item.id} 
             className="grid grid-cols-[80px,1fr,auto] gap-4 items-start"
           >
             {/* Product Image */}
             <div className="relative aspect-square rounded-lg bg-gray-100 overflow-hidden">
               <Image
                 src={item.pro_image ? `${baseUrl}${item.pro_image}` : '/shop-cap.jpg'}
                 alt={item.product_name}
                 fill
                 className="object-cover"
               />
             </div>

             {/* Product Details */}
             <div className="space-y-2">
               <h3 className="text-sm font-medium line-clamp-2">
                 {item.product_name}
               </h3>
               <div className="flex items-center space-x-2 w-fit"> {/* Added w-fit */}
                 <button 
                   onClick={() => decreaseQuantity(item.id)} 
                   className="w-8 h-8 flex items-center justify-center border rounded"
                 >
                   -
                 </button>
                 <span className="w-8 text-center">{item.quantity}</span>
                 <button 
                   onClick={() => increaseQuantity(item.id)} 
                   className="w-8 h-8 flex items-center justify-center border rounded"
                 >
                   +
                 </button>
               </div>
               <p className="text-sm font-medium text-gray-900">
                 ₦{item.price.toLocaleString()}
               </p>
             </div>

             {/* Remove Button */}
             <Button
               variant="destructive"
               size="icon"
               onClick={() => removeItem(item.id)}
               className="h-8 w-8 rounded-full"
             >
               <X className="h-4 w-4" />
             </Button>
           </div>
         ))}
       </div>
     </div>

     {/* Cart Summary - Fixed at bottom */}
     <div className="border-t border-gray-200 pt-4 mt-auto pb-8">
       <div className="space-y-3">
         <div className="flex justify-between text-base">
           <p className="text-gray-600">Subtotal</p>
           <p className="font-medium text-gray-900">
             ₦{items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
           </p>
         </div>
         <p className="text-sm text-gray-500">
           Shipping and taxes calculated at checkout
         </p>
         <div className="space-y-2">
           <Link href="/cart">
             <Button className="w-full" size="lg">
               View Cart
             </Button>
           </Link>
         </div>
       </div>
     </div>
   </div>
 )}
</SheetContent>
     </Sheet>
          <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
            {/* {total} */}
          </span>
        </div>
      </div>
    </nav>
  );
}
