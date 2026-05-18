'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { usersApi } from '@/lib/api';
import type { UserProfile, Post, PageResponse } from '@/lib/types';
import Navbar from '@/components/layout/Navbar';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PostGrid from '@/components/profile/PostGrid';
import Spinner from '@/components/ui/Spinner';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [postsPage, setPostsPage] = useState<PageResponse<Post> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [prof, posts] = await Promise.all([
        usersApi.getProfile(username),
        usersApi.getPosts(username),
      ]);
      setProfile(prof);
      setPostsPage(posts);
    } catch {
      setError('User not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (username) load(); }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
          {loading && (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          )}
          {error && (
            <div className="text-center py-20">
              <p className="text-text-muted">{error}</p>
            </div>
          )}
          {!loading && profile && (
            <>
              <ProfileHeader profile={profile} onFollowChange={load} />
              <div className="bg-bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wider">
                  Posts · {profile.postCount}
                </h3>
                <PostGrid posts={postsPage?.content ?? []} />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
