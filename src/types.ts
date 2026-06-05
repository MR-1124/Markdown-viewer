import type { ReactNode } from 'react';

export type ToolbarButton = {
  label: string;
  prefix: string;
  suffix: string;
  shortcut?: string;
  title: string;
  icon?: ReactNode;
  action?: string; // For special actions like undo, redo
};

export type PreviewerStats = {
  words: number;
  characters: number;
  lines: number;
};