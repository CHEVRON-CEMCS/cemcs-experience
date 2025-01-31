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

const MyEpawnProducts: React.FC = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.chevroncemcs.com";
  const [products, setProducts] = useState<BiddingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { memberDetails } = useAuthStore();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!memberDetails?.membership_number) return;

      try {
        const response = await axios.get("/api/Epawn Products");

        console.log(
          "Current user membership number:",
          memberDetails.membership_number
        );
        console.log("All products:", response.data.data);

        // Log each product's member_id for comparison
        response.data.data.forEach((product: BiddingProduct) => {
          console.log("Product:", {
            name: product.product_name,
            member_id: product.member_id,
            matches: product.member_id === memberDetails.membership_number,
          });
        });

        const userProducts = response.data.data.filter(
          (product: BiddingProduct) => {
            const matches =
              product.subscriber_id ===
              `SUB-${memberDetails.membership_number}`;
            console.log(
              `Comparing: product ${product.member_id} with user ${memberDetails.membership_number} = ${matches}`
            );
            return matches;
          }
        );

        // Log filtered products
        console.log("Filtered products:", userProducts);

        const productData = userProducts.map((product: BiddingProduct) => ({
          ...product,
          image: product.image
            ? product.image.startsWith("http")
              ? product.image
              : `${baseUrl}/${product.image}`
            : "/placeholder.jpg",
        }));

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
  }, [memberDetails?.membership_number]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "0":
        return "Open for Bidding";
      case "1":
        return "Bid Accepted";
      case "2":
        return "Closed";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow mt-8 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">My Products</h1>
          <Link href="/epawnupload">
            <Button className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Add New Product
            </Button>
          </Link>
        </div>

        <div className="w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8 mb-10">
          {loading ? (
            <>
              {[...Array(4)].map((_, index) => (
                <LoadingBiddingProductCard key={index} />
              ))}
            </>
          ) : error ? (
            <div className="col-span-full text-center text-red-500">
              Error loading products: {error}
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 mb-4">
                You haven't uploaded any products yet
              </p>
              <Link href="/epawnupload">
                <Button>Upload Your First Product</Button>
              </Link>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.name} className="relative">
                <BiddingProductCard product={product} />
                {/* <div className="absolute top-2 right-2">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${product.status === "0" ? "bg-green-100 text-green-800" :
                      product.status === "1" ? "bg-blue-100 text-blue-800" :
                      "bg-red-100 text-red-800"}
                  `}>
                    {getStatusLabel(product.status)}
                  </span>
                </div> */}
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
      <Toaster expand={true} richColors position="bottom-center" />
    </div>
  );
};

export default MyEpawnProducts;
