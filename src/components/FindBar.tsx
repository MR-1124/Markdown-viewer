import { useState, useEffect, useRef, useCallback } from 'react';
import { XIcon } from './Icons';

interface FindBarProps {
  isVisible: boolean;
  onClose: () => void;
  onFind: (query: string, direction: 'next' | 'prev') => void;
  onReplace: (query: string, replacement: string, replaceAll: boolean) => void;
  matchCount: number;
  currentMatch: number;
}

export function FindBar({ isVisible, onClose, onFind, onReplace, matchCount, currentMatch }: FindBarProps) {
  const [query, setQuery] = useState('');
  const [replacement, setReplacement] = useState('');
  const [showReplace, setShowReplace] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const queryRef = useRef(query);
  const replacementRef = useRef(replacement);

  queryRef.current = query;
  replacementRef.current = replacement;

  const inputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Focus input when visible
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [isVisible]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (!isVisible) return;

      // Close on Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Toggle replace mode with Ctrl+H
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setShowReplace(prev => !prev);
        return;
      }

      // Find next/previous
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          onFind(queryRef.current, 'prev');
        } else {
          onFind(queryRef.current, 'next');
        }
      }

      // Replace
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          onReplace(queryRef.current, replacementRef.current, true);
        } else {
          onReplace(queryRef.current, replacementRef.current, false);
        }
      }

      // Toggle options
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        setCaseSensitive(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        setWholeWord(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        setUseRegex(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onFind, onReplace, onClose]);

  const handleFind = useCallback((direction: 'next' | 'prev') => {
    onFind(query, direction);
  }, [query, onFind]);

  const handleReplace = useCallback((replaceAll: boolean) => {
    onReplace(query, replacement, replaceAll);
  }, [query, replacement, onReplace]);

  if (!isVisible) return null;

  return (
    <div className="find-bar" role="search" aria-label="Find and replace">
      <div className="find-bar-inputs">
        <div className="find-input-wrapper">
          <label htmlFor="find-input" className="find-label">Find</label>
          <input
            ref={inputRef}
            id="find-input"
            type="text"
            className="find-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search..."
            aria-label="Search query"
          />
        </div>

        {showReplace && (
          <div className="find-input-wrapper">
            <label htmlFor="replace-input" className="find-label">Replace</label>
            <input
              ref={replaceInputRef}
              id="replace-input"
              type="text"
              className="find-input"
              value={replacement}
              onChange={e => setReplacement(e.target.value)}
              placeholder="Replace with..."
              aria-label="Replacement text"
            />
          </div>
        )}
      </div>

      <div className="find-bar-options">
        <label className="find-option">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={() => setCaseSensitive(prev => !prev)}
          />
          <span className="find-option-label">Aa</span>
          <span className="find-option-tooltip">Match case (Ctrl+C)</span>
        </label>
        <label className="find-option">
          <input
            type="checkbox"
            checked={wholeWord}
            onChange={() => setWholeWord(prev => !prev)}
          />
          <span className="find-option-label">[]</span>
          <span className="find-option-tooltip">Whole word (Ctrl+W)</span>
        </label>
        <label className="find-option">
          <input
            type="checkbox"
            checked={useRegex}
            onChange={() => setUseRegex(prev => !prev)}
          />
          <span className="find-option-label">.*</span>
          <span className="find-option-tooltip">Use regex (Ctrl+R)</span>
        </label>
      </div>

      <div className="find-bar-actions">
        <button
          type="button"
          className="find-btn find-btn-prev"
          onClick={() => handleFind('prev')}
          title="Previous (Shift+Enter)"
          disabled={!query}
        >
          ↑
        </button>
        <button
          type="button"
          className="find-btn find-btn-next"
          onClick={() => handleFind('next')}
          title="Next (Enter)"
          disabled={!query}
        >
          ↓
        </button>

        {showReplace && (
          <>
            <button
              type="button"
              className="find-btn find-btn-replace"
              onClick={() => handleReplace(false)}
              title="Replace (Ctrl+Enter)"
              disabled={!query}
            >
              Replace
            </button>
            <button
              type="button"
              className="find-btn find-btn-replace-all"
              onClick={() => handleReplace(true)}
              title="Replace All (Ctrl+Shift+Enter)"
              disabled={!query}
            >
              Replace All
            </button>
          </>
        )}

        <button
          type="button"
          className="find-btn find-btn-toggle"
          onClick={() => setShowReplace(prev => !prev)}
          title={showReplace ? 'Hide replace (Ctrl+H)' : 'Show replace (Ctrl+H)'}
        >
          {showReplace ? '⌵' : '⌃'}
        </button>

        <div className="find-match-info" aria-live="polite">
          {query && matchCount > 0 ? `${currentMatch + 1} of ${matchCount}` : query ? 'No matches' : ''}
        </div>

        <button
          type="button"
          className="find-btn find-btn-close"
          onClick={onClose}
          title="Close (Esc)"
        >
          <XIcon size={16} />
        </button>
      </div>
    </div>
  );
}