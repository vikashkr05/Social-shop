'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto h-full px-4 flex items-center justify-between">
        <Link href="/feed" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent-pink flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 9a3 3 0 100 6 3 3 0 000-6z"/>
            </svg>
          </div>
          <span className="font-bold text-base gradient-text">Project Cart</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/compose')}
            className="hidden sm:flex"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Share
          </Button>
          {user && (
            <div className="flex items-center gap-2">
              <Link href={`/profile/${user.username}`}>
                <Avatar src={user.avatarUrl} username={user.username} size="sm" className="cursor-pointer hover:ring-2 hover:ring-accent/50 transition-all" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-text-muted hover:text-text-secondary transition-colors p-1.5 rounded-lg hover:bg-bg-elevated"
                title="Sign out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}