import Link from "next/link";
import { Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { useCartStore } from "../store/cartStore";
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
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "../store/authStore";

interface SearchResult {
  name: string;
  product_name: string;
  price: number;
  pro_image: string;
  category: string;
}

export function EPawnNav() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.chevroncemcs.com";
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { memberDetails } = useAuthStore();

  const { items, totalItems, removeItem, increaseQuantity, decreaseQuantity } =
    useCartStore();

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
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
          const response = await axios.get(
            `/api/Product?search=${encodeURIComponent(searchQuery)}`
          );
          setResults(response.data.data);
          setShowResults(true);
        } catch (error) {
          console.error("Search error:", error);
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
            CEMCS<span className="text-blue-500"> EPawn</span>
          </h1>
        </Link>
        {/* <NavbarLinks /> */}
      </div>

      <div className="flex items-center">
        {isSubscriber && (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  {/* <AvatarImage src="https://github.com/shadcn.png" alt="profile" /> */}
                  <AvatarFallback>
                    {memberDetails?.member_name
                      ? memberDetails.member_name
                          .split(" ")
                          .map((name) => name.charAt(0))
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "NA"}
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
                  <Link href="/myepawnproducts">My Epawn products</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
}
