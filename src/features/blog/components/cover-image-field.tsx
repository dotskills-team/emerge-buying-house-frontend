'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import type { CoverImage } from '@/types/blog';
import { uploadImage } from '../services/upload.service';

export function CoverImageField({
  value,
  onChange,
  onError,
  canUpload,
}: {
  value: CoverImage | null;
  onChange: (value: CoverImage | null) => void;
  onError: (message: string) => void;
  canUpload: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function pick(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const { url, publicId } = await uploadImage(file);
      onChange({ url, publicId, alt: value?.alt ?? '' });
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Image upload failed.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const input = (
    <input
      ref={fileRef}
      type="file"
      accept="image/jpeg,image/png,image/webp,image/avif"
      className="hidden"
      onChange={(e) => void pick(e.target.files?.[0])}
    />
  );

  if (!value) {
    if (!canUpload) return <p className="text-fg-muted text-sm">No cover image.</p>;
    return (
      <>
        {input}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="border-border-strong bg-bg text-fg-muted hover:border-primary hover:text-primary grid w-full place-items-center gap-2 rounded-md border border-dashed px-4 py-8 text-sm transition-colors"
        >
          {uploading ? (
            <Loader2 className="animate-spin" aria-hidden />
          ) : (
            <ImagePlus size={22} aria-hidden />
          )}
          {uploading ? 'Uploading…' : 'Upload cover image'}
          <span className="text-fg-subtle text-xs">JPG, PNG, WebP or AVIF, up to 5 MB</span>
        </button>
      </>
    );
  }

  return (
    <div className="space-y-3">
      {input}
      <div className="border-border relative overflow-hidden rounded-md border">
        {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded Cloudinary URL */}
        <img src={value.url} alt={value.alt} className="aspect-video w-full object-cover" />
        {uploading && (
          <div className="bg-surface/70 absolute inset-0 grid place-items-center">
            <Loader2 className="text-primary animate-spin" aria-hidden />
          </div>
        )}
      </div>
      <Field
        label="Image description"
        hint="Describes the image for screen readers and search engines."
      >
        <Input
          value={value.alt}
          onChange={(e) => onChange({ ...value, alt: e.target.value })}
          maxLength={200}
        />
      </Field>
      {canUpload && (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            Replace
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
            disabled={uploading}
            className="text-danger"
          >
            <Trash2 size={14} aria-hidden /> Remove
          </Button>
        </div>
      )}
    </div>
  );
}
