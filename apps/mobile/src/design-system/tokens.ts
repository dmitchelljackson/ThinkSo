export const colors = {
  canvas: '#e6e3db',
  paper: '#f4f2ec',
  raisedPaper: '#fdfcf8',
  checkboxPaper: '#fffdf7',
  ink: '#14171f',
  inkPressed: '#202437',
  blueInk: '#2438c9',
  blueInkDark: '#1b2a8f',
  redInk: '#b0442f',
  redInkPressed: '#9e3c2a',
  redInkDark: '#8f3423',
  filingError: '#f4ccd4',
  approvalGreen: '#2f9e52',
  mutedInk: 'rgba(20,23,31,0.62)',
  rule: 'rgba(20,23,31,0.28)',
  secondaryPressed: '#ecebf2',
  providerDisabledInk: 'rgba(20,23,31,0.4)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radii = { square: 0, control: 2, dialog: 4 } as const;

export const typography = {
  editorial: 'Spectral_400Regular',
  administrative: 'CourierPrime_400Regular',
  administrativeBold: 'CourierPrime_700Bold',
  annotation: 'GloriaHallelujah_400Regular',
} as const;

export const hitSlop = { top: 8, right: 8, bottom: 8, left: 8 } as const;
