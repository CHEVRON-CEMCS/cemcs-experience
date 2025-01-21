import React from "react";
import { ShoppingCart, Map, Bed, Shield } from "lucide-react";

const products = [
  {
    icon: <ShoppingCart className="h-8 w-8 text-blue-600" />,
    title: "E-Commerce Store",
    description: "Streamline your shopping journey exclusive offers.",
    link: "/shop",
  },
  {
    icon: <Map className="h-8 w-8 text-blue-600" />,
    title: "Travels",
    description: "Plan your trip with tailored financial solutions.",
    link: "/reservations",
  },
  {
    icon: <Bed className="h-8 w-8 text-blue-600" />,
    title: "Hotel Bookings",
    description: "Secure competitive rates for a comfortable stay.",
    link: "/hotelBooking",
  },
  {
    icon: <Shield className="h-8 w-8 text-blue-600" />,
    title: "Insurance",
    description: "Protect your business with customized solutions.",
    link: "/insurance",
  },
];

export const ServiceSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <a
              key={product.title}
              href={product.link}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{product.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
              <p className="text-gray-600">{product.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
