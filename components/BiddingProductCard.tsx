import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuthStore } from "../store/authStore";

interface BiddingProduct {
  name: string;
  product_name: string;
  member_id: string;
  price: number;
  image: string;
  status: string;
  description: string;
  subscriber_id: string;
  owner_name: string;
}

interface BiddingProductCardProps {
  product: BiddingProduct;
}

export function BiddingProductCard({ product }: BiddingProductCardProps) {
  const router = useRouter();
  const { memberDetails } = useAuthStore();
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.chevroncemcs.com";

  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : product.image
      ? `${baseUrl}/${product.image}` // Add the forward slash here
      : "/placeholder.jpg";

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "0":
        return "bg-yellow-100 text-yellow-800 ring-yellow-600/20";
      case "1":
        return "bg-green-100 text-green-800 ring-green-600/20";
      case "2":
        return "bg-red-100 text-red-800 ring-red-600/20";
      default:
        return "bg-gray-100 text-gray-800 ring-gray-600/20";
    }
  };

  const getStatusText = (status: string) => {
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

  console.log(product);

  return (
    <div className="rounded-lg group cursor-pointer flex flex-col h-full w-full sm:max-w-xs md:max-w-sm lg:max-w-md border border-gray-200 p-4">
      <div
        onClick={() => router.push(`/biddingproductdetails/${product.name}`)}
        className="space-y-2 flex-1 flex flex-col"
      >
        <div className="relative w-full aspect-square">
          <Image
            src={imageUrl}
            alt={product.product_name}
            fill
            className="object-cover object-center rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between pt-4">
          <div>
            <h1 className="font-semibold text-base sm:text-lg md:text-xl line-clamp-2">
              {product.product_name}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Posted by: {product.subscriber_id}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Starting Price:</span>
              <span className="font-bold text-primary">
                ₦{product.price?.toLocaleString()}
              </span>
            </div>

            <div
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusBadgeColor(product.status)} ring-1 ring-inset`}
            >
              {getStatusText(product.status)}
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={() => router.push(`/biddingproductdetails/${product.name}`)}
        className="w-full mt-4 text-xs sm:text-base"
        variant={product.status === "0" ? "default" : "secondary"}
        disabled={product.status !== "0"}
      >
        {product.status === "0" &&
        memberDetails?.membership_number !== product.member_id
          ? "Place Bid"
          : "View Details"}
      </Button>
    </div>
  );
}

export function LoadingBiddingProductCard() {
  return (
    <div className="flex flex-col h-full w-full sm:max-w-xs md:max-w-sm lg:max-w-md border border-gray-200 p-4">
      <Skeleton className="w-full aspect-square" />
      <div className="flex flex-col mt-4 gap-y-2 flex-1">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
      <Skeleton className="w-full h-10 mt-4" />
    </div>
  );
}
