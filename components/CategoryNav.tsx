import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ChevronDown, Menu } from 'lucide-react';

interface Product {
  category: string;
  sub_category: string;
}

interface CategoryData {
  [key: string]: string[];
}

export function CategoryNav() {
  const [categoryData, setCategoryData] = useState<CategoryData>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/Product?fields=["category","sub_category"]');
        const data = response.data.data;
        
        const groupedData: CategoryData = data.reduce((acc: CategoryData, item: Product) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          if (item.sub_category && !acc[item.category].includes(item.sub_category)) {
            acc[item.category].push(item.sub_category);
          }
          return acc;
        }, {});
        
        setCategoryData(groupedData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const CategoryItem = ({ category, subcategories }: { category: string, subcategories: string[] }) => (
    <div className="relative group">
      <div className="flex items-center space-x-1 cursor-pointer text-gray-600 group-hover:text-gray-900">
        <Link href={`/category/${encodeURIComponent(category)}`}>
          <span>{category}</span>
        </Link>
        {subcategories.length > 0 && (
          <ChevronDown className="w-4 h-4" />
        )}
      </div>
      
      {subcategories.length > 0 && (
        <div className="absolute z-20 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="py-1">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory}
                href={`/category/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {subcategory}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white shadow-sm">
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="py-3 flex items-center space-x-2 text-gray-600"
          >
            <Menu className="w-6 h-6" />
            <span>Categories</span>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} border-t`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {Object.entries(categoryData).map(([category, subcategories]) => (
                <CategoryItem key={category} category={category} subcategories={subcategories} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-8">
            {Object.entries(categoryData).map(([category, subcategories]) => (
              <div key={category} className="relative group py-2">
                <div className="flex items-center space-x-1 cursor-pointer text-gray-600 group-hover:text-gray-900">
                  <Link href={`/category/${encodeURIComponent(category)}`}>
                    <span className="font-medium">{category}</span>
                  </Link>
                  {subcategories.length > 0 && (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
                
                {subcategories.length > 0 && (
                  <div className="absolute z-20 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      {subcategories.map((subcategory) => (
                        <Link
                          key={subcategory}
                          href={`/category/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {subcategory}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}