import React from "react";
import { Wallet, Home, Car, Briefcase } from "lucide-react";

const products = [
  {
    icon: <Wallet className="h-8 w-8 text-blue-600" />,
    title: "Loans",
    description: "Manage your daily finances with our flexible accounts.",
    // link: '#',
  },
  {
    icon: <Home className="h-8 w-8 text-blue-600" />,
    title: "Real Estate",
    description: "Find the perfect home loan for your needs.",
    // link: '#',
  },
  {
    icon: <Car className="h-8 w-8 text-blue-600" />,
    title: "Auto Loans",
    description: "Competitive rates for your next vehicle purchase.",
    // link: '#',
  },
  {
    icon: <Briefcase className="h-8 w-8 text-blue-600" />,
    title: "Fixed Deposit",
    description: "Solutions to help your business grow.",
    // link: '#',
  },
];

export const ProductsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Financial Products
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <a
              key={product.title}
              // href={product.link}
              className=" p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
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
