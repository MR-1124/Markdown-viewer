import { useRef, useCallback, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import type { PreviewerStats } from '../types';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { FindBar } from './FindBar';

export interface EditorHandle {
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  insertAtCursor: (prefix: string, suffix: string) => void;
  find: (query: string, direction: 'next' | 'prev') => void;
  replace: (query: string, replacement: string, replaceAll: boolean) => void;
  setFindVisible: (visible: boolean) => void;
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

  // Find/Replace state
  const [findVisible, setFindVisible] = useState(false);
  const [findMatches, setFindMatches] = useState<number[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);

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

  // Find/Replace functionality
  const computeMatches = useCallback((text: string, query: string) => {
    if (!query) return [];
    const matches: number[] = [];
    const flags = 'g';
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match.index);
      if (match.index === regex.lastIndex) regex.lastIndex++;
    }
    return matches;
  }, []);

  const updateMatches = useCallback((query: string) => {
    const matches = computeMatches(value, query);
    setFindMatches(matches);
    setCurrentMatchIndex(matches.length > 0 ? 0 : -1);
  }, [value, computeMatches]);

  const find = useCallback((query: string, direction: 'next' | 'prev') => {
    if (!query) return;
    updateMatches(query);
    if (findMatches.length === 0) return;

    let newIndex = currentMatchIndex;
    if (direction === 'next') {
      newIndex = (currentMatchIndex + 1) % findMatches.length;
    } else {
      newIndex = (currentMatchIndex - 1 + findMatches.length) % findMatches.length;
    }
    setCurrentMatchIndex(newIndex);

    const textarea = textareaRef.current;
    if (textarea) {
      const pos = findMatches[newIndex];
      textarea.focus();
      textarea.setSelectionRange(pos, pos + query.length);
    }
  }, [findMatches, currentMatchIndex, updateMatches]);

  const replace = useCallback((query: string, replacement: string, replaceAll: boolean) => {
    if (!query) return;
    updateMatches(query);

    if (replaceAll) {
      let newValue = value;
      let offset = 0;
      for (const matchIndex of findMatches) {
        const adjustedIndex = matchIndex + offset;
        newValue = newValue.slice(0, adjustedIndex) + replacement + newValue.slice(adjustedIndex + query.length);
        offset += replacement.length - query.length;
      }
      onChange(newValue);
      pushHistory(newValue);
      updateMatches(query);
    } else if (currentMatchIndex >= 0 && currentMatchIndex < findMatches.length) {
      const matchIndex = findMatches[currentMatchIndex];
      const newValue = value.slice(0, matchIndex) + replacement + value.slice(matchIndex + query.length);
      onChange(newValue);
      pushHistory(newValue);
      updateMatches(query);
    }
  }, [value, findMatches, currentMatchIndex, onChange, pushHistory, updateMatches]);

  // Handle find/replace keyboard shortcuts (Ctrl+F, Ctrl+H)
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          setFindVisible(true);
        } else if (e.key.toLowerCase() === 'h') {
          e.preventDefault();
          setFindVisible(true);
        }
      }
      if (e.key === 'Escape' && findVisible) {
        setFindVisible(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [findVisible]);

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

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
    insertAtCursor,
    find,
    replace,
    setFindVisible,
  }), [handleUndo, handleRedo, canUndo, canRedo, insertAtCursor, find, replace, setFindVisible]);

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
      <FindBar
        isVisible={findVisible}
        onClose={() => setFindVisible(false)}
        onFind={find}
        onReplace={replace}
        matchCount={findMatches.length}
        currentMatch={currentMatchIndex}
      />
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