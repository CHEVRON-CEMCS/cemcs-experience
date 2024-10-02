import { StarIcon } from "lucide-react";
import { ImageSlider } from "../../components/Banner";
import { ShoppingBagButton } from "../../components/SubmitButton";
import Image from "next/image";
import { Navbar } from "../../components/Navbar";

export default function ProductIdRoute() {
  const product = {
    name: "Sample Product",
    price: 99.99,
    images: ["/path/to/image1.jpg", "/path/to/image2.jpg"],
    description: "This is a sample product description.",
  };

  return (
    <div>
        <Navbar />
        <div className='max-w-7xl mx-auto'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
        <Image
            width={600}
            height={600}
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Product image"
            className="object-cover w-[600px] h-[600px] rounded-xl"
            />
            <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {product.name}
            </h1>
            <p className="text-3xl mt-2 text-gray-900">${product.price}</p>
            <div className="mt-3 flex items-center gap-1">
                <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-base text-gray-700 mt-6">
                Experience the perfect fusion of comfort and performance with the UltraGlide Pro X. These innovative running shoes feature a responsive CloudFoam™ midsole that provides exceptional cushioning, while the breathable AirMesh upper keeps your feet cool and dry. The durable rubber outsole offers enhanced grip for optimal traction on various surfaces. Weighing just 8.5 oz (men's size 9), the UltraGlide Pro X is designed for both serious athletes and casual joggers alike.
            </p>

            <form>
                <ShoppingBagButton />
            </form>
            </div>
        </div>

        {/* <div className="mt-16">
            <FeaturedProducts />
        </div> */}
        </div>

    </div>
  );
}
