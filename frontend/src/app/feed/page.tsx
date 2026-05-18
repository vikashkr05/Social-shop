import Navbar from '@/components/layout/Navbar';
import AuthGuard from '@/components/layout/AuthGuard';
import Feed from '@/components/feed/Feed';

export default function FeedPage() {
  return (
    <AuthGuard>
      <Navbar />
      <main className="pt-14 min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-6">
          <h2 className="text-lg font-semibold text-text-primary mb-5">Your Feed</h2>
          <Feed />
        </div>
      </main>
    </AuthGuard>
  );
}
