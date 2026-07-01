"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Write description here...",
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="h-44 w-full bg-[#1A1D26] border border-white/5 rounded-2xl flex items-center justify-center text-xs text-muted-foreground">
        Loading rich text editor...
      </div>
    );
  }

  const buttons = [
    {
      icon: Bold,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
    },
    {
      icon: Italic,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
    },
    {
      icon: Code,
      title: "Code block",
      action: () => editor.chain().focus().toggleCode().run(),
      active: editor.isActive("code"),
    },
    {
      icon: Heading1,
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: Heading2,
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: List,
      title: "Bullet list",
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
    },
    {
      icon: ListOrdered,
      title: "Ordered list",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
    },
    {
      icon: Quote,
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
    },
  ];

  return (
    <div className={cn("border border-white/5 rounded-2xl overflow-hidden bg-flownexa-surface font-sans", className)}>
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-zinc-950/40 border-b border-white/5 select-none">
        {buttons.map((btn, idx) => (
          <Button
            key={idx}
            type="button"
            variant="ghost"
            size="xs"
            onClick={btn.action}
            title={btn.title}
            className={cn(
              "size-7 p-0 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors cursor-pointer",
              btn.active && "bg-flownexa-lime-muted text-flownexa-lime hover:bg-flownexa-lime-muted hover:text-flownexa-lime"
            )}
          >
            <btn.icon size={13} />
          </Button>
        ))}

        <div className="w-px h-4 bg-white/10 mx-1.5" />

        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
          className="size-7 p-0 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-20"
        >
          <Undo size={13} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
          className="size-7 p-0 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-20"
        >
          <Redo size={13} />
        </Button>
      </div>

      {/* Editor Canvas */}
      <div className="p-4 min-h-[160px] text-xs text-white leading-relaxed focus:outline-none select-text">
        <EditorContent
          editor={editor}
          className="prose prose-invert prose-xs max-w-none focus:outline-none min-h-[120px] *:focus:outline-none"
        />
      </div>
    </div>
  );
}
