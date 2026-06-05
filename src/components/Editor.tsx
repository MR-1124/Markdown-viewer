import { useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import type { PreviewerStats } from '../types';
import type { KeyboardEvent, ChangeEvent } from 'react';

export interface EditorHandle {
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  stats: PreviewerStats;
  placeholder?: string;
}

const Editor = forwardRef<EditorHandle, EditorProps>(({ value, onChange, stats, placeholder = 'Start writing markdown...' }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const historyRef = useRef<string[]>([value]);
  const historyIndexRef = useRef(0);
  const isInternalChangeRef = useRef(false);

  // Initialize history with current value if it's different
  if (historyRef.current[historyIndexRef.current] !== value && !isInternalChangeRef.current) {
    // Value changed externally (e.g., clear), reset history
    historyRef.current = [value];
    historyIndexRef.current = 0;
  }

  // Push new value to history (for undo/redo)
  const pushHistory = useCallback((newValue: string) => {
    if (isInternalChangeRef.current) return;

    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(newValue);
    historyRef.current = newHistory.slice(-50); // Keep last 50 states
    historyIndexRef.current = Math.min(historyIndexRef.current + 1, 49);
  }, []);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      const newIndex = historyIndexRef.current - 1;
      historyIndexRef.current = newIndex;
      const previousValue = historyRef.current[newIndex];
      isInternalChangeRef.current = true;
      onChange(previousValue);
      isInternalChangeRef.current = false;
    }
  }, [onChange]);

  // Handle redo
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      const newIndex = historyIndexRef.current + 1;
      historyIndexRef.current = newIndex;
      const nextValue = historyRef.current[newIndex];
      isInternalChangeRef.current = true;
      onChange(nextValue);
      isInternalChangeRef.current = false;
    }
  }, [onChange]);

  const canUndo = useCallback(() => historyIndexRef.current > 0, []);
  const canRedo = useCallback(() => historyIndexRef.current < historyRef.current.length - 1, []);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
  }), [handleUndo, handleRedo, canUndo, canRedo]);

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
    pushHistory(newValue);

    // Restore cursor position after state update
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    });
  }, [onChange, pushHistory]);

  // Handle tab key for indentation
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.currentTarget;
      const newValue = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);
      onChange(newValue);
      pushHistory(newValue);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = selectionStart + 2;
          textareaRef.current.selectionEnd = selectionStart + 2;
        }
      });
    }
  }, [value, onChange, pushHistory]);

  // Handle markdown shortcuts
  const handleShortcuts = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey) {
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
        case 'z':
          e.preventDefault();
          handleUndo();
          break;
        case 'y':
          e.preventDefault();
          handleRedo();
          break;
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
      switch (e.key.toLowerCase()) {
        case 'x':
          e.preventDefault();
          const cleared = '';
          onChange(cleared);
          pushHistory(cleared);
          break;
        case 's':
          e.preventDefault();
          insertAtCursor('~~', '~~');
          break;
        case 'z':
          e.preventDefault();
          handleRedo();
          break;
      }
    }
  }, [insertAtCursor, onChange, handleUndo, handleRedo, pushHistory]);

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
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          const newValue = e.target.value;
          onChange(newValue);
          pushHistory(newValue);
        }}
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
});

Editor.displayName = 'Editor';

export default Editor;