'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  ClipboardList,
  ExternalLink,
  EyeOff,
  Globe,
  ImageIcon,
  Plus,
  Ruler,
  Save,
  SearchCheck,
  Send,
  Shirt,
  Tags,
  Trash2,
} from 'lucide-react';
import { Alert } from '@/components/feedback/alert';
import { Button, IconButton } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/field';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { RichTextEditor } from '@/features/blog/components/rich-text-editor';
import { TagsInput } from '@/features/blog/components/tags-input';
import { slugify } from '@/features/blog/utils/slugify';
import { ChipsInput } from '@/features/dashboard/components/chips-input';
import { FormPanel } from '@/features/dashboard/components/content-ui';
import { EditorHeader } from '@/features/dashboard/components/editor-header';
import { errorMessage } from '@/lib/http';
import { formatDateTime } from '@/lib/utils';
import { toast } from '@/store/toast-store';
import type { Product, ProductImage, ProductInput, ProductSpec } from '@/types/product';
import { productKeys, useProductCategories } from '../hooks/use-products';
import {
  createProduct,
  publishProduct,
  unpublishProduct,
  updateProduct,
} from '../services/products.service';
import { ProductImagesField } from './product-images-field';
import { ProductStatusBadge } from './product-status-badge';

const SIZE_SUGGESTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const CERT_SUGGESTIONS = ['OEKO-TEX Standard 100', 'GOTS', 'BCI', 'GRS', 'WRAP', 'BSCI', 'Sedex'];

interface FormState {
  name: string;
  slug: string;
  slugTouched: boolean;
  styleCode: string;
  category: string;
  summary: string;
  description: string;
  images: ProductImage[];
  fabric: string;
  weight: string;
  sizes: string[];
  colors: string[];
  moq: string;
  moqUnit: string;
  leadTime: string;
  certifications: string[];
  specs: ProductSpec[];
  tags: string[];
  featured: boolean;
  sortOrder: string;
  seoTitle: string;
  seoDescription: string;
}

function toFormState(p?: Product): FormState {
  return {
    name: p?.name ?? '',
    slug: p?.slug ?? '',
    slugTouched: Boolean(p),
    styleCode: p?.styleCode ?? '',
    category: p?.category?.id ?? '',
    summary: p?.summary ?? '',
    description: p?.description ?? '',
    images: p?.images ?? [],
    fabric: p?.fabric ?? '',
    weight: p?.weight ?? '',
    sizes: p?.sizes ?? [],
    colors: p?.colors ?? [],
    moq: p?.moq == null ? '' : String(p.moq),
    moqUnit: p?.moqUnit ?? 'pcs per style',
    leadTime: p?.leadTime ?? '',
    certifications: p?.certifications ?? [],
    specs: p?.specs ?? [],
    tags: p?.tags ?? [],
    featured: p?.featured ?? false,
    sortOrder: String(p?.sortOrder ?? 0),
    seoTitle: p?.seoTitle ?? '',
    seoDescription: p?.seoDescription ?? '',
  };
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { can } = usePermissions();
  const categories = useProductCategories();

  const [current, setCurrent] = useState<Product | undefined>(product);
  const [initial, setInitial] = useState(() => toFormState(product));
  const [form, setForm] = useState<FormState>(initial);
  const [busy, setBusy] = useState<null | 'save' | 'publish' | 'unpublish'>(null);
  const [error, setError] = useState<string | null>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const isEdit = Boolean(current);
  const isPublished = current?.status === 'published';
  const slugValue = form.slugTouched ? form.slug : slugify(form.name);
  const canPublish = can('products.publish');

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  function validate(publish: boolean): string | null {
    if (form.name.trim().length < 2) return 'Add a product name of at least 2 characters.';
    if (form.moq && !/^\d+$/.test(form.moq.trim())) return 'MOQ must be a whole number.';
    if (form.specs.some((s) => !s.label.trim() || !s.value.trim())) {
      return 'Fill in or remove empty specification rows.';
    }
    if (publish && !form.category) return 'Choose a category before publishing.';
    if (publish && !form.summary.trim()) return 'Add a summary before publishing.';
    return null;
  }

  function toPayload(): ProductInput {
    const slug = form.slugTouched ? slugify(form.slug) : '';
    return {
      name: form.name.trim(),
      ...(slug ? { slug } : {}),
      styleCode: form.styleCode.trim(),
      category: form.category || null,
      summary: form.summary.trim(),
      description: form.description,
      images: form.images.map((i) => ({ ...i, alt: i.alt.trim() })),
      fabric: form.fabric.trim(),
      weight: form.weight.trim(),
      sizes: form.sizes,
      colors: form.colors,
      moq: form.moq.trim() ? Number(form.moq) : null,
      moqUnit: form.moqUnit.trim(),
      leadTime: form.leadTime.trim(),
      certifications: form.certifications,
      specs: form.specs.map((s) => ({ label: s.label.trim(), value: s.value.trim() })),
      tags: form.tags,
      featured: form.featured,
      sortOrder: Number(form.sortOrder) || 0,
      seoTitle: form.seoTitle.trim(),
      seoDescription: form.seoDescription.trim(),
    };
  }

  function applySaved(saved: Product) {
    const next = toFormState(saved);
    setCurrent(saved);
    setInitial(next);
    setForm(next);
    queryClient.setQueryData(productKeys.detail(saved.id), saved);
  }

  async function save(publish: boolean) {
    setError(null);
    const problem = validate(publish);
    if (problem) return setError(problem);
    setBusy(publish ? 'publish' : 'save');
    try {
      let saved = current
        ? await updateProduct(current.id, toPayload())
        : await createProduct(toPayload());
      if (publish) saved = await publishProduct(saved.id);
      await queryClient.invalidateQueries({ queryKey: productKeys.all });
      await queryClient.invalidateQueries({ queryKey: productKeys.categories });
      applySaved(saved);
      toast.success(publish ? 'Product published.' : current ? 'Changes saved.' : 'Draft created.');
      if (!current) router.replace(`/dashboard/products/${saved.id}`);
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
      const saved = await unpublishProduct(current.id);
      await queryClient.invalidateQueries({ queryKey: productKeys.all });
      applySaved(saved);
      toast.success('Product moved back to drafts.');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(null);
    }
  }

  const updateSpec = (i: number, patch: Partial<ProductSpec>) =>
    set(
      'specs',
      form.specs.map((s, n) => (n === i ? { ...s, ...patch } : s)),
    );

  const secondaryLink =
    'border-border-strong text-fg hover:bg-surface-muted inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors';

  return (
    <div className="space-y-6">
      <EditorHeader
        title={isEdit ? 'Edit product' : 'New product'}
        subtitle={
          isEdit ? form.name || current?.name : 'Describe the product the way a buyer would.'
        }
        back={{
          href: '/dashboard/products',
          label: 'Back to products',
          onClick: (e) => {
            if (!dirty) return;
            e.preventDefault();
            setLeaveOpen(true);
          },
        }}
        status={<ProductStatusBadge status={current?.status ?? 'draft'} />}
        saveState={dirty ? 'dirty' : isEdit ? 'saved' : 'new'}
      />

      {error && <Alert tone="danger">{error}</Alert>}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 space-y-6">
          <FormPanel icon={Shirt} title="Product" description="Name, code and description">
            <Field label="Product name" aside={`${form.name.length}/140`}>
              <Input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                maxLength={140}
                placeholder="e.g. Organic cotton jersey tee"
                className="font-display min-h-14 text-xl font-semibold sm:text-2xl"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
              <Field label="Web address" hint={`yourwebsite.com/production/${slugValue || '…'}`}>
                <Input
                  value={slugValue}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: e.target.value, slugTouched: true }))
                  }
                  onBlur={() => set('slug', slugify(form.slug))}
                />
              </Field>
              <Field label="Style code" hint="Your internal reference.">
                <Input
                  value={form.styleCode}
                  onChange={(e) => set('styleCode', e.target.value)}
                  maxLength={40}
                  placeholder="EBH-KN-001"
                />
              </Field>
            </div>
            <Field
              label="Summary"
              aside={`${form.summary.length}/300`}
              hint="One or two sentences shown on product cards and in search results."
            >
              <Textarea
                value={form.summary}
                onChange={(e) => set('summary', e.target.value)}
                maxLength={300}
                rows={3}
              />
            </Field>
            <div className="space-y-1.5">
              <p className="text-fg text-sm font-medium">Description</p>
              <RichTextEditor
                value={form.description}
                onChange={(html) => set('description', html)}
                onError={setError}
              />
            </div>
          </FormPanel>

          <FormPanel
            icon={ImageIcon}
            title="Images"
            description="Several angles and close-ups of the fabric work best"
          >
            <ProductImagesField
              value={form.images}
              onChange={(v) => set('images', v)}
              onError={setError}
              canUpload={can('media.upload')}
            />
          </FormPanel>

          <FormPanel
            icon={Ruler}
            title="Specifications"
            description="What buyers check before they ask for a quote"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Fabric & composition">
                <Input
                  value={form.fabric}
                  onChange={(e) => set('fabric', e.target.value)}
                  maxLength={160}
                  placeholder="100% organic cotton single jersey"
                />
              </Field>
              <Field label="Weight">
                <Input
                  value={form.weight}
                  onChange={(e) => set('weight', e.target.value)}
                  maxLength={40}
                  placeholder="180 GSM"
                />
              </Field>
              <Field label="Minimum order (MOQ)">
                <Input
                  inputMode="numeric"
                  value={form.moq}
                  onChange={(e) => set('moq', e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="1000"
                />
              </Field>
              <Field label="MOQ unit">
                <Input
                  value={form.moqUnit}
                  onChange={(e) => set('moqUnit', e.target.value)}
                  maxLength={40}
                  placeholder="pcs per style"
                />
              </Field>
              <Field label="Lead time" className="sm:col-span-2">
                <Input
                  value={form.leadTime}
                  onChange={(e) => set('leadTime', e.target.value)}
                  maxLength={60}
                  placeholder="60–75 days after PP approval"
                />
              </Field>
            </div>
            <div className="space-y-1.5">
              <p className="text-fg text-sm font-medium">Sizes</p>
              <ChipsInput
                value={form.sizes}
                onChange={(v) => set('sizes', v)}
                label="Add a size"
                suggestions={SIZE_SUGGESTIONS}
                maxLength={20}
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-fg text-sm font-medium">Colours</p>
              <ChipsInput
                value={form.colors}
                onChange={(v) => set('colors', v)}
                label="Add a colour"
                placeholder="e.g. Navy, then Enter"
                max={30}
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-fg text-sm font-medium">Certifications</p>
              <ChipsInput
                value={form.certifications}
                onChange={(v) => set('certifications', v)}
                label="Add a certification"
                suggestions={CERT_SUGGESTIONS}
                max={12}
                maxLength={60}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-fg text-sm font-medium">More details</p>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={form.specs.length >= 20}
                  onClick={() => set('specs', [...form.specs, { label: '', value: '' }])}
                >
                  <Plus size={15} aria-hidden /> Add row
                </Button>
              </div>
              {form.specs.length === 0 ? (
                <p className="text-fg-subtle text-xs">
                  Add rows such as Wash, Print method or Packing.
                </p>
              ) : (
                <ul className="space-y-2">
                  {form.specs.map((s, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] gap-2"
                    >
                      <Input
                        aria-label={`Detail ${i + 1} name`}
                        value={s.label}
                        maxLength={40}
                        placeholder="Wash"
                        onChange={(e) => updateSpec(i, { label: e.target.value })}
                      />
                      <Input
                        aria-label={`Detail ${i + 1} value`}
                        value={s.value}
                        maxLength={160}
                        placeholder="Enzyme and stone wash"
                        onChange={(e) => updateSpec(i, { value: e.target.value })}
                      />
                      <IconButton
                        label={`Remove detail ${i + 1}`}
                        tone="danger"
                        onClick={() =>
                          set(
                            'specs',
                            form.specs.filter((_, n) => n !== i),
                          )
                        }
                      >
                        <Trash2 size={16} aria-hidden />
                      </IconButton>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </FormPanel>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
          <FormPanel icon={Send} title="Publish" description="Visibility on the website">
            <div className="flex items-center justify-between text-sm">
              <span className="text-fg-muted">Status</span>
              <ProductStatusBadge status={current?.status ?? 'draft'} />
            </div>
            {isPublished && current?.publishedAt && (
              <p className="text-fg-muted -mt-2 text-xs">
                Published {formatDateTime(current.publishedAt)}
              </p>
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
            {current && isPublished && (
              <a
                href={`/production/${current.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className={secondaryLink}
              >
                <ExternalLink size={16} aria-hidden /> View on website
              </a>
            )}
            {!canPublish && (
              <p className="text-fg-subtle text-xs">An editor reviews and publishes products.</p>
            )}
          </FormPanel>

          <FormPanel icon={Tags} title="Organise" description="Category, order and featuring">
            <Field label="Category">
              <Select value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">Choose a category</option>
                {categories.data?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            {can('products.categories') && (
              <Link
                href="/dashboard/products/categories"
                className="text-primary -mt-2 block text-xs hover:underline"
              >
                Manage categories
              </Link>
            )}
            <div className="space-y-1.5">
              <p className="text-fg text-sm font-medium">Tags</p>
              <TagsInput value={form.tags} onChange={(t) => set('tags', t)} max={15} />
            </div>
            <Field label="Display order" hint="Lower numbers appear first on the website.">
              <Input
                type="number"
                inputMode="numeric"
                value={form.sortOrder}
                onChange={(e) => set('sortOrder', e.target.value)}
              />
            </Field>
            <Checkbox
              label="Feature on the website"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
            />
          </FormPanel>

          <FormPanel
            icon={SearchCheck}
            title="Search appearance"
            description="How the product looks in Google"
          >
            <div className="bg-bg rounded-lg p-3">
              <p className="text-primary truncate text-sm">
                {form.seoTitle || form.name || 'Product name'}
              </p>
              <p className="text-success truncate text-xs">
                yourwebsite.com/production/{slugValue || '…'}
              </p>
              <p className="text-fg-muted line-clamp-2 text-xs">
                {form.seoDescription || form.summary || 'Your summary will appear here.'}
              </p>
            </div>
            <Field
              label="SEO title"
              aside={`${form.seoTitle.length}/70`}
              hint="Leave empty to use the name."
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
          </FormPanel>

          <p className="text-fg-subtle flex items-center gap-2 px-1 text-xs">
            <ClipboardList size={14} aria-hidden />
            {form.images.length} images · {form.sizes.length} sizes · {form.colors.length} colours
          </p>
        </aside>
      </div>

      <ConfirmDialog
        open={leaveOpen}
        title="Discard unsaved changes?"
        message="You have changes that have not been saved. If you leave now, they will be lost."
        confirmLabel="Discard changes"
        tone="danger"
        onConfirm={() => router.push('/dashboard/products')}
        onCancel={() => setLeaveOpen(false)}
      />
    </div>
  );
}
