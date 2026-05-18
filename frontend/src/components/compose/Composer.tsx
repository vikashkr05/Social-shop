'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { linksApi, postsApi } from '@/lib/api';
import type { LinkMeta } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LinkPreview from './LinkPreview';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Composer() {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [meta, setMeta] = useState<LinkMeta | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const debouncedUrl = useDebounce(url, 600);

  const extractMeta = useCallback(async (rawUrl: string) => {
    try { new URL(rawUrl); } catch { return; }
    setExtracting(true);
    setMeta(null);
    try {
      const data = await linksApi.extract(rawUrl);
      setMeta(data);
    } catch {
      setMeta(null);
    } finally {
      setExtracting(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedUrl.trim()) extractMeta(debouncedUrl.trim());
    else { setMeta(null); setExtracting(false); }
  }, [debouncedUrl, extractMeta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      await postsApi.create({ url: url.trim(), caption: caption.trim() || undefined });
      router.push('/feed');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Input
          label="Product URL"
          type="url"
          placeholder="https://example.com/product/cool-sneakers"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <p className="text-xs text-text-muted mt-1.5">
          Paste any product link — we&apos;ll extract the title, image, and price automatically.
        </p>
      </div>

      <LinkPreview meta={meta} loading={extracting} />

      <div>
        <label className="text-sm font-medium text-text-secondary block mb-1.5">
          Caption <span className="text-text-muted">(optional)</span>
        </label>
        <textarea
          placeholder="Why do you love this? Share your thoughts…"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full bg-bg-elevated border border-border hover:border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200 resize-none"
        />
        <p className="text-xs text-text-muted mt-1 text-right">{caption.length}/500</p>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={submitting}
          disabled={!url.trim()}
          className="flex-1"
        >
          Share Product
        </Button>
      </div>
    </form>
  );
}