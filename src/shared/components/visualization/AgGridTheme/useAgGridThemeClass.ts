import { useTheme } from '@app/providers/ThemeProvider';

/** Base vendor theme — must match `ag-theme-quartz.css` imported from `bootstrap.js`. */
const AG_GRID_BASE_THEME = 'ag-theme-quartz';

export function useAgGridThemeClass(): string {
  const { theme } = useTheme();
  const overlay = theme === 'dark' ? 'ag-theme-admin-dark' : 'ag-theme-admin-light';
  return `${AG_GRID_BASE_THEME} ${overlay}`;
}
