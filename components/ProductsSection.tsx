import React from "react";
import { Wallet, Home, Car, Briefcase, LucideIcon } from "lucide-react";

interface Product {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  comingSoon?: boolean;
}

const products: Product[] = [
  {
    icon: <Wallet className="h-8 w-8 text-blue-600" />,
    title: "Loans",
    description: "Manage your daily finances with our flexible accounts.",
    link: "https://member.chevroncemcs.com/app/member-loan-application",
  },
  {
    icon: <Home className="h-8 w-8 text-blue-600" />,
    title: "Real Estate",
    description: "Find the perfect home loan for your needs.",
    link: "https://member.chevroncemcs.com/app/expression-of-interest",
  },
  {
    icon: <Car className="h-8 w-8 text-blue-600" />,
    title: "Auto Loans",
    description: "Competitive rates for your next vehicle purchase.",
    link: "#",
    comingSoon: true,
  },
  {
    icon: <Briefcase className="h-8 w-8 text-blue-600" />,
    title: "Fixed Deposit",
    description: "Solutions to help your business grow.",
    link: "https://member.chevroncemcs.com/app/fixed-deposit/view/list",
  },
];

const ProductsSection: React.FC = () => {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    product: Product
  ): void => {
    if (product.comingSoon) {
      e.preventDefault();
      alert("This feature is coming soon!");
      return;
    }

    if (!product.link || product.link === "#") {
      e.preventDefault();
      return;
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Financial Products
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const isExternal = product.link && product.link.startsWith("http");
            return (
              <a
                key={product.title}
                href={product.link}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={`p-6 rounded-xl shadow-sm transition-shadow duration-200 block
                  ${product.comingSoon ? "cursor-default" : "hover:shadow-md cursor-pointer"}`}
                onClick={(e) => handleClick(e, product)}
                role="button"
                aria-disabled={product.comingSoon}
              >
                <div className="mb-4">{product.icon}</div>
                <h3 className="text-xl font-semibold mb-2">
                  {product.title}
                  {product.comingSoon && (
                    <span className="ml-2 text-sm text-gray-500">
                      (Coming Soon)
                    </span>
                  )}
                </h3>
                <p className="text-gray-600">{product.description}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
