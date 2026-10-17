'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EyeOff, Globe, Save } from 'lucide-react';
import { Alert } from '@/components/feedback/alert';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/field';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { errorMessage } from '@/lib/http';
import { toast } from '@/store/toast-store';
import type { Post, PostInput } from '@/types/blog';
import { blogKeys, postKey, useCategories } from '../hooks/use-blog';
import { createPost, publishPost, unpublishPost, updatePost } from '../services/blog.service';
import { slugify } from '../utils/slugify';
import { CoverImageField } from './cover-image-field';
import { PostStatusBadge } from './post-status-badge';
import { RichTextEditor } from './rich-text-editor';
import { TagsInput } from './tags-input';

interface FormState {
  title: string;
  slug: string;
  slugTouched: boolean;
  excerpt: string;
  content: string;
  coverImage: Post['coverImage'];
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
}

function toFormState(post?: Post): FormState {
  return {
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    slugTouched: Boolean(post),
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    coverImage: post?.coverImage ?? null,
    category: post?.category?.id ?? '',
    tags: post?.tags ?? [],
    seoTitle: post?.seoTitle ?? '',
    seoDescription: post?.seoDescription ?? '',
    featured: post?.featured ?? false,
  };
}

const hasText = (html: string) => html.replace(/<[^>]*>/g, '').trim().length > 0;

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="space-y-4 p-5">
      <h2 className="text-fg text-base font-semibold">{title}</h2>
      {children}
    </Card>
  );
}

export function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { can } = usePermissions();
  const categories = useCategories();

  const [current, setCurrent] = useState<Post | undefined>(post);
  const [initial, setInitial] = useState(() => toFormState(post));
  const [form, setForm] = useState<FormState>(initial);
  const [busy, setBusy] = useState<null | 'save' | 'publish' | 'unpublish'>(null);
  const [error, setError] = useState<string | null>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const isEdit = Boolean(current);
  const isPublished = current?.status === 'published';
  const slugValue = form.slugTouched ? form.slug : slugify(form.title);
  const canPublish = can('posts.publish');

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Warn on tab close or refresh while there are unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  function toPayload(): PostInput {
    const slug = form.slugTouched ? slugify(form.slug) : '';
    return {
      title: form.title.trim(),
      ...(slug ? { slug } : {}),
      excerpt: form.excerpt.trim(),
      content: form.content,
      coverImage: form.coverImage ? { ...form.coverImage, alt: form.coverImage.alt.trim() } : null,
      category: form.category || null,
      tags: form.tags,
      seoTitle: form.seoTitle.trim(),
      seoDescription: form.seoDescription.trim(),
      ogImage: form.coverImage?.url ?? null,
      featured: form.featured,
    };
  }

  function applySaved(saved: Post) {
    const next = toFormState(saved);
    setCurrent(saved);
    setInitial(next);
    setForm(next);
    queryClient.setQueryData(postKey(saved.id), saved);
  }

  async function save(publish: boolean) {
    setError(null);
    if (form.title.trim().length < 3) return setError('Add a title of at least 3 characters.');
    if (publish && !hasText(form.content)) return setError('Add some content before publishing.');

    setBusy(publish ? 'publish' : 'save');
    try {
      let saved = current
        ? await updatePost(current.id, toPayload())
        : await createPost(toPayload());
      if (publish) saved = await publishPost(saved.id);
      await queryClient.invalidateQueries({ queryKey: blogKeys.posts });
      applySaved(saved);
      toast.success(publish ? 'Post published.' : current ? 'Changes saved.' : 'Draft created.');
      if (!current) router.replace(`/dashboard/blog/${saved.id}`);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(null);
    }
  }

  async function unpublish() {
    if (!current) return;
    setError(null);
    setBusy('unpublish');
    try {
      const saved = await unpublishPost(current.id);
      await queryClient.invalidateQueries({ queryKey: blogKeys.posts });
      setCurrent(saved);
      queryClient.setQueryData(postKey(saved.id), saved);
      toast.success('Post moved back to drafts.');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? 'Edit post' : 'New post'}
        back={{
          href: '/dashboard/blog',
          label: 'Back to posts',
          onClick: (e) => {
            if (!dirty) return;
            e.preventDefault();
            setLeaveOpen(true);
          },
        }}
        actions={
          <p className="text-fg-subtle self-center text-sm" aria-live="polite">
            {dirty ? 'Unsaved changes' : isEdit ? 'All changes saved' : ''}
          </p>
        }
      />

      {error && <Alert tone="danger">{error}</Alert>}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-5">
          <Field label="Title" aside={`${form.title.length}/160`}>
            <Input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              maxLength={160}
              placeholder="A clear, specific headline"
              className="text-lg font-semibold sm:text-lg"
            />
          </Field>

          <Field label="Web address" hint={`yourwebsite.com/blog/${slugValue || '…'}`}>
            <Input
              value={slugValue}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value, slugTouched: true }))}
              onBlur={() => set('slug', slugify(form.slug))}
            />
          </Field>
          {isPublished && form.slugTouched && form.slug !== current?.slug && (
            <Alert tone="warning">
              Changing the address of a published post breaks links that already point to it.
            </Alert>
          )}

          <div className="space-y-1.5">
            <p className="text-fg text-sm font-medium" id="content-label">
              Content
            </p>
            <RichTextEditor
              value={form.content}
              onChange={(html) => set('content', html)}
              onError={setError}
            />
          </div>

          <Field
            label="Summary"
            aside={`${form.excerpt.length}/300`}
            hint="Shown on the blog list and in search results. Leave empty to create one from the article."
          >
            <Textarea
              value={form.excerpt}
              onChange={(e) => set('excerpt', e.target.value)}
              maxLength={300}
              rows={3}
            />
          </Field>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
          <Panel title="Publish">
            <div className="flex items-center justify-between text-sm">
              <span className="text-fg-muted">Status</span>
              <PostStatusBadge status={current?.status ?? 'draft'} />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                onClick={() => void save(false)}
                loading={busy === 'save'}
                disabled={busy !== null || (isEdit && !dirty)}
              >
                {busy !== 'save' && <Save size={16} aria-hidden />}
                {isEdit ? 'Save changes' : 'Save draft'}
              </Button>
              {canPublish &&
                (isPublished ? (
                  <Button
                    variant="ghost"
                    onClick={() => void unpublish()}
                    loading={busy === 'unpublish'}
                    disabled={busy !== null}
                  >
                    {busy !== 'unpublish' && <EyeOff size={16} aria-hidden />}
                    Unpublish
                  </Button>
                ) : (
                  <Button
                    onClick={() => void save(true)}
                    loading={busy === 'publish'}
                    disabled={busy !== null}
                  >
                    {busy !== 'publish' && <Globe size={16} aria-hidden />}
                    {isEdit ? 'Save and publish' : 'Publish'}
                  </Button>
                ))}
            </div>
            {!canPublish && (
              <p className="text-fg-subtle text-xs">An editor reviews and publishes your drafts.</p>
            )}
          </Panel>

          <Panel title="Cover image">
            <CoverImageField
              value={form.coverImage}
              onChange={(v) => set('coverImage', v)}
              onError={setError}
              canUpload={can('media.upload')}
            />
          </Panel>

          <Panel title="Organise">
            <Field label="Category">
              <Select value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">Uncategorised</option>
                {categories.data?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            {can('categories.manage') && (
              <Link
                href="/dashboard/blog/categories"
                className="text-primary -mt-2 block text-xs hover:underline"
              >
                Manage categories
              </Link>
            )}
            <div className="space-y-1.5">
              <p className="text-fg text-sm font-medium">Tags</p>
              <TagsInput value={form.tags} onChange={(t) => set('tags', t)} />
            </div>
            <Checkbox
              label="Feature this post"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
            />
          </Panel>

          <Panel title="Search appearance">
            <div className="bg-bg rounded-md p-3">
              <p className="text-primary truncate text-sm">
                {form.seoTitle || form.title || 'Post title'}
              </p>
              <p className="text-success truncate text-xs">
                yourwebsite.com/blog/{slugValue || '…'}
              </p>
              <p className="text-fg-muted line-clamp-2 text-xs">
                {form.seoDescription || form.excerpt || 'Your summary will appear here.'}
              </p>
            </div>
            <Field
              label="SEO title"
              aside={`${form.seoTitle.length}/70`}
              hint="Leave empty to use the post title."
            >
              <Input
                value={form.seoTitle}
                onChange={(e) => set('seoTitle', e.target.value)}
                maxLength={70}
              />
            </Field>
            <Field
              label="SEO description"
              aside={`${form.seoDescription.length}/170`}
              hint="Leave empty to use the summary."
            >
              <Textarea
                value={form.seoDescription}
                onChange={(e) => set('seoDescription', e.target.value)}
                maxLength={170}
                rows={3}
              />
            </Field>
          </Panel>
        </aside>
      </div>

      <ConfirmDialog
        open={leaveOpen}
        title="Discard unsaved changes?"
        message="You have changes that have not been saved. If you leave now, they will be lost."
        confirmLabel="Discard changes"
        tone="danger"
        onConfirm={() => router.push('/dashboard/blog')}
        onCancel={() => setLeaveOpen(false)}
      />
    </div>
  );
}
