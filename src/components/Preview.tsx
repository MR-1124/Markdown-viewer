import { useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.min.css';

interface PreviewProps {
  markdown: string;
}

export function Preview({ markdown }: PreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current) {
      // Configure marked
      marked.setOptions({
        breaks: true,
        gfm: true,
      });

      // Parse markdown to HTML
      const html = marked.parse(markdown || '') as string;

      // Sanitize HTML for security - allow class attribute for highlight.js
      const cleanHtml = DOMPurify.sanitize(html, {
        ADD_TAGS: ['details', 'summary'],
        ADD_ATTR: ['open', 'class'],
      });

      previewRef.current.innerHTML = cleanHtml;

      // Apply syntax highlighting to code blocks
      previewRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [markdown]);

  return (
    <div className="preview-pane">
      <div className="pane-header">
        <h2>Preview</h2>
      </div>
      <div
        ref={previewRef}
        className="preview-content"
        aria-label="Markdown preview"
      />
    </div>
  );
}