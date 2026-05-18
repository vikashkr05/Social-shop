'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Post } from '@/lib/types';
import PostCard from '@/components/feed/PostCard';

interface PostGridProps {
  posts: Post[];
}

export default function PostGrid({ posts }: PostGridProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-full bg-bg-elevated flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-text-muted text-sm">No posts yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="relative aspect-square bg-bg-elevated rounded-xl overflow-hidden group cursor-pointer"
          >
            {post.product.imageUrl ? (
              <Image
                src={post.product.imageUrl}
                alt={post.product.title || 'Product'}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-text-muted opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-bg/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="flex items-center gap-3 text-white text-sm font-medium">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {post.likeCount}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm"
          onClick={() => setSelectedPost(null)}
        >
          <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <PostCard post={selectedPost} />
          </div>
        </div>
      )}
    </>
  );
}