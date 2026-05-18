'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { feedApi } from '@/lib/api';
import type { Post } from '@/lib/types';
import PostCard from './PostCard';
import Spinner from '@/components/ui/Spinner';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const fetchingRef = useRef(false);

  const { ref: sentinelRef, inView } = useInView({ threshold: 0.1 });

  const fetchMore = async () => {
    if (fetchingRef.current || !hasMore) return;
    fetchingRef.current = true;
    setLoading(true);
    try {
      const data = await feedApi.getFeed(cursor);
      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        return [...prev, ...data.posts.filter((p) => !ids.has(p.id))];
      });
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch {
      setError('Failed to load feed. Please try again.');
    } finally {
      setLoading(false);
      setInitialLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => { fetchMore(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (inView && !loading) fetchMore(); }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  if (initialLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={() => { setError(''); fetchMore(); }} className="text-accent hover:underline text-sm">
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-text-primary font-semibold mb-2">Your feed is empty</h3>
        <p className="text-text-muted text-sm">Follow people to see their product shares here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} queryKey={['feed']} />
      ))}
      <div ref={sentinelRef} className="flex justify-center py-6">
        {loading && <Spinner />}
        {!hasMore && posts.length > 0 && (
          <p className="text-text-muted text-sm">You&apos;re all caught up</p>
        )}
      </div>
    </div>
  );
}