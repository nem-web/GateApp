"use client";

import { useState, useTransition } from "react";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { publishPostAction } from "./actions";
import { Loader2, Type, Tags, AlignLeft } from "lucide-react";

export default function WriteForm({ authorId }: { authorId: string }) {
  const [content, setContent] = useState("**Write your amazing GATE prep strategy here...**");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleImageUpload = async (file: File) => {
    // Replace with real upload logic (e.g., Vercel Blob, AWS S3)
    const tempUrl = URL.createObjectURL(file);
    return tempUrl; 
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.append("content", content);
    formData.append("authorId", authorId);

    startTransition(async () => {
      const result = await publishPostAction(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Error Banner */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 flex items-center">
          <span className="font-semibold mr-2">Error:</span> {error}
        </div>
      )}

      {/* Title & Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="title" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <Type size={16} className="text-blue-400" /> Post Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g., How I scored AIR 500 in GATE CS"
            className="w-full rounded-xl border border-gray-800 bg-[#0B0C10] px-4 py-3.5 text-sm text-white placeholder-gray-600 transition-all focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 shadow-inner"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <Tags size={16} className="text-blue-400" /> Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full rounded-xl border border-gray-800 bg-[#0B0C10] px-4 py-3.5 text-sm text-white transition-all focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 shadow-inner appearance-none"
          >
            <option value="Preparation Strategy">Preparation Strategy</option>
            <option value="Subject Notes">Subject Notes</option>
            <option value="PYQ Analysis">PYQ Analysis</option>
            <option value="General Discussion">General Discussion</option>
          </select>
        </div>
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <label htmlFor="excerpt" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <AlignLeft size={16} className="text-blue-400" /> Short Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={2}
          placeholder="A quick 1-2 sentence summary to hook the reader..."
          className="w-full rounded-xl border border-gray-800 bg-[#0B0C10] px-4 py-3 text-sm text-white placeholder-gray-600 transition-all focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 shadow-inner resize-y"
        />
      </div>

      {/* Markdown Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-300">Main Content</label>
          <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-md">Markdown Supported</span>
        </div>
        
        {/* Editor wrapper with dark mode styling override to fit dark theme */}
        <div data-color-mode="dark" className="rounded-xl overflow-hidden border border-gray-800 shadow-inner">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || "")}
            previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
            height={500}
            className="bg-[#0B0C10]"
            onDrop={async (e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                const imageUrl = await handleImageUpload(file);
                setContent((prev) => prev + `\n![${file.name}](${imageUrl})\n`);
              }
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="pt-6 flex items-center justify-end gap-4 border-t border-gray-800/60 mt-8">
        <a
          href="/blog"
          className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:pointer-events-none active:scale-95"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Publishing...
            </>
          ) : (
            "Publish Post"
          )}
        </button>
      </div>
    </form>
  );
}