import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { BlogPost } from '../../../types/blog';
import { NavLanding } from '../../../components/NavLanding';
import { BlogList } from '../../../components/BlogList';
import { FooterSection } from '../../../components/FooterSection';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/Experience Blog');
        const blogIds = response.data.data;
        
        // Fetch details for each blog post
        const postsData = await Promise.all(
          blogIds.map(async (blog: { name: string }) => {
            const detailResponse = await axios.get(`/api/Experience Blog/${blog.name}`);
            return detailResponse.data.data;
          })
        );
        
        setPosts(postsData);
      } catch (err) {
        const errorMessage = err instanceof AxiosError 
          ? err.response?.data?.message || err.message
          : 'An unexpected error occurred'
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavLanding />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Our Blog</h1>
            <p className="mt-2 text-gray-600">Discover our latest articles and updates</p>
          </div>
          <BlogList posts={posts} loading={loading} error={error} />
        </div>
      </main>
      <FooterSection />
    </div>
  );
}