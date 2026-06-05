import { useTheme } from '../theme/ThemeContext';
import type { ThemeName } from '../theme/ThemeContext';
import { SunIcon, MoonIcon, GitHubIcon, PaperIcon, DraculaIcon, HighContrastIcon } from './Icons';

const themeLabels: Record<ThemeName, string> = {
  light: 'Light',
  dark: 'Dark',
  github: 'GitHub',
  sepura: 'Sepura',
  dracula: 'Dracula',
  'high-contrast': 'High Contrast',
};

const themeIcons: Record<ThemeName, React.ReactNode> = {
  light: <SunIcon size={16} />,
  dark: <MoonIcon size={16} />,
  github: <GitHubIcon size={16} />,
  sepura: <PaperIcon size={16} />,
  dracula: <DraculaIcon size={16} />,
  'high-contrast': <HighContrastIcon size={16} />,
};

export function ThemeToggle() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="Theme selector">
      <button
        type="button"
        className="theme-toggle-btn"
        onClick={toggleTheme}
        title={`Current: ${themeLabels[theme]} (click to cycle)`}
        aria-label={`Current theme: ${themeLabels[theme]}. Click to cycle themes.`}
      >
        <span className="theme-icon" aria-hidden="true">{themeIcons[theme]}</span>
        <span className="theme-label">{themeLabels[theme]}</span>
      </button>
      <div className="theme-dropdown" role="menu">
        {Object.entries(themeLabels).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="menuitem"
            className={`theme-dropdown-item ${key === theme ? 'active' : ''}`}
            onClick={() => setTheme(key as ThemeName)}
            aria-selected={key === theme}
          >
            <span className="theme-icon" aria-hidden="true">{themeIcons[key as ThemeName]}</span>
            <span>{label}</span>
            {key === theme && <span className="check-mark" aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}