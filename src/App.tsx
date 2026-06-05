import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Toolbar } from './components/Toolbar';
import Editor, { type EditorHandle } from './components/Editor';
import { Preview } from './components/Preview';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './theme/ThemeContext';
import type { ToolbarButton, PreviewerStats } from './types';
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  LinkIcon,
  ImageIcon,
  CodeIcon,
  CodeBlockIcon,
  ListBulletIcon,
  ListOrderedIcon,
  TaskListIcon,
  TableIcon,
  QuoteIcon,
  DividerIcon,
  UndoIcon,
  RedoIcon,
} from './components/Icons';
import './App.css';

// Default markdown content
const DEFAULT_MARKDOWN = `# Welcome to Markdown Previewer

Start typing in the **editor** on the left to see the live preview on the right.

## Features

- **Live preview** — updates as you type
- **Toolbar** — click buttons or use keyboard shortcuts
- **Statistics** — word, character, and line counts
- **Export** — copy HTML or download .md file
- **Dark mode** — automatic based on system preference

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Ctrl+B\` | Bold (**text**) |
| \`Ctrl+I\` | Italic (_text_) |
| \`Ctrl+K\` | Link ([text](url)) |
| \`Ctrl+\`\`\` | Inline code (\`code\`) |
| \`Tab\` | Indent (2 spaces) |
| \`Ctrl+Shift+C\` | Copy HTML |
| \`Ctrl+S\` | Download .md |
| \`Ctrl+Shift+X\` | Clear editor |

## Markdown Elements

### Headers
# H1
## H2
### H3

### Text Styling
**Bold** | *Italic* | ***Bold & Italic*** | \`Inline code\` | ~~Strikethrough~~

### Lists
- Unordered item 1
- Unordered item 2
  - Nested item
  - Nested item

1. Ordered item 1
2. Ordered item 2

### Code Blocks

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet('World');
\`\`\`

### Blockquotes

> "The best way to predict the future is to invent it."
> — Alan Kay

### Tables

| Feature | Supported |
|---------|-----------|
| Tables  | ✅ Yes    |
| Math    | ❌ No     |
| Mermaid | ❌ No     |

### Task Lists

- [x] Learn React
- [x] Build a project
- [ ] Deploy to production

### Horizontal Rule

---

*Happy writing!* 🎉`;

// Toolbar button definitions
const TOOLBAR_BUTTONS: ToolbarButton[] = [
  { label: 'B', prefix: '**', suffix: '**', shortcut: 'Ctrl+B', title: 'Bold', icon: <BoldIcon /> },
  { label: 'I', prefix: '_', suffix: '_', shortcut: 'Ctrl+I', title: 'Italic', icon: <ItalicIcon /> },
  { label: 'S', prefix: '~~', suffix: '~~', shortcut: 'Ctrl+Shift+S', title: 'Strikethrough', icon: <StrikethroughIcon /> },
  { label: 'H1', prefix: '# ', suffix: '', shortcut: 'Ctrl+1', title: 'Heading 1', icon: <Heading1Icon /> },
  { label: 'H2', prefix: '## ', suffix: '', shortcut: 'Ctrl+2', title: 'Heading 2', icon: <Heading2Icon /> },
  { label: 'H3', prefix: '### ', suffix: '', shortcut: 'Ctrl+3', title: 'Heading 3', icon: <Heading3Icon /> },
  { label: '🔗', prefix: '[', suffix: '](url)', shortcut: 'Ctrl+K', title: 'Link', icon: <LinkIcon /> },
  { label: '🖼️', prefix: '![', suffix: '](url)', title: 'Image', icon: <ImageIcon /> },
  { label: '💻', prefix: '`', suffix: '`', shortcut: 'Ctrl+`', title: 'Inline Code', icon: <CodeIcon /> },
  { label: '{}', prefix: '```\n', suffix: '\n```', title: 'Code Block', icon: <CodeBlockIcon /> },
  { label: '•', prefix: '- ', suffix: '', title: 'Bullet List', icon: <ListBulletIcon /> },
  { label: '1.', prefix: '1. ', suffix: '', title: 'Numbered List', icon: <ListOrderedIcon /> },
  { label: '☑', prefix: '- [ ] ', suffix: '', title: 'Task List', icon: <TaskListIcon /> },
  { label: '⊞', prefix: '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n', suffix: '', title: 'Table', icon: <TableIcon /> },
  { label: '> ', prefix: '> ', suffix: '', title: 'Blockquote', icon: <QuoteIcon /> },
  { label: '—', prefix: '\n---\n', suffix: '', title: 'Horizontal Rule', icon: <DividerIcon /> },
  { label: '↶', prefix: '', suffix: '', shortcut: 'Ctrl+Z', title: 'Undo', icon: <UndoIcon />, action: 'undo' },
  { label: '↷', prefix: '', suffix: '', shortcut: 'Ctrl+Y', title: 'Redo', icon: <RedoIcon />, action: 'redo' },
];

export default function App() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [isFullscreen, setIsFullscreen] = useState<'editor' | 'preview' | null>(null);
  const editorRef = useRef<EditorHandle>(null);

  // Compute stats
  const stats = useMemo<PreviewerStats>(() => {
    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    const characters = markdown.length;
    const lines = markdown.split('\n').length;
    return { words, characters, lines };
  }, [markdown]);

  // Handle toolbar insert
  const handleInsert = useCallback((prefix: string, suffix: string) => {
    setMarkdown((prev) => {
      // In a real app, you'd want to insert at cursor position
      // For simplicity, we'll append at the end
      return prev + prefix + suffix;
    });
  }, []);

  // Handle toolbar actions
  const handleAction = useCallback((action: string) => {
    switch (action) {
      case 'copy': {
        // We'll implement copy HTML via a separate mechanism
        const htmlContent = document.querySelector('.preview-content')?.innerHTML || '';
        navigator.clipboard.writeText(htmlContent).then(() => {
          // Could show a toast notification here
          console.log('HTML copied to clipboard');
        });
        break;
      }
      case 'download': {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        a.click();
        URL.revokeObjectURL(url);
        break;
      }
      case 'clear': {
        if (confirm('Clear all content? This cannot be undone.')) {
          setMarkdown('');
        }
        break;
      }
      case 'undo': {
        editorRef.current?.undo();
        break;
      }
      case 'redo': {
        editorRef.current?.redo();
        break;
      }
    }
  }, [markdown]);

  // Keyboard shortcuts for fullscreen toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        if (e.key === 'E') {
          e.preventDefault();
          setIsFullscreen((prev) => (prev === 'editor' ? null : 'editor'));
        } else if (e.key === 'P') {
          e.preventDefault();
          setIsFullscreen((prev) => (prev === 'preview' ? null : 'preview'));
        }
      }
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Handle heading shortcuts (Ctrl+1, Ctrl+2, Ctrl+3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          handleInsert('# ', '');
        } else if (e.key === '2') {
          e.preventDefault();
          handleInsert('## ', '');
        } else if (e.key === '3') {
          e.preventDefault();
          handleInsert('### ', '');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInsert]);

  return (
    <ThemeProvider>
      <div className="app">
        <header className="app-header">
          <h1>📝 Markdown Previewer</h1>
          <div className="header-actions">
            <ThemeToggle />
            <div className="header-hints">
              <kbd>Ctrl+Shift+E</kbd> Editor fullscreen
              <kbd>Ctrl+Shift+P</kbd> Preview fullscreen
              <kbd>Esc</kbd> Exit fullscreen
            </div>
          </div>
        </header>

        <Toolbar buttons={TOOLBAR_BUTTONS} onInsert={handleInsert} onAction={handleAction} />

        <main className={`main-content ${isFullscreen ? `fullscreen-${isFullscreen}` : ''}`}>
          {!isFullscreen || isFullscreen === 'editor' ? (
            <Editor
              ref={editorRef}
              value={markdown}
              onChange={setMarkdown}
              stats={stats}
            />
          ) : null}

          {!isFullscreen || isFullscreen === 'preview' ? (
            <Preview markdown={markdown} />
          ) : null}
        </main>

        <footer className="app-footer">
          <p>Built with React + TypeScript + Vite | <a href="https://github.com/markedjs/marked" target="_blank" rel="noopener">marked</a> + <a href="https://github.com/cure53/DOMPurify" target="_blank" rel="noopener">DOMPurify</a></p>
        </footer>
      </div>
    </ThemeProvider>
  );
}