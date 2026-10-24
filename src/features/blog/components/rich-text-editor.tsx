'use client';

import { useRef, useState, type ReactNode } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Heading2,
  Heading3,
  Heading4,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  SquareCode,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PROSE } from '../prose';
import { uploadImage } from '../services/upload.service';

const PLACEHOLDER_STYLE =
  '[&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:text-fg-subtle [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]';

function ToolButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // keep the text selection
      onClick={onClick}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-sm transition-colors disabled:opacity-40',
        active ? 'bg-primary text-on-fill' : 'text-fg hover:bg-surface-muted',
      )}
    >
      {children}
    </button>
  );
}

const Divider = () => <span aria-hidden className="bg-border mx-1 h-5 w-px self-center" />;

function Toolbar({ editor, onError }: { editor: Editor; onError: (m: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function setLink() {
    const previous: unknown = editor.getAttributes('link').href;
    const url = window.prompt('Link address', typeof previous === 'string' ? previous : 'https://');
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    if (!/^https?:\/\//i.test(url.trim())) {
      onError('Links must start with http:// or https://');
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  }

  async function onPickImage(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      editor.chain().focus().setImage({ src: url, alt: '' }).run();
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Image upload failed.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const c = () => editor.chain().focus();

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="border-border bg-surface-muted sticky top-(--header-height) z-10 flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5"
    >
      <ToolButton
        label="Bold"
        active={editor.isActive('bold')}
        onClick={() => c().toggleBold().run()}
      >
        <Bold size={16} />
      </ToolButton>
      <ToolButton
        label="Italic"
        active={editor.isActive('italic')}
        onClick={() => c().toggleItalic().run()}
      >
        <Italic size={16} />
      </ToolButton>
      <ToolButton
        label="Underline"
        active={editor.isActive('underline')}
        onClick={() => c().toggleUnderline().run()}
      >
        <Underline size={16} />
      </ToolButton>
      <ToolButton
        label="Strikethrough"
        active={editor.isActive('strike')}
        onClick={() => c().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </ToolButton>
      <Divider />
      <ToolButton
        label="Heading"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => c().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </ToolButton>
      <ToolButton
        label="Subheading"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => c().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={16} />
      </ToolButton>
      <ToolButton
        label="Small heading"
        active={editor.isActive('heading', { level: 4 })}
        onClick={() => c().toggleHeading({ level: 4 }).run()}
      >
        <Heading4 size={16} />
      </ToolButton>
      <Divider />
      <ToolButton
        label="Bulleted list"
        active={editor.isActive('bulletList')}
        onClick={() => c().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolButton>
      <ToolButton
        label="Numbered list"
        active={editor.isActive('orderedList')}
        onClick={() => c().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolButton>
      <ToolButton
        label="Quote"
        active={editor.isActive('blockquote')}
        onClick={() => c().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </ToolButton>
      <ToolButton
        label="Code block"
        active={editor.isActive('codeBlock')}
        onClick={() => c().toggleCodeBlock().run()}
      >
        <SquareCode size={16} />
      </ToolButton>
      <ToolButton label="Divider line" onClick={() => c().setHorizontalRule().run()}>
        <Minus size={16} />
      </ToolButton>
      <ToolButton label="Clear formatting" onClick={() => c().unsetAllMarks().clearNodes().run()}>
        <RemoveFormatting size={16} />
      </ToolButton>
      <Divider />
      <ToolButton label="Link" active={editor.isActive('link')} onClick={setLink}>
        <Link2 size={16} />
      </ToolButton>
      <ToolButton
        label="Insert image"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
      >
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
      </ToolButton>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => void onPickImage(e.target.files?.[0])}
      />
      <span className="flex-1" />
      <ToolButton label="Undo" disabled={!editor.can().undo()} onClick={() => c().undo().run()}>
        <Undo2 size={16} />
      </ToolButton>
      <ToolButton label="Redo" disabled={!editor.can().redo()} onClick={() => c().redo().run()}>
        <Redo2 size={16} />
      </ToolButton>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  onError,
}: {
  value: string;
  onChange: (html: string) => void;
  onError: (message: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      // StarterKit v3 already bundles Link and Underline; configure them here, not twice.
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true },
      }),
      ImageExtension,
      Placeholder.configure({ placeholder: 'Start writing your article…' }),
    ],
    content: value,
    editorProps: {
      attributes: {
        'aria-label': 'Article content',
        role: 'textbox',
        'aria-multiline': 'true',
        class: `min-h-[min(380px,60svh)] px-4 py-3 sm:px-5 sm:py-4 focus:outline-none ${PROSE} ${PLACEHOLDER_STYLE}`,
      },
    },
    onUpdate: ({ editor: ed }) => onChange(ed.isEmpty ? '' : ed.getHTML()),
  });

  return (
    <div className="border-border-strong bg-surface focus-within:border-primary rounded-md border">
      {editor ? (
        <Toolbar editor={editor} onError={onError} />
      ) : (
        <div className="bg-surface-muted h-12" />
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
