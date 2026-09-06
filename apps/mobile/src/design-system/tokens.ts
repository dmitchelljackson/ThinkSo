import type { TextStyle } from 'react-native';

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export type SpacingToken = keyof typeof spacing;

export const radii = { square: 0, control: 2, dialog: 4, provider: 12 } as const;

export const sizes = {
  minimumTouchTarget: 44,
  actionHeight: 48,
  providerActionHeight: 54,
  contentMaxWidth: 720,
} as const;

export const motion = { quick: 120, standard: 180, deliberate: 280 } as const;

export const fontFamilies = {
  editorial: 'Spectral_400Regular',
  administrative: 'CourierPrime_400Regular',
  administrativeBold: 'CourierPrime_700Bold',
  annotation: 'GloriaHallelujah_400Regular',
} as const;

export const textStyles = {
  display: {
    fontFamily: fontFamilies.editorial,
    fontSize: 42,
    lineHeight: 48,
    letterSpacing: -0.6,
  },
  heading: {
    fontFamily: fontFamilies.editorial,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  body: { fontFamily: fontFamilies.administrative, fontSize: 15, lineHeight: 24 },
  label: {
    fontFamily: fontFamilies.administrativeBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  reference: {
    fontFamily: fontFamilies.administrative,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  action: {
    fontFamily: fontFamilies.administrativeBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  annotation: { fontFamily: fontFamilies.annotation, fontSize: 17, lineHeight: 25 },
  caption: { fontFamily: fontFamilies.administrative, fontSize: 11, lineHeight: 16 },
} as const satisfies Record<string, TextStyle>;

export type TextRole = keyof typeof textStyles;

export const hitSlop = { top: 8, right: 8, bottom: 8, left: 8 } as const;
