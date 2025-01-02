import React from 'react';
import { BlogCard } from './BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogPost } from '../types/blog';

interface BlogListProps {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
}

export function BlogList({ posts, loading, error }: BlogListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[16/9] w-full" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading blog posts: {error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No blog posts available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.name} post={post} />
      ))}
    </div>
  );
}