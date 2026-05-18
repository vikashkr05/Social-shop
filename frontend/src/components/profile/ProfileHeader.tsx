'use client';

import { useState } from 'react';
import { socialApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import type { UserProfile } from '@/lib/types';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

interface ProfileHeaderProps {
  profile: UserProfile;
  onFollowChange?: () => void;
}

export default function ProfileHeader({ profile, onFollowChange }: ProfileHeaderProps) {
  const { user: currentUser } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing ?? false);
  const [followerCount, setFollowerCount] = useState(profile.followerCount);
  const [loading, setLoading] = useState(false);

  const isOwnProfile = currentUser?.id === profile.id;

  const handleFollowToggle = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await socialApi.unfollow(profile.id);
        setIsFollowing(false);
        setFollowerCount((c) => c - 1);
      } else {
        await socialApi.follow(profile.id);
        setIsFollowing(true);
        setFollowerCount((c) => c + 1);
      }
      onFollowChange?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <Avatar src={profile.avatarUrl} username={profile.username} size="xl" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-text-primary">@{profile.username}</h1>
              {profile.bio && (
                <p className="text-sm text-text-secondary mt-1 leading-relaxed">{profile.bio}</p>
              )}
            </div>
            {!isOwnProfile && currentUser && (
              <Button
                variant={isFollowing ? 'secondary' : 'primary'}
                size="sm"
                loading={loading}
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-5 mt-4">
            <Stat label="Posts" value={profile.postCount} />
            <Stat label="Followers" value={followerCount} />
            <Stat label="Following" value={profile.followingCount} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-lg font-bold text-text-primary">{value.toLocaleString()}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}