import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useRouter } from "next/router";
import { Product } from "../types/product";
import { useCartStore } from "../store/cartStore";
import { Toaster, toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.chevroncemcs.com";

  // Check if the pro_image is a complete URL or a relative path
  const imageUrl = product.pro_image?.startsWith("http")
    ? product.pro_image
    : product.pro_image
      ? `${baseUrl}${product.pro_image}`
      : "/shop-cap.jpg";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.name,
      name: product.name,
      product_name: product.product_name,
      price: product.price,
      quantity: 1,
      pro_image: product.pro_image,
    });
    toast.success(`Added ${product.product_name} to cart`);
  };

  return (
    <div className="rounded-lg group cursor-pointer flex flex-col h-full w-full sm:max-w-xs md:max-w-sm lg:max-w-md">
      <div
        onClick={() => router.push(`/productdetails/${product.name}`)}
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

        <div className="flex-1 flex flex-col justify-between p-2">
          <h1 className="font-semibold text-base sm:text-lg md:text-xl line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem]">
            {product.product_name}
          </h1>

          <div className="flex mt-2">
            <h3 className="w-fit rounded-md bg-primary/10 px-2 py-1 text-sm sm:text-base font-bold text-primary ring-1 ring-inset ring-primary/10">
              ₦{product.price?.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      <Button
        onClick={handleAddToCart}
        className="w-full mt-2 sm:mt-4 text-xs sm:text-base"
      >
        Add to Cart
      </Button>
      <Toaster expand={true} richColors position="bottom-center" />
    </div>
  );
}

export function LoadingProductCard() {
  return (
    <div className="flex flex-col h-full w-full sm:max-w-xs md:max-w-sm lg:max-w-md">
      <Skeleton className="w-full aspect-square" />
      <div className="flex flex-col mt-2 gap-y-2 flex-1 p-2">
        <Skeleton className="h-10 sm:h-14 w-full" />
        <Skeleton className="w-20 sm:w-28 h-6 sm:h-8" />
      </div>
      <Skeleton className="w-full h-8 sm:h-10 mt-2 sm:mt-4" />
    </div>
  );
}
