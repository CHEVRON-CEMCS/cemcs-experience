import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import Footer from '../../components/Footer';

const Cart = () => {
  // Mock data for demonstration
  const items = [
    {
      id: '1',
      name: 'Example Product',
      price: 1000,
      category: 'Electronics',
      image: '/empty-cart.png'
    }
  ];

  const formatPrice = (price: any) => `₦${(price / 100).toFixed(2)}`;

  return (
    <div className=''>
        <Navbar />
        <div className="bg-white max-w-7xl mx-auto">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
            </h1>

            <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <div className="lg:col-span-7">
                <h2 className="sr-only">Items in your shopping cart</h2>

                <ul className="divide-y divide-gray-200 border-b border-t border-gray-200">
                {items.map((item) => (
                    <li key={item.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                        <div className="relative h-24 w-24">
                        <Image
                            fill
                            src={item.image}
                            alt="product image"
                            className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                        />
                        </div>
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                            <div className="flex justify-between">
                            <h3 className="text-sm">
                                <Link
                                href={`/product/${item.id}`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                                >
                                {item.name}
                                </Link>
                            </h3>
                            </div>

                            <div className="mt-1 flex text-sm">
                            <p className="text-muted-foreground">
                                Category: {item.category}
                            </p>
                            </div>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatPrice(item.price)}
                            </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                            <div className="absolute right-0 top-0">
                            <Button
                                aria-label="remove product"
                                variant="ghost"
                            >
                                <X className="h-5 w-5" aria-hidden="true" />
                            </Button>
                            </div>
                        </div>
                        </div>

                        <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                        <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Eligible for instant delivery</span>
                        </p>
                    </div>
                    </li>
                ))}
                </ul>
            </div>

            <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                <h2 className="text-lg font-medium text-gray-900">
                Order summary
                </h2>

                <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-sm font-medium text-gray-900">
                    {formatPrice(1000)}
                    </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                    <span>Flat Transaction Fee</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                    {formatPrice(100)}
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">
                    Order Total
                    </div>
                    <div className="text-base font-medium text-gray-900">
                    {formatPrice(1100)}
                    </div>
                </div>
                </div>

                <div className="mt-6">
                <Link href="/thankyou">
                    <Button className="w-full bg-blue-500" size="lg">
                        Checkout
                    </Button>
                </Link>
                </div>
            </section>
            </div>
        </div>
        </div>
        <Footer />
    </div>
  );
};

export default Cart;