'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '@/lib/api';
import type { Post } from '@/lib/types';
import Avatar from '@/components/ui/Avatar';
import { clsx } from 'clsx';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

interface PostCardProps {
  post: Post;
  queryKey?: unknown[];
}

export default function PostCard({ post, queryKey }: PostCardProps) {
  const qc = useQueryClient();
  const [optimisticLiked, setOptimisticLiked] = useState(post.liked);
  const [optimisticLikes, setOptimisticLikes] = useState(post.likeCount);
  const [optimisticSaved, setOptimisticSaved] = useState(post.saved);

  const likeMutation = useMutation({
    mutationFn: () => optimisticLiked ? postsApi.unlike(post.id) : postsApi.like(post.id),
    onMutate: () => {
      setOptimisticLiked((prev) => !prev);
      setOptimisticLikes((prev) => optimisticLiked ? prev - 1 : prev + 1);
    },
    onError: () => {
      setOptimisticLiked(post.liked);
      setOptimisticLikes(post.likeCount);
    },
    onSuccess: () => { if (queryKey) qc.invalidateQueries({ queryKey }); },
  });

  const saveMutation = useMutation({
    mutationFn: () => optimisticSaved ? postsApi.unsave(post.id) : postsApi.save(post.id),
    onMutate: () => setOptimisticSaved((prev) => !prev),
    onError: () => setOptimisticSaved(post.saved),
  });

  return (
    <article className="bg-bg-card border border-border rounded-2xl overflow-hidden hover:border-border-subtle transition-all duration-200 animate-slide-up">
      {/* Product image */}
      <a
        href={post.product.affiliateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-[4/3] bg-bg-elevated overflow-hidden group"
      >
        {post.product.imageUrl ? (
          <Image
            src={post.product.imageUrl}
            alt={post.product.title || 'Product'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 600px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-16 h-16 text-text-muted opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Price badge */}
        {post.product.priceSnapshot != null && (
          <div className="absolute top-3 right-3 bg-bg/80 backdrop-blur-sm border border-border rounded-full px-3 py-1 text-sm font-semibold text-text-primary">
            ${Number(post.product.priceSnapshot).toFixed(2)}
          </div>
        )}
        {/* Site name */}
        {post.product.siteName && (
          <div className="absolute bottom-3 left-3 bg-bg/80 backdrop-blur-sm border border-border rounded-full px-2.5 py-0.5 text-xs text-text-secondary">
            {post.product.siteName}
          </div>
        )}
      </a>

      {/* Card body */}
      <div className="p-4">
        {/* Product title */}
        <a
          href={post.product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block font-semibold text-text-primary hover:text-accent-light transition-colors line-clamp-2 mb-2 leading-snug"
        >
          {post.product.title || 'View Product'}
        </a>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm text-text-secondary line-clamp-2 mb-3">{post.caption}</p>
        )}

        {/* Footer: user + actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <Link href={`/profile/${post.user.username}`} className="flex items-center gap-2 group">
            <Avatar src={post.user.avatarUrl} username={post.user.username} size="xs" />
            <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors font-medium">
              @{post.user.username}
            </span>
            <span className="text-xs text-text-muted">· {timeAgo(post.createdAt)}</span>
          </Link>

          <div className="flex items-center gap-1">
            {/* Like */}
            <button
              onClick={() => likeMutation.mutate()}
              className={clsx(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                optimisticLiked
                  ? 'text-accent-pink bg-accent-pink/10 hover:bg-accent-pink/20'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
              )}
            >
              <svg className="w-3.5 h-3.5" fill={optimisticLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {optimisticLikes > 0 && optimisticLikes}
            </button>

            {/* Save */}
            <button
              onClick={() => saveMutation.mutate()}
              className={clsx(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                optimisticSaved
                  ? 'text-accent bg-accent/10 hover:bg-accent/20'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
              )}
            >
              <svg className="w-3.5 h-3.5" fill={optimisticSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            {/* External link */}
            <a
              href={post.product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-2.5 py-1.5 rounded-lg text-xs text-text-muted hover:text-accent hover:bg-bg-elevated transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}