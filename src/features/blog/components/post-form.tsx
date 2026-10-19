'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  CalendarClock,
  CheckCircle2,
  Circle,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  ImageIcon,
  Save,
  SearchCheck,
  Send,
  Tags,
  type LucideIcon,
} from 'lucide-react';
import { Alert } from '@/components/feedback/alert';
import { EditorHeader } from '@/features/dashboard/components/editor-header';
import { FormPanel } from '@/features/dashboard/components/content-ui';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/field';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { errorMessage } from '@/lib/http';
import { formatDateTime } from '@/lib/utils';
import { toast } from '@/store/toast-store';
import type { Post, PostInput } from '@/types/blog';
import { blogKeys, postKey, useCategories } from '../hooks/use-blog';
import { createPost, publishPost, unpublishPost, updatePost } from '../services/blog.service';
import { slugify } from '../utils/slugify';
import { displayStatus, toLocalInput, wordCount } from '../utils/status';
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
  canonicalUrl: string;
  noIndex: boolean;
  featured: boolean;
  /** datetime-local value; empty means "now" when publishing. */
  publishAt: string;
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
    canonicalUrl: post?.canonicalUrl ?? '',
    noIndex: post?.noIndex ?? false,
    featured: post?.featured ?? false,
    publishAt: post?.status === 'published' ? toLocalInput(post.publishedAt) : '',
  };
}

/** The current time, read once on mount and refreshed every minute (keeps render pure). */
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

const hasText = (html: string) => html.replace(/<[^>]*>/g, '').trim().length > 0;
const WORDS_PER_MINUTE = 200;

function Panel({
  icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <FormPanel icon={icon} title={title} description={description}>
      {children}
    </FormPanel>
  );
}

/** Common on-page SEO checks, shown as a to-do list rather than a score. */
function SeoChecklist({ form, words }: { form: FormState; words: number }) {
  const title = (form.seoTitle || form.title).trim();
  const description = (form.seoDescription || form.excerpt).trim();
  const checks = [
    { ok: title.length >= 30 && title.length <= 60, label: 'Title is 30–60 characters' },
    {
      ok: description.length >= 70 && description.length <= 160,
      label: 'Description is 70–160 characters',
    },
    { ok: words >= 300, label: 'At least 300 words' },
    { ok: /<h2[\s>]/.test(form.content), label: 'Uses subheadings' },
    { ok: Boolean(form.coverImage), label: 'Has a cover image' },
    { ok: Boolean(form.coverImage?.alt.trim()), label: 'Cover image has alt text' },
    { ok: Boolean(form.category), label: 'Has a category' },
    { ok: form.tags.length > 0, label: 'Has at least one tag' },
  ];
  const done = checks.filter((c) => c.ok).length;
  return (
    <div>
      <p className="text-fg-muted mb-2 text-xs font-medium">
        SEO checklist · {done}/{checks.length}
      </p>
      <ul className="space-y-1.5">
        {checks.map((c) => (
          <li key={c.label} className="flex items-center gap-2 text-xs">
            {c.ok ? (
              <CheckCircle2 size={14} aria-hidden className="text-success shrink-0" />
            ) : (
              <Circle size={14} aria-hidden className="text-fg-subtle shrink-0" />
            )}
            <span className={c.ok ? 'text-fg' : 'text-fg-muted'}>{c.label}</span>
            <span className="sr-only">{c.ok ? '(done)' : '(to do)'}</span>
          </li>
        ))}
      </ul>
    </div>
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
  const now = useNow();

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const isEdit = Boolean(current);
  const status = current ? displayStatus(current, now) : 'draft';
  const isPublished = current?.status === 'published';
  const slugValue = form.slugTouched ? form.slug : slugify(form.title);
  const canPublish = can('posts.publish');
  const words = wordCount(form.content);
  const publishDate = form.publishAt ? new Date(form.publishAt) : null;
  const schedulesLater = publishDate !== null && publishDate.getTime() > now;

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
      canonicalUrl: form.canonicalUrl.trim() || null,
      noIndex: form.noIndex,
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

  function validate(publish: boolean): string | null {
    if (form.title.trim().length < 3) return 'Add a title of at least 3 characters.';
    if (publish && !hasText(form.content)) return 'Add some content before publishing.';
    if (form.canonicalUrl.trim() && !/^https?:\/\/\S+$/i.test(form.canonicalUrl.trim())) {
      return 'The canonical URL must be a full address starting with https://';
    }
    if (form.publishAt && Number.isNaN(new Date(form.publishAt).getTime())) {
      return 'Enter a valid publish date.';
    }
    return null;
  }

  async function save(publish: boolean) {
    setError(null);
    const problem = validate(publish);
    if (problem) return setError(problem);

    const when = publishDate ? publishDate.toISOString() : undefined;
    // A changed date on a post that is already live (or scheduled) is applied on save.
    const redate = !publish && isPublished && canPublish && form.publishAt !== initial.publishAt;

    setBusy(publish ? 'publish' : 'save');
    try {
      let saved = current
        ? await updatePost(current.id, toPayload())
        : await createPost(toPayload());
      if (publish || (redate && when)) saved = await publishPost(saved.id, when);
      await queryClient.invalidateQueries({ queryKey: blogKeys.posts });
      applySaved(saved);
      const after = displayStatus(saved);
      toast.success(
        after === 'scheduled'
          ? `Scheduled for ${formatDateTime(saved.publishedAt)}.`
          : publish
            ? 'Post published.'
            : current
              ? 'Changes saved.'
              : 'Draft created.',
      );
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
      applySaved(saved);
      toast.success('Post moved back to drafts.');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(null);
    }
  }

  const secondaryLink =
    'border-border-strong text-fg hover:bg-surface-muted inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors';

  return (
    <div className="space-y-6">
      <EditorHeader
        title={isEdit ? 'Edit post' : 'New post'}
        subtitle={isEdit ? form.title || current?.title : 'Start with a strong headline.'}
        back={{
          href: '/dashboard/blog',
          label: 'Back to posts',
          onClick: (e) => {
            if (!dirty) return;
            e.preventDefault();
            setLeaveOpen(true);
          },
        }}
        status={<PostStatusBadge status={status} />}
        saveState={dirty ? 'dirty' : isEdit ? 'saved' : 'new'}
      />

      {error && <Alert tone="danger">{error}</Alert>}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="border-border bg-surface min-w-0 space-y-5 rounded-2xl border p-4 shadow-sm sm:p-6">
          <Field label="Title" aside={`${form.title.length}/160`}>
            <Input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              maxLength={160}
              placeholder="A clear, specific headline"
              className="font-display min-h-14 text-xl font-semibold sm:text-2xl"
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
            <p className="text-fg-subtle text-xs tabular-nums" aria-live="polite">
              {words.toLocaleString()} {words === 1 ? 'word' : 'words'} · about{' '}
              {Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min read
            </p>
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
          <Panel icon={Send} title="Publish" description="Status, date and visibility">
            <div className="flex items-center justify-between text-sm">
              <span className="text-fg-muted">Status</span>
              <PostStatusBadge status={status} />
            </div>
            {isPublished && current?.publishedAt && (
              <p className="text-fg-muted -mt-2 text-xs">
                {status === 'scheduled' ? 'Goes live' : 'Published'}{' '}
                {formatDateTime(current.publishedAt)}
              </p>
            )}

            {canPublish && (
              <Field
                label="Publish date"
                hint={
                  isPublished
                    ? 'Change it and save to reschedule or backdate.'
                    : 'Leave empty to publish now. A future date schedules the post.'
                }
              >
                <Input
                  type="datetime-local"
                  value={form.publishAt}
                  onChange={(e) => set('publishAt', e.target.value)}
                />
              </Field>
            )}

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
                    {status === 'scheduled' ? 'Cancel schedule' : 'Unpublish'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => void save(true)}
                    loading={busy === 'publish'}
                    disabled={busy !== null}
                  >
                    {busy !== 'publish' &&
                      (schedulesLater ? (
                        <CalendarClock size={16} aria-hidden />
                      ) : (
                        <Globe size={16} aria-hidden />
                      ))}
                    {schedulesLater ? 'Schedule' : isEdit ? 'Save and publish' : 'Publish'}
                  </Button>
                ))}
            </div>

            {current && (
              <div className="border-border flex flex-col gap-2 border-t pt-4">
                <a
                  href={`/dashboard/blog/${current.id}/preview`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={secondaryLink}
                >
                  <Eye size={16} aria-hidden /> Preview
                </a>
                {status === 'published' && (
                  <a
                    href={`/blog/${current.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={secondaryLink}
                  >
                    <ExternalLink size={16} aria-hidden /> View on website
                  </a>
                )}
                {dirty && (
                  <p className="text-fg-subtle text-xs">Preview shows the last saved version.</p>
                )}
              </div>
            )}
            {!canPublish && (
              <p className="text-fg-subtle text-xs">An editor reviews and publishes your drafts.</p>
            )}
          </Panel>

          <Panel
            icon={ImageIcon}
            title="Cover image"
            description="Shown on cards and at the top of the article"
          >
            <CoverImageField
              value={form.coverImage}
              onChange={(v) => set('coverImage', v)}
              onError={setError}
              canUpload={can('media.upload')}
            />
          </Panel>

          <Panel icon={Tags} title="Organise" description="Category, tags and featuring">
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
              label="Feature this post on the blog page"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
            />
          </Panel>

          <Panel
            icon={SearchCheck}
            title="Search appearance"
            description="How the post looks in Google and on social media"
          >
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
            <Field
              label="Canonical URL"
              hint="Only if this article was first published on another website."
            >
              <Input
                type="url"
                inputMode="url"
                value={form.canonicalUrl}
                onChange={(e) => set('canonicalUrl', e.target.value)}
                placeholder="https://"
              />
            </Field>
            <Checkbox
              label="Hide from search engines (noindex)"
              checked={form.noIndex}
              onChange={(e) => set('noIndex', e.target.checked)}
            />
            <div className="border-border border-t pt-4">
              <SeoChecklist form={form} words={words} />
            </div>
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
