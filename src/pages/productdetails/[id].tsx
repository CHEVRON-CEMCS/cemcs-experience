import { useEffect, useState } from "react";
import { StarIcon } from "lucide-react";
import { ShoppingBagButton } from "../../../components/SubmitButton";
import Image from "next/image";
import { Navbar } from "../../../components/Navbar";
import { useRouter } from "next/router";
import axios from "axios";

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
 const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://staging.chevroncemcs.com';
  const imageUrl = product?.pro_image ? `${baseUrl}${product.pro_image}` : '/shop-cap.jpg';

 useEffect(() => {
   const fetchProductDetails = async () => {
     try {
       const response = await axios.get(`/api/Product/${id}`);
       setProduct(response.data.data);
     } catch (error) {
       console.error('Error fetching product:', error);
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
     <div className='max-w-7xl mx-auto'>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
         <Image
           width={600}
           height={600}
           src={imageUrl} // Default image if no images in product
           alt={product.product_name}
           className="object-cover w-[600px] h-[600px] rounded-xl"
         />
         <div>
           <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
             {product.product_name}
           </h1>
           <p className="text-3xl mt-2 text-gray-900">₦{product.price.toLocaleString()}</p>
           <div className="mt-3 flex items-center gap-1">
             <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
             <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
             <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
             <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
             <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
           </div>
           <div className="mt-4">
             <span className="text-sm font-medium text-gray-600">Category: </span>
             <span className="text-sm text-gray-500">{product.category}</span>
           </div>
           <div className="mt-2">
             <span className="text-sm font-medium text-gray-600">Status: </span>
             <span className="text-sm text-gray-500">{product.status}</span>
           </div>
           <div className="mt-2">
             <span className="text-sm font-medium text-gray-600">Stock: </span>
             <span className="text-sm text-gray-500">{product.stock_qty} units</span>
           </div>
           <div 
             className="text-base text-gray-700 mt-6"
             dangerouslySetInnerHTML={{ __html: product.description }}
           />
           <form>
             <ShoppingBagButton />
           </form>
         </div>
       </div>
     </div>
   </div>
 );
}