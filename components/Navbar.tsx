import Link from "next/link";
import { NavbarLinks } from "./NavbarLinks";
import { Search, ShoppingBagIcon, ShoppingCartIcon, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useAuthStore } from "../store/authStore";

interface SearchResult {
 name: string;
 product_name: string;
 price: number;
 pro_image: string;
 category: string;
}

export function Navbar() {
 const router = useRouter();
 const [searchQuery, setSearchQuery] = useState("");
 const [results, setResults] = useState<SearchResult[]>([]);
 const [isLoading, setIsLoading] = useState(false);
 const [showResults, setShowResults] = useState(false);
 const searchContainerRef = useRef<HTMLDivElement>(null);
 const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://staging.chevroncemcs.com';
 const [isSubscriber, setIsSubscriber] = useState(false);
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

 const { memberDetails } = useAuthStore();

 const { items, totalItems, removeItem, increaseQuantity, decreaseQuantity } = useCartStore();

 // Close search results when clicking outside
 useEffect(() => {
   function handleClickOutside(event: MouseEvent) {
     if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
       setShowResults(false);
     }
   }

   document.addEventListener("mousedown", handleClickOutside);
   return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 // Debounced search function
 useEffect(() => {
   const delayDebounceFn = setTimeout(async () => {
     if (searchQuery.trim()) {
       setIsLoading(true);
       try {
         const response = await axios.get(`/api/Product?search=${encodeURIComponent(searchQuery)}`);
         setResults(response.data.data);
         setShowResults(true);
       } catch (error) {
         console.error('Search error:', error);
       } finally {
         setIsLoading(false);
       }
     } else {
       setResults([]);
       setShowResults(false);
     }
   }, 300); // 300ms delay

   return () => clearTimeout(delayDebounceFn);
 }, [searchQuery]);

 const handleSearch = (e: React.FormEvent) => {
   e.preventDefault();
   if (searchQuery.trim()) {
     setShowResults(false);
     router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
   }
 };

 useEffect(() => {
  const checkSubscriber = async () => {
    if (!memberDetails?.membership_number) return;

    try {
      const response = await axios.get(
        `/api/Epawn Subscriber?id=${memberDetails.membership_number}`
      );
      console.log(response.data);
      setIsSubscriber(!!response.data);
    } catch (error) {
      console.error(error);
    }
  };

  checkSubscriber();
}, [memberDetails?.membership_number]);

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

     <div className="hidden md:block w-1/3 relative" ref={searchContainerRef}>
     <form onSubmit={handleSearch} className="relative">
         <Input 
           className="w-full pr-10" 
           placeholder="Search for product..." 
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           onFocus={() => searchQuery.trim() && setShowResults(true)}
         />
         {searchQuery && (
           <button
             type="button"
             onClick={() => {
               setSearchQuery('');
               setResults([]);
               setShowResults(false);
             }}
             className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
           >
             <X className="h-4 w-4" />
           </button>
         )}
         <button
           type="submit"
           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
         >
           <Search className="h-4 w-4" />
         </button>
       </form>

       {/* Search Results Dropdown */}
       {showResults && (
         <div className="absolute mt-2 w-full bg-white rounded-md shadow-lg border max-h-96 overflow-auto z-50">
           {isLoading ? (
             <div className="p-4 text-center text-gray-500">Loading...</div>
           ) : results.length === 0 ? (
             <div className="p-4 text-center text-gray-500">No products found</div>
           ) : (
             <div className="py-2">
               {results.map((product) => (
                 <Link
                   key={product.name}
                   href={`/productdetails/${product.name}`}
                   className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                   onClick={() => {
                     setShowResults(false);
                     setSearchQuery('');
                   }}
                 >
                   <div className="relative h-12 w-12 mr-3">
                     <Image
                       src={product.pro_image?.startsWith('http') 
                         ? product.pro_image 
                         : product.pro_image 
                           ? `${baseUrl}${product.pro_image}` 
                           : '/shop-cap.jpg'}
                       alt={product.product_name}
                       fill
                       className="object-cover rounded"
                     />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium text-gray-900 truncate">
                       {product.product_name}
                     </p>
                     <p className="text-sm text-gray-500">
                       ₦{product.price.toLocaleString()}
                     </p>
                   </div>
                 </Link>
               ))}
               {results.length > 0 && (
                 <div className="px-4 py-2 border-t">
                   <button
                     onClick={() => {
                       setShowResults(false);
                       router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                     }}
                     className="text-sm text-blue-600 hover:text-blue-800 w-full text-left"
                   >
                     View all results
                   </button>
                 </div>
               )}
             </div>
           )}
         </div>
       )}
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
                              src={item.pro_image?.startsWith('http') 
                                ? item.pro_image 
                                : item.pro_image 
                                  ? `${baseUrl}${item.pro_image}` 
                                  : '/shop-cap.jpg'}
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
                           <div className="flex items-center space-x-2 w-fit">
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
       </div>

      {isSubscriber && (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="profile" />
                  <AvatarFallback>
                    {memberDetails?.member_name
                      ? memberDetails.member_name
                          .split(' ')
                          .map(name => name.charAt(0))
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                      : 'NA'}
                  </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/epawnsubscriberprofile">Subscriber Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href='/myepawnproducts'>My Epawn products</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
       )}
     </div>
   </nav>
 );
}