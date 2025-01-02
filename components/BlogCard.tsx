import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { BlogPost } from '../types/blog';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://staging.chevroncemcs.com';
  const imageUrl = post.featured_image ? `${baseUrl}${post.featured_image}` : '/placeholder-blog.jpg';
  
  const formattedDate = format(new Date(post.publish_date), 'MMM dd, yyyy');

  return (
    <div 
      onClick={() => router.push(`/blog/${post.name}`)}
      className="group cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
        <h2 className="text-xl font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <button className="text-primary font-medium text-sm group-hover:underline">
          Read More
        </button>
      </div>
    </div>
  );
}