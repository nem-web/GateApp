"use client";

import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { publishPostAction } from "./actions";

export default function WriteForm({ authorId }: { authorId: string }) {
  const [content, setContent] = useState("**Write your amazing GATE prep strategy here...**");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Advanced feature: Handling Image Uploads inside the Markdown Editor
  const handleImageUpload = async (file: File) => {
    // ⚠️ NOTE: To make this actually save images, you need a storage provider 
    // like Vercel Blob, AWS S3, or Cloudinary. 
    // For now, this creates a temporary local URL so you can see how the UI works.
    const tempUrl = URL.createObjectURL(file);
    return tempUrl; 
    
    /* REAL IMPLEMENTATION EXAMPLE (Vercel Blob):
       const formData = new FormData();
       formData.append('file', file);
       const res = await fetch('/api/upload', { method: 'POST', body: formData });
       const data = await res.json();
       return data.url; // Returns the public URL of the uploaded image
    */
  };

  return (
    <form 
      action={async (formData) => {
        setIsSubmitting(true);
        // Inject the markdown content and authorId into the form submission
        formData.append("content", content);
        formData.append("authorId", authorId);
        await publishPostAction(formData);
      }} 
      className="space-y-6"
    >
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Post Title</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="e.g., How I scored AIR 500 in GATE CS"
          className="w-full rounded-md border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">Category</label>
        <select
          id="category"
          name="category"
          className="w-full rounded-md border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="Preparation Strategy">Preparation Strategy</option>
          <option value="Subject Notes">Subject Notes</option>
          <option value="PYQ Analysis">PYQ Analysis</option>
          <option value="General Discussion">General Discussion</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="excerpt" className="text-sm font-medium">Short Excerpt (Summary)</label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={2}
          placeholder="A quick 1-2 sentence summary of what this post is about..."
          className="w-full rounded-md border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
        />
      </div>

      <div className="space-y-2" data-color-mode="light">
        <label className="text-sm font-medium dark:text-white">Main Content (Markdown Supported)</label>
        {/* The Advanced Rich Text / Markdown Editor */}
        <MDEditor
          value={content}
          onChange={(val) => setContent(val || "")}
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
          }}
          height={500}
          onDrop={async (e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              const file = e.dataTransfer.files[0];
              const imageUrl = await handleImageUpload(file);
              // Insert image markdown at the cursor
              setContent((prev) => prev + `\n![${file.name}](${imageUrl})\n`);
            }
          }}
        />
        <p className="text-xs text-muted-foreground mt-2">
          You can use Markdown, drag and drop images, or use the toolbar above to format your post.
        </p>
      </div>

      <div className="pt-4 flex items-center justify-end gap-4 border-t border-border mt-8">
        <a
          href="/blog"
          className="rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </button>
      </div>
    </form>
  );
}