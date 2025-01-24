import { useEffect, useState } from "react";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { Navbar } from "../../../components/Navbar";
import { useRouter } from "next/router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useCartStore } from "../../../store/cartStore";
import { Toaster, toast } from "sonner";

interface ProductDetails {
  name: string;
  product_name: string;
  price: number;
  description: string;
  status: string;
  category: string;
  stock_qty: number;
  pro_image: string;
}

export default function ProductIdRoute() {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const addItem = useCartStore((state) => state.addItem);
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.chevroncemcs.com";

  const imageUrl = product?.pro_image?.startsWith("http")
    ? product.pro_image
    : product?.pro_image
      ? `${baseUrl}${product.pro_image}`
      : "/shop-cap.jpg";

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.name,
        name: product.name,
        product_name: product.product_name,
        price: product.price,
        quantity: 1,
        pro_image: product.pro_image,
      });
      toast.success(`Added ${product.product_name} to cart`);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/Product/${id}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Product Image */}
          <Image
            width={600}
            height={600}
            src={imageUrl}
            alt={product?.product_name || "Product image"}
            className="object-cover w-full h-auto max-h-[400px] md:max-h-[600px] rounded-xl"
          />

          {/* Product Details */}
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              {product.product_name}
            </h1>
            <p className="text-xl md:text-3xl mt-2 text-gray-900">
              ₦{product.price.toLocaleString()}
            </p>

            {/* Star Ratings */}
            <div className="mt-3 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className="h-4 w-4 text-yellow-500 fill-yellow-500"
                />
              ))}
            </div>

            {/* Category & Status */}
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-600">
                Category:{" "}
              </span>
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>
            <div className="mt-2">
              <span className="text-sm font-medium text-gray-600">
                Status:{" "}
              </span>
              <span className="text-sm text-gray-500">{product.status}</span>
            </div>

            {/* Product Description */}
            <div
              className="text-base text-gray-700 mt-6"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Add to Cart Button */}
            <div className="mt-6">
              <Button
                onClick={handleAddToCart}
                className="w-full py-4 sm:py-6 text-lg"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster expand={true} richColors position="bottom-center" />
    </div>
  );
}
