'use client';

import Image from 'next/image';
import type { LinkMeta } from '@/lib/types';
import Spinner from '@/components/ui/Spinner';

interface LinkPreviewProps {
  meta: LinkMeta | null;
  loading: boolean;
}

export default function LinkPreview({ meta, loading }: LinkPreviewProps) {
  if (loading) {
    return (
      <div className="border border-border rounded-xl p-4 flex items-center gap-3 bg-bg-elevated animate-pulse">
        <Spinner size="sm" />
        <span className="text-sm text-text-muted">Fetching product details…</span>
      </div>
    );
  }

  if (!meta) return null;

  return (
    <div className="border border-accent/30 rounded-xl overflow-hidden bg-bg-elevated animate-fade-in">
      {meta.imageUrl && (
        <div className="relative aspect-video">
          <Image src={meta.imageUrl} alt={meta.title || 'Product'} fill className="object-cover" sizes="600px" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            {meta.siteName && (
              <p className="text-xs text-accent font-medium uppercase tracking-wider mb-1">{meta.siteName}</p>
            )}
            <h3 className="text-text-primary font-semibold leading-snug">
              {meta.title || meta.originalUrl}
            </h3>
          </div>
          {meta.priceSnapshot != null && (
            <span className="flex-shrink-0 text-lg font-bold text-accent-light">
              ${Number(meta.priceSnapshot).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}