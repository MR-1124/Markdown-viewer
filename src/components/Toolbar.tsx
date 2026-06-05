import type { ToolbarButton } from '../types';
import { ClipboardIcon, DownloadIcon, ClearIcon } from './Icons';

interface ToolbarProps {
  buttons: ToolbarButton[];
  onInsert: (prefix: string, suffix: string) => void;
  onAction: (action: string) => void;
}

export function Toolbar({ buttons, onInsert, onAction }: ToolbarProps) {
  return (
    <div className="toolbar" role="toolbar" aria-label="Markdown formatting">
      <div className="toolbar-group">
        {buttons.map((btn) => (
          <button
            key={btn.title}
            type="button"
            className="toolbar-btn"
            onClick={() => {
              if (btn.action) {
                onAction(btn.action);
              } else {
                onInsert(btn.prefix, btn.suffix);
              }
            }}
            title={`${btn.title}${btn.shortcut ? ` (${btn.shortcut})` : ''}`}
            aria-label={btn.title}
          >
            {btn.icon ?? btn.label}
          </button>
        ))}
      </div>
      <div className="toolbar-group toolbar-actions">
        <button
          type="button"
          className="toolbar-btn toolbar-btn-action"
          onClick={() => onAction('copy')}
          title="Copy HTML (Ctrl+Shift+C)"
          aria-label="Copy rendered HTML"
        >
          <ClipboardIcon size={16} style={{marginRight: '6px'}} />
          Copy HTML
        </button>
        <button
          type="button"
          className="toolbar-btn toolbar-btn-action"
          onClick={() => onAction('download')}
          title="Download .md file (Ctrl+S)"
          aria-label="Download markdown file"
        >
          <DownloadIcon size={16} style={{marginRight: '6px'}} />
          Download
        </button>
        <button
          type="button"
          className="toolbar-btn toolbar-btn-action"
          onClick={() => onAction('clear')}
          title="Clear editor (Ctrl+Shift+X)"
          aria-label="Clear editor"
        >
          <ClearIcon size={16} style={{marginRight: '6px'}} />
          Clear
        </button>
      </div>
    </div>
  );
}