import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

export default function MarkdownRenderer({
  content,
}: {
  content: string;
}) {
  return (
    <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:overflow-x-auto prose-img:rounded-xl prose-img:mx-auto prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-strong:text-foreground prose-li:my-0.5 prose-table:border-collapse prose-table:border prose-table:border-border prose-th:border prose-th:border-border prose-th:bg-secondary prose-th:p-3 prose-td:border prose-td:border-border prose-td:p-3">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code block (fenced code with ```)
          code({ className, children, ...props }) {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }
            // Remove the "language-" prefix from the class
            const language = className?.replace("language-", "") || "";
            return (
              <pre className="bg-secondary border border-border rounded-lg p-4 overflow-x-auto my-4">
                {language && (
                  <div className="text-xs text-muted-foreground mb-2 font-mono uppercase tracking-wider">
                    {language}
                  </div>
                )}
                <code className={`block text-sm font-mono leading-relaxed ${className || ""}`} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          // Headings with proper styling
          h1({ children, ...props }) {
            return <h1 className="text-4xl font-bold tracking-tight mt-10 mb-4 text-foreground" {...props}>{children}</h1>;
          },
          h2({ children, ...props }) {
            return <h2 className="text-3xl font-bold tracking-tight mt-8 mb-3 text-foreground" {...props}>{children}</h2>;
          },
          h3({ children, ...props }) {
            return <h3 className="text-2xl font-bold tracking-tight mt-6 mb-2 text-foreground" {...props}>{children}</h3>;
          },
          h4({ children, ...props }) {
            return <h4 className="text-xl font-semibold tracking-tight mt-5 mb-2 text-foreground" {...props}>{children}</h4>;
          },
          // Links
          a({ children, href, ...props }) {
            return (
              <a
                href={href}
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-primary hover:underline transition-colors"
                {...props}
              >
                {children}
              </a>
            );
          },
          // Images
          img({ src, alt, ...props }) {
            return (
              <img
                src={src}
                alt={alt || ""}
                className="rounded-xl my-6 mx-auto max-w-full h-auto shadow-sm"
                loading="lazy"
                {...props}
              />
            );
          },
          // Blockquotes
          blockquote({ children, ...props }) {
            return (
              <blockquote
                className="border-l-4 border-l-primary bg-secondary/30 pl-4 py-2 pr-4 my-6 rounded-r-lg italic text-muted-foreground"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          // Tables
          table({ children, ...props }) {
            return (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border-collapse border border-border rounded-lg" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          th({ children, ...props }) {
            return (
              <th className="border border-border bg-secondary px-4 py-3 text-left font-semibold text-foreground" {...props}>
                {children}
              </th>
            );
          },
          td({ children, ...props }) {
            return (
              <td className="border border-border px-4 py-3 text-foreground/90" {...props}>
                {children}
              </td>
            );
          },
          // Lists
          ul({ children, ...props }) {
            return <ul className="list-disc pl-6 my-4 space-y-1 text-foreground/90" {...props}>{children}</ul>;
          },
          ol({ children, ...props }) {
            return <ol className="list-decimal pl-6 my-4 space-y-1 text-foreground/90" {...props}>{children}</ol>;
          },
          li({ children, ...props }) {
            return <li className="marker:text-muted-foreground" {...props}>{children}</li>;
          },
          // Paragraphs
          p({ children, ...props }) {
            return <p className="leading-relaxed my-4 text-foreground/90" {...props}>{children}</p>;
          },
          // Horizontal rule
          hr() {
            return <hr className="my-8 border-border" />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}