import { useRef, useCallback } from 'react';
import type { PreviewerStats } from '../types';
import type { KeyboardEvent, ChangeEvent } from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  stats: PreviewerStats;
  placeholder?: string;
}

export function Editor({ value, onChange, stats, placeholder = 'Start writing markdown...' }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Insert text at cursor position
  const insertAtCursor = useCallback((prefix: string, suffix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value: currentValue } = textarea;
    const selectedText = currentValue.substring(selectionStart, selectionEnd);
    const beforeText = currentValue.substring(0, selectionStart);
    const afterText = currentValue.substring(selectionEnd);

    // If text is selected, wrap it; otherwise insert prefix+suffix with cursor between
    let newValue: string;
    let newCursorPos: number;

    if (selectedText) {
      newValue = beforeText + prefix + selectedText + suffix + afterText;
      newCursorPos = selectionStart + prefix.length + selectedText.length + suffix.length;
    } else {
      newValue = beforeText + prefix + suffix + afterText;
      newCursorPos = selectionStart + prefix.length;
    }

    onChange(newValue);

    // Restore cursor position after state update
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    });
  }, [onChange]);

  // Handle tab key for indentation
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.currentTarget;
      const newValue = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);
      onChange(newValue);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = selectionStart + 2;
          textareaRef.current.selectionEnd = selectionStart + 2;
        }
      });
    }
  }, [value, onChange]);

  // Handle markdown shortcuts
  const handleShortcuts = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && !e.altKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          insertAtCursor('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertAtCursor('_', '_');
          break;
        case 'k':
          e.preventDefault();
          insertAtCursor('[', '](url)');
          break;
        case '`':
          e.preventDefault();
          insertAtCursor('`', '`');
          break;
        case '1':
          e.preventDefault();
          insertAtCursor('# ', '');
          break;
        case '2':
          e.preventDefault();
          insertAtCursor('## ', '');
          break;
        case '3':
          e.preventDefault();
          insertAtCursor('### ', '');
          break;
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
      switch (e.key.toLowerCase()) {
        case 'x':
          e.preventDefault();
          onChange('');
          break;
      }
    }
  }, [insertAtCursor, onChange]);

  return (
    <div className="editor-pane">
      <div className="pane-header">
        <h2>Editor</h2>
        <div className="stats">
          <span title="Words">{stats.words} words</span>
          <span title="Characters">{stats.characters} chars</span>
          <span title="Lines">{stats.lines} lines</span>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        onKeyDown={(e) => {
          handleKeyDown(e);
          handleShortcuts(e);
        }}
        placeholder={placeholder}
        spellCheck={false}
        aria-label="Markdown editor"
      />
    </div>
  );
}