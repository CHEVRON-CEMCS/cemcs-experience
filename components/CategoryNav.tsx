import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface Product {
 category: string;
}

export function CategoryNav() {
 const [categories, setCategories] = useState<string[]>([]);

 useEffect(() => {
   const fetchCategories = async () => {
     try {
       const response = await axios.get('/api/Product?fields=["category"]');
       const uniqueCategories = Array.from(
         new Set(response.data.data.map((item: Product) => item.category))
       ) as string[];
       setCategories(uniqueCategories);
     } catch (error) {
       console.error('Failed to fetch categories:', error);
     }
   };

   fetchCategories();
 }, []);

 return (
   <div className="bg-white shadow-sm">
     <div className="max-w-7xl mx-auto px-4">
       <nav className="flex space-x-8 py-4">
         {categories.map((category) => (
           <Link
             key={category}
             href={`/category/${encodeURIComponent(category)}`}
             className="text-gray-600 hover:text-gray-900"
           >
             {category}
           </Link>
         ))}
       </nav>
     </div>
   </div>
 );
}