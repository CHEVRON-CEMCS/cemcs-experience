// pages/blog/[id].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import Image from 'next/image';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { NavLanding } from '../../../components/NavLanding';
import { FooterSection } from '../../../components/FooterSection';

interface BlogPost {
  name: string;
  title: string;
  featured_image: string;
  publish_date: string;
  content: string;
  author: string;
}

export default function BlogPostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://staging.chevroncemcs.com';

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const response = await axios.get(`/api/Experience Blog/${id}`);
        setPost(response.data.data);
      } catch (err) {
        const errorMessage = err instanceof AxiosError 
          ? err.response?.data?.message || err.message
          : 'An unexpected error occurred'
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavLanding />
        <main className="container py-12">
          <div className="space-y-8">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="aspect-[16/9] w-full" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
        <FooterSection />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <NavLanding />
        <main className="container py-12">
          <div className="text-center">
            <p className="text-destructive">
              {error || 'Blog post not found'}
            </p>
            <Button 
              onClick={() => router.push('/blog')}
              className="mt-4"
              variant="link"
            >
              Back to Blog
            </Button>
          </div>
        </main>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavLanding />
      <main className="container py-12">
        <article className="bg-card rounded-lg shadow overflow-hidden">
          <div className="aspect-[16/9] relative">
            <Image
              src={`${baseUrl}${post.featured_image}`}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                {post.title}
              </h1>
              
              <div className="flex items-center text-sm text-muted-foreground gap-4">
                <span>{format(new Date(post.publish_date), 'MMMM dd, yyyy')}</span>
                {post.author && (
                  <>
                    <span>•</span>
                    <span>{post.author}</span>
                  </>
                )}
              </div>

              <div 
                className="prose prose-lg dark:prose-invert max-w-none mt-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </article>

        <div className="mt-8 text-center">
          <Button 
            onClick={() => router.push('/blog')}
            variant="link"
          >
            ← Back to Blog
          </Button>
        </div>
      </main>
      <FooterSection />
    </div>
  );
}