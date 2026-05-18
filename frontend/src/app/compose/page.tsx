export const runtime = 'edge';

import Navbar from '@/components/layout/Navbar';
import AuthGuard from '@/components/layout/AuthGuard';
import Composer from '@/components/compose/Composer';

export default function ComposePage() {
  return (
    <AuthGuard>
      <Navbar />
      <main className="pt-14 min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-6">
          <h2 className="text-lg font-semibold text-text-primary mb-5">Share a Product</h2>
          <div className="bg-bg-card border border-border rounded-2xl p-6">
            <Composer />
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
