// pages/search.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Navbar } from '../../components/Navbar';
import { LoadingProductCard, ProductCard } from '../../components/ProductCard';
import Footer from '../../components/Footer';

interface Product {
  name: string;
  product_name: string;
  price: number;
  pro_image: string;
  category: string;
}

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!q) return;

      try {
        const response = await axios.get(`/api/Product?search=${encodeURIComponent(q as string)}`);
        setProducts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [q]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Search Results for "{q}"
        </h1>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, index) => (
              <LoadingProductCard key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p>No products found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}