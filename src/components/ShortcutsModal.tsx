import { useEffect, useCallback } from 'react';
import { XIcon } from './Icons';

interface Shortcut {
  keys: string;
  description: string;
  category: string;
}

const SHORTCUTS: Shortcut[] = [
  // Editing
  { keys: 'Ctrl+B', description: 'Bold', category: 'Editing' },
  { keys: 'Ctrl+I', description: 'Italic', category: 'Editing' },
  { keys: 'Ctrl+Shift+S', description: 'Strikethrough', category: 'Editing' },
  { keys: 'Ctrl+`', description: 'Inline code', category: 'Editing' },
  { keys: 'Ctrl+K', description: 'Insert link', category: 'Editing' },
  { keys: 'Ctrl+Shift+K', description: 'Insert image', category: 'Editing' },
  { keys: 'Ctrl+1', description: 'Heading 1', category: 'Editing' },
  { keys: 'Ctrl+2', description: 'Heading 2', category: 'Editing' },
  { keys: 'Ctrl+3', description: 'Heading 3', category: 'Editing' },
  { keys: 'Tab', description: 'Indent (2 spaces)', category: 'Editing' },
  { keys: 'Shift+Tab', description: 'Unindent', category: 'Editing' },
  { keys: 'Ctrl+Z', description: 'Undo', category: 'Editing' },
  { keys: 'Ctrl+Y / Ctrl+Shift+Z', description: 'Redo', category: 'Editing' },

  // Actions
  { keys: 'Ctrl+S', description: 'Download .md file', category: 'Actions' },
  { keys: 'Ctrl+Shift+C', description: 'Copy HTML', category: 'Actions' },
  { keys: 'Ctrl+Shift+X', description: 'Clear editor', category: 'Actions' },

  // View
  { keys: 'Ctrl+Shift+E', description: 'Editor fullscreen', category: 'View' },
  { keys: 'Ctrl+Shift+P', description: 'Preview fullscreen', category: 'View' },
  { keys: 'Esc', description: 'Exit fullscreen / Close modal', category: 'View' },

  // Help
  { keys: '? / Ctrl+/', description: 'Show this help', category: 'Help' },
];

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // Group shortcuts by category
  const categories = [...new Set(SHORTCUTS.map(s => s.category))];

  return (
    <div className="shortcuts-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="shortcuts-title">
      <div className="shortcuts-modal" onClick={e => e.stopPropagation()}>
        <header className="shortcuts-modal-header">
          <h2 id="shortcuts-title">Keyboard Shortcuts</h2>
          <button
            type="button"
            className="shortcuts-modal-close"
            onClick={onClose}
            aria-label="Close shortcuts modal"
          >
            <XIcon size={20} />
          </button>
        </header>
        <div className="shortcuts-modal-content">
          {categories.map(category => (
            <div key={category} className="shortcuts-category">
              <h3 className="shortcuts-category-title">{category}</h3>
              <div className="shortcuts-list">
                {SHORTCUTS
                  .filter(s => s.category === category)
                  .map((shortcut, index) => (
                    <div key={index} className="shortcut-item">
                      <kbd className="shortcut-keys">{shortcut.keys}</kbd>
                      <span className="shortcut-description">{shortcut.description}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <footer className="shortcuts-modal-footer">
          <p>Press <kbd>?</kbd> or <kbd>Ctrl+/</kbd> to toggle this help</p>
        </footer>
      </div>
    </div>
  );
}