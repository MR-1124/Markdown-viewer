interface IconProps {
  size?: number;
  className?: string;
  'aria-hidden'?: boolean;
}

// Icon components - all 24x24 viewBox for consistency
export function BoldIcon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  );
}

export function ItalicIcon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  );
}

export function Heading1Icon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <path d="M4 12h16" />
      <path d="M4 18V6" />
      <path d="M12 18V6" />
      <path d="M20 18V6" />
    </svg>
  );
}

export function Heading2Icon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <path d="M4 12h16" />
      <path d="M4 18V6" />
      <path d="M12 18V6" />
      <path d="M20 18V10" />
    </svg>
  );
}

export function Heading3Icon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <path d="M4 12h16" />
      <path d="M4 18V6" />
      <path d="M12 18V6" />
      <path d="M20 18V14" />
    </svg>
  );
}

export function LinkIcon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export function ImageIcon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

export function CodeIcon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function CodeBlockIcon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="12" y1="6" x2="12" y2="18" />
    </svg>
  );
}

export function ListBulletIcon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <line x1="9" y1="6" x2="21" y2="6" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <line x1="9" y1="18" x2="21" y2="18" />
      <circle cx="5" cy="6" r="2" fill="currentColor" />
      <circle cx="5" cy="12" r="2" fill="currentColor" />
      <circle cx="5" cy="18" r="2" fill="currentColor" />
    </svg>
  );
}

export function ListOrderedIcon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  );
}

export function TaskListIcon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <line x1="9" y1="6" x2="21" y2="6" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <line x1="9" y1="18" x2="21" y2="18" />
      <rect x="3" y="4" width="5" height="5" rx="1" />
      <path d="M4 10l1.5 1.5 2.5-2.5" />
      <rect x="3" y="10" width="5" height="5" rx="1" />
      <path d="M4 16l1.5 1.5 2.5-2.5" />
      <rect x="3" y="16" width="5" height="5" rx="1" />
    </svg>
  );
}

export function QuoteIcon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V21c0 5.5 2.5 10 9 10" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V21c0 5.5 2.5 10 9 10" />
    </svg>
  );
}

export function DividerIcon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function CopyIcon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function DownloadIcon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function ClearIcon({ size = 20, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={ariaHidden}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

// Icon map for easy lookup
export const iconMap = {
  bold: BoldIcon,
  italic: ItalicIcon,
  heading1: Heading1Icon,
  heading2: Heading2Icon,
  heading3: Heading3Icon,
  link: LinkIcon,
  image: ImageIcon,
  code: CodeIcon,
  codeBlock: CodeBlockIcon,
  listBullet: ListBulletIcon,
  listOrdered: ListOrderedIcon,
  taskList: TaskListIcon,
  quote: QuoteIcon,
  divider: DividerIcon,
  copy: CopyIcon,
  download: DownloadIcon,
  clear: ClearIcon,
} as const;

export type IconName = keyof typeof iconMap;