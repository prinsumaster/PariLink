// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Design System & Theme
// Single source of truth for all colours, typography, spacing, shadows & radii.
// Supports Light and Dark modes. All screen components import from here.
// ─────────────────────────────────────────────────────────────────────────────

import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Palette ────────────────────────────────────────────────────────────────
export const Palette = {
  // Brand
  primary50:   '#EFF6FF',
  primary100:  '#DBEAFE',
  primary200:  '#BFDBFE',
  primary300:  '#93C5FD',
  primary400:  '#60A5FA',
  primary500:  '#3B82F6',
  primary600:  '#2563EB',
  primary700:  '#1D4ED8',
  primary800:  '#1E40AF',
  primary900:  '#1E3A8A',

  // Success
  success50:  '#F0FDF4',
  success500: '#22C55E',
  success700: '#15803D',

  // Warning
  warning50:  '#FFFBEB',
  warning500: '#F59E0B',
  warning700: '#B45309',

  // Danger
  danger50:   '#FFF1F2',
  danger500:  '#EF4444',
  danger700:  '#B91C1C',

  // Neutral
  neutral50:   '#F8FAFC',
  neutral100:  '#F1F5F9',
  neutral200:  '#E2E8F0',
  neutral300:  '#CBD5E1',
  neutral400:  '#94A3B8',
  neutral500:  '#64748B',
  neutral600:  '#475569',
  neutral700:  '#334155',
  neutral800:  '#1E293B',
  neutral900:  '#0F172A',
  neutral950:  '#020617',

  // Status Colours (Trip / Load)
  dispatched:  '#8B5CF6',
  inProgress:  '#F59E0B',
  completed:   '#22C55E',
  cancelled:   '#EF4444',
  parked:      '#64748B',
};

// ─── Light Theme ────────────────────────────────────────────────────────────
export const LightTheme = {
  mode: 'light',

  background:     Palette.neutral50,
  surface:        '#FFFFFF',
  surfaceElevated:'#FFFFFF',
  border:         Palette.neutral200,
  divider:        Palette.neutral100,

  primary:        Palette.primary600,
  primaryLight:   Palette.primary50,
  primaryText:    '#FFFFFF',

  text:           Palette.neutral900,
  textSecondary:  Palette.neutral500,
  textTertiary:   Palette.neutral400,
  textDisabled:   Palette.neutral300,

  success:        Palette.success500,
  warning:        Palette.warning500,
  danger:         Palette.danger500,

  // Status chip backgrounds
  chip: {
    dispatched:  { bg: '#EDE9FE', text: '#5B21B6' },
    inProgress:  { bg: '#FEF3C7', text: '#92400E' },
    completed:   { bg: '#DCFCE7', text: '#166534' },
    cancelled:   { bg: '#FEE2E2', text: '#991B1B' },
  },

  tabBar:         '#FFFFFF',
  tabBarBorder:   Palette.neutral200,
  tabBarActive:   Palette.primary600,
  tabBarInactive: Palette.neutral400,

  header:         '#FFFFFF',
  headerText:     Palette.neutral900,
  statusBar:      'dark-content',

  card:           '#FFFFFF',
  cardShadow:     'rgba(15, 23, 42, 0.08)',

  input:          Palette.neutral50,
  inputBorder:    Palette.neutral200,
  inputFocused:   Palette.primary600,
  inputText:      Palette.neutral900,
  inputPlaceholder: Palette.neutral400,

  mapStyle:       [] as object[],
};

export type Theme = typeof LightTheme & { mode: 'light' | 'dark', statusBar: 'dark-content' | 'light-content' };

// ─── Dark Theme ─────────────────────────────────────────────────────────────
export const DarkTheme: Theme = {
  mode: 'dark',

  background:     Palette.neutral950,
  surface:        Palette.neutral900,
  surfaceElevated: Palette.neutral800,
  border:         Palette.neutral700,
  divider:        Palette.neutral800,

  primary:        Palette.primary500,
  primaryLight:   Palette.primary900,
  primaryText:    '#FFFFFF',

  text:           Palette.neutral50,
  textSecondary:  Palette.neutral400,
  textTertiary:   Palette.neutral500,
  textDisabled:   Palette.neutral700,

  success:        Palette.success500,
  warning:        Palette.warning500,
  danger:         Palette.danger500,

  chip: {
    dispatched:  { bg: '#2E1065', text: '#C4B5FD' },
    inProgress:  { bg: '#422006', text: '#FDE68A' },
    completed:   { bg: '#052E16', text: '#86EFAC' },
    cancelled:   { bg: '#450A0A', text: '#FCA5A5' },
  },

  tabBar:         Palette.neutral900,
  tabBarBorder:   Palette.neutral800,
  tabBarActive:   Palette.primary400,
  tabBarInactive: Palette.neutral500,

  header:         Palette.neutral900,
  headerText:     Palette.neutral50,
  statusBar:      'light-content',

  card:           Palette.neutral900,
  cardShadow:     'rgba(0, 0, 0, 0.5)',

  input:          Palette.neutral800,
  inputBorder:    Palette.neutral700,
  inputFocused:   Palette.primary500,
  inputText:      Palette.neutral50,
  inputPlaceholder: Palette.neutral500,

  mapStyle: [
    { elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#334155' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  ],
};

// ─── Typography ─────────────────────────────────────────────────────────────
export const Typography = {
  displayXL: { fontSize: 36, lineHeight: 44, fontWeight: '800' as const },
  displayLG: { fontSize: 30, lineHeight: 38, fontWeight: '700' as const },
  displayMD: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },

  headingLG: { fontSize: 20, lineHeight: 28, fontWeight: '700' as const },
  headingMD: { fontSize: 18, lineHeight: 26, fontWeight: '600' as const },
  headingSM: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },

  bodyLG: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodyMD: { fontSize: 14, lineHeight: 22, fontWeight: '400' as const },
  bodySM: { fontSize: 13, lineHeight: 20, fontWeight: '400' as const },

  labelLG: { fontSize: 14, lineHeight: 20, fontWeight: '600' as const },
  labelMD: { fontSize: 12, lineHeight: 18, fontWeight: '600' as const },
  labelSM: { fontSize: 11, lineHeight: 16, fontWeight: '600' as const },

  caption:  { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  mono:     { fontSize: 13, lineHeight: 20, fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }) },
};

// ─── Spacing ─────────────────────────────────────────────────────────────────
export const Spacing = {
  xs:   4,
  sm:   8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
  xxxl: 64,
};

// ─── Border Radius ───────────────────────────────────────────────────────────
export const Radius = {
  xs:  4,
  sm:  8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// ─── Shadows ─────────────────────────────────────────────────────────────────
export const createShadow = (theme: typeof LightTheme) =>
  StyleSheet.create({
    sm: Platform.select({
      ios: {
        shadowColor:   theme.cardShadow,
        shadowOffset:  { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius:  3,
      },
      android: { elevation: 2 },
    })!,
    md: Platform.select({
      ios: {
        shadowColor:   theme.cardShadow,
        shadowOffset:  { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius:  8,
      },
      android: { elevation: 6 },
    })!,
    lg: Platform.select({
      ios: {
        shadowColor:   theme.cardShadow,
        shadowOffset:  { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius:  20,
      },
      android: { elevation: 12 },
    })!,
  });

// ─── Screen Dimensions ───────────────────────────────────────────────────────
export const Screen = {
  width:  SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isTablet: SCREEN_WIDTH >= 768,
  isSmall:  SCREEN_WIDTH < 375,
};

// ─── Animation Presets ───────────────────────────────────────────────────────
export const Animation = {
  fast:     150,
  medium:   250,
  slow:     400,
  spring:   { mass: 1, damping: 20, stiffness: 200 },
  springBouncy: { mass: 1, damping: 12, stiffness: 200 },
};

export type AppTheme = typeof LightTheme;
