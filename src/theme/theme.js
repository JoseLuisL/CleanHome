import { MD3LightTheme } from 'react-native-paper';

/**
 * Tema Material Design 3 personalizado.
 * Paleta basada en el diseno del flujo de agendamiento de limpieza (azul primario).
 */
export const colors = {
  primary: '#1565FF',
  primaryDark: '#0D47D9',
  primaryLight: '#E8EEFF',
  success: '#22C55E',
  successLight: '#E7F8EF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  surface: '#FFFFFF',
  background: '#F5F7FB',
  chipWarning: '#FEF3C7',
  chipWarningText: '#B45309',
};

/**
 * Constantes de layout.
 * CONTENT_MAX_WIDTH limita el ancho del contenido en pantallas grandes
 * (web/desktop) para que no se estire a todo lo ancho; en movil la pantalla
 * es mas angosta que este valor, asi que no afecta.
 */
export const layout = {
  contentMaxWidth: 480,
};

const theme = {
  ...MD3LightTheme,
  roundness: 3,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    onPrimary: '#FFFFFF',
    primaryContainer: colors.primaryLight,
    onPrimaryContainer: colors.primaryDark,
    secondary: colors.primaryDark,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: '#F1F5F9',
    outline: colors.border,
    onSurface: colors.textPrimary,
    onSurfaceVariant: colors.textSecondary,
    error: '#DC2626',
  },
};

export default theme;
