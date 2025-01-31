import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import {
  BiddingProductCard,
  LoadingBiddingProductCard,
} from "../../components/BiddingProductCard";
import Footer from "../../components/Footer";
import axios, { AxiosError } from "axios";
import { Toaster, toast } from "sonner";
import { useAuthStore } from "../../store/authStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface BiddingProduct {
  name: string;
  product_name: string;
  price: number;
  image: string;
  status: string;
  description: string;
  owner_name: string;
  subscriber_id: string;
  member_id: string;
}

const BiddingProducts: React.FC = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.chevroncemcs.com";
  const [products, setProducts] = useState<BiddingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscriber, setIsSubscriber] = useState(false);

  const { memberDetails } = useAuthStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/Epawn Products");

        // Process the products and handle image URLs
        const productData = response.data.data
          .map((product: BiddingProduct) => ({
            ...product,
            image: product.image
              ? product.image.startsWith("http")
                ? product.image
                : `${baseUrl}/${product.image}`
              : "/placeholder.jpg",
          }))
          .sort(
            (a: BiddingProduct, b: BiddingProduct) =>
              (Number(a.status) || 0) - (Number(b.status) || 0)
          );

        setProducts(productData);
      } catch (err) {
        const errorMessage =
          err instanceof AxiosError
            ? err.response?.data?.message || err.message
            : "An unexpected error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
        // console.error(error);
      }
    };

    checkSubscriber();
  }, [memberDetails?.membership_number]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow mt-8 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Products for Bidding
          </h1>
          <div className="flex space-x-5">
            {!isSubscriber && (
              <button
                onClick={() => (window.location.href = "/subscriber")}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Become a Subscriber
              </button>
            )}

            {isSubscriber && (
              <Link href="/epawnupload">
                <Button className="flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Add New Product
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8 mb-10">
          {loading ? (
            <>
              {[...Array(8)].map((_, index) => (
                <LoadingBiddingProductCard key={index} />
              ))}
            </>
          ) : error ? (
            <div className="col-span-full text-center text-red-500">
              Error loading products
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No products available for bidding
            </div>
          ) : (
            products.map((product) => (
              <BiddingProductCard key={product.name} product={product} />
            ))
          )}
        </div>
      </div>
      <Footer />
      <Toaster expand={true} richColors position="bottom-center" />
    </div>
  );
};

export default BiddingProducts;
