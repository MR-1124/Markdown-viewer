# Markdown Live Previewer — Project Overview

## 📋 Project Summary

A **Markdown Live Previewer** built with **React 18 + TypeScript + Vite**, featuring a split-pane editor/preview, cursor-aware toolbar, syntax highlighting, and a multi-theme system.

**Created:** 2026-06-05  
**Stack:** React 18, TypeScript, Vite, marked, DOMPurify, highlight.js  
**Target:** Beginner-friendly developer tool for learning React fundamentals

---

## 🏗️ Architecture

```
src/
├── main.tsx                 # Entry point
├── App.tsx                  # Main app component (state, layout, providers)
├── index.css                # Global styles + CSS variable themes
├── App.css                  # Component-specific styles
├── types.ts                 # TypeScript interfaces
├── components/
│   ├── Editor.tsx           # Markdown textarea with cursor-aware insertion
│   ├── Preview.tsx          # Live markdown rendering + syntax highlighting
│   ├── Toolbar.tsx          # Formatting toolbar with SVG icons
│   ├── Icons.tsx            # 17 SVG icon components
│   ├── ThemeToggle.tsx      # Theme selector dropdown
│   └── index.ts             # Barrel exports (optional)
└── theme/
    └── ThemeContext.tsx     # Theme state + localStorage persistence
```

---

## ✨ Implemented Features

### 1. Split-Pane Layout
- **Editor** (left): Markdown textarea with line numbers, stats
- **Preview** (right): Real-time HTML rendering
- **Responsive**: Stacks vertically on mobile (< 900px)
- **Fullscreen modes**: 
  - `Ctrl+Shift+E` — Editor only
  - `Ctrl+Shift+P` — Preview only
  - `Esc` — Exit fullscreen

### 2. Cursor-Aware Toolbar Insertion
**File:** `src/components/Editor.tsx`

The toolbar inserts markdown **at the cursor position** (not appending to end):
- If text is **selected** → wraps selection with prefix/suffix
- If **no selection** → inserts prefix+suffix with cursor positioned between them
- Uses `requestAnimationFrame` for reliable cursor restoration after React state update

**Toolbar Buttons (16):**
| Button | Prefix | Suffix | Shortcut | Action |
|--------|--------|--------|----------|--------|
| **Bold** | `**` | `**` | `Ctrl+B` | Bold text |
| **Italic** | `_` | `_` | `Ctrl+I` | Italic text |
| **H1** | `# ` | `` | `Ctrl+1` | Heading 1 |
| **H2** | `## ` | `` | `Ctrl+2` | Heading 2 |
| **H3** | `### ` | `` | `Ctrl+3` | Heading 3 |
| **Link** | `[` | `](url)` | `Ctrl+K` | Insert link |
| **Image** | `![` | `](url)` | — | Insert image |
| **Inline Code** | `` ` `` | `` ` `` | `Ctrl+\`` | Inline code |
| **Code Block** | ```\n` | `\n``` | — | Fenced code block |
| **Bullet List** | `- ` | `` | — | Unordered list |
| **Numbered List** | `1. ` | `` | — | Ordered list |
| **Task List** | `- [ ] ` | `` | — | Checkbox list |
| **Blockquote** | `> ` | `` | — | Quote |
| **Divider** | `\n---\n` | `` | — | Horizontal rule |

### 3. Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+K` | Link |
| `Ctrl+\`` | Inline code |
| `Ctrl+1/2/3` | Heading 1/2/3 |
| `Tab` | Indent (2 spaces) |
| `Ctrl+Shift+E` | Editor fullscreen |
| `Ctrl+Shift+P` | Preview fullscreen |
| `Esc` | Exit fullscreen |
| `Ctrl+Shift+X` | Clear editor |
| `Ctrl+S` | Download .md (browser default) |

### 4. Live Statistics
Real-time counts in editor header:
- **Words** — split by whitespace
- **Characters** — total length
- **Lines** — newline count

### 5. Syntax Highlighting
**File:** `src/components/Preview.tsx`

- **Library:** `highlight.js` (GitHub theme)
- **Integration:** `marked` highlighter option + post-render `hljs.highlightElement()`
- **Languages:** Auto-detects + supports 190+ languages
- **Security:** DOMPurify allows `class` attribute for highlight.js CSS classes

### 6. Theme System (4 Themes)
**Files:** `src/index.css`, `src/theme/ThemeContext.tsx`, `src/components/ThemeToggle.tsx`

| Theme | Description | Colors |
|-------|-------------|--------|
| **Light** | Clean default | Purple accent (`#aa3bff`) |
| **Dark** | System dark mode | Light purple (`#c084fc`) |
| **GitHub** | GitHub-inspired | Blue accent (`#0969da`) |
| **Sepura** | Paper/reading mode | Warm amber (`#b85c2a`), serif fonts |

**Features:**
- **Persistence:** `localStorage` key `markdown-previewer-theme`
- **System detection:** Respects `prefers-color-scheme` if no explicit choice
- **Dropdown UI:** Click theme button → dropdown with all 4 options
- **CSS Variables:** All theming via `--text`, `--bg`, `--accent`, etc.

### 7. Export & Actions
- **Copy HTML** — Copies rendered preview HTML to clipboard
- **Download .md** — Saves current markdown as `document.md`
- **Clear Editor** — Confirmation dialog, then resets to empty

### 8. Default Content
Comprehensive markdown showcase demonstrating:
- Headings (H1–H3)
- Text styling (bold, italic, strikethrough, inline code)
- Lists (unordered, ordered, nested, task lists)
- Code blocks (with language)
- Blockquotes
- Tables
- Horizontal rules

---

## 🔧 Technical Details

### State Management
- **App-level:** `markdown` (string), `isFullscreen` (null | 'editor' | 'preview')
- **Theme:** Context + `localStorage` (no prop drilling)
- **Stats:** Computed via `useMemo` from markdown string

### Security
- **DOMPurify** sanitizes all rendered HTML
- Allowed tags: `details`, `summary` (for GFM)
- Allowed attributes: `open`, `class` (for syntax highlighting)

### Accessibility
- Semantic HTML (`header`, `main`, `footer`, `toolbar[role]`)
- `aria-label` on all icon-only buttons
- `aria-selected` on active theme dropdown item
- Focus-visible outlines on all interactive elements
- Keyboard navigable toolbar and theme dropdown

### Performance
- `useCallback` for event handlers
- `useMemo` for stats computation
- `requestAnimationFrame` for cursor restoration
- Code-splitting warning (highlight.js bundles all languages)

---

## 📦 Dependencies

### Production
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 18.x | UI framework |
| `react-dom` | 18.x | DOM renderer |
| `marked` | 14.x | Markdown parser |
| `dompurify` | 3.x | HTML sanitizer |
| `highlight.js` | 11.x | Syntax highlighter |

### Development
| Package | Purpose |
|---------|---------|
| `vite` | Build tool + dev server |
| `typescript` | Type checking |
| `@types/dompurify` | Type definitions |
| `eslint` | Linting |

---

## 🚀 Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:5173

# Production
npm run build        # Type-check + build to dist/
npm run preview      # Preview production build locally

# Type checking only
npx tsc --noEmit
```

---

## 🎯 Learning Outcomes (Beginner-Friendly)

This project teaches:

1. **React Fundamentals**
   - Controlled components (`value` + `onChange`)
   - `useState`, `useRef`, `useEffect`, `useCallback`, `useMemo`
   - Context API for global state (theme)

2. **TypeScript**
   - Interface/type definitions
   - Generic types (`ReactNode`, `KeyboardEvent`)
   - `import type` for verbatimModuleSyntax

3. **DOM Interaction**
   - `selectionStart/End` for cursor position
   - `setSelectionRange` for programmatic selection
   - Clipboard API (`navigator.clipboard.writeText`)

4. **CSS Architecture**
   - CSS custom properties for theming
   - `[data-theme]` attribute selectors
   - Responsive grid/flex layouts
   - Print stylesheet

5. **Security**
   - XSS prevention via DOMPurify
   - Sanitization allow-lists

6. **Build Tools**
   - Vite config, TypeScript config
   - Production builds, chunk analysis

---

## 🔮 Future Enhancements (Ideas)

| Priority | Feature | Effort |
|----------|---------|--------|
| High | Auto-save to localStorage | Low |
| High | Search/Replace (Ctrl+F/H) | Medium |
| Medium | PDF Export (pdf-lib) | Medium |
| Medium | Table Editor Modal | Medium |
| Medium | Image Paste → Base64/Upload | High |
| Low | Vim/Emacs Keybindings | High |
| Low | Collaborative Editing (Yjs) | Very High |
| Low | PWA + Offline Support | Medium |

---

## 📝 Session Log

### 2026-06-05 — Initial Build + Enhancements
1. **Scaffolded** Vite React TypeScript project
2. **Installed** `marked`, `dompurify`, `highlight.js`
3. **Built** split-pane layout with Editor/Preview components
4. **Added** toolbar with 16 formatting buttons
5. **Implemented** cursor-aware insertion (wraps selection or inserts at cursor)
6. **Added** keyboard shortcuts (Ctrl+B/I/K/`, Ctrl+1/2/3, Tab)
7. **Integrated** highlight.js for syntax highlighting in code blocks
8. **Created** 17 SVG icons (replaced emojis)
9. **Built** theme system: 4 themes + localStorage + system detection
10. **Added** ThemeToggle dropdown component
11. **Configured** CSS variables for all themes (light/dark/github/sepura)
12. **Verified** production build succeeds

---

## 📄 License

MIT — Feel free to use, modify, and learn from this project.