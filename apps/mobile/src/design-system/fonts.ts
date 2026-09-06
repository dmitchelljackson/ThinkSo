import { CourierPrime_400Regular, CourierPrime_700Bold } from '@expo-google-fonts/courier-prime';
import { GloriaHallelujah_400Regular } from '@expo-google-fonts/gloria-hallelujah';
import { Spectral_400Regular } from '@expo-google-fonts/spectral';

/**
 * The font packages are MIT wrappers around the Google Fonts files. The font
 * files themselves are SIL Open Font License 1.1; see each package's LICENSE.
 * Every role has an intentional system fallback in the component styles.
 */
export const thinkSoFonts = {
  Spectral_400Regular,
  CourierPrime_400Regular,
  CourierPrime_700Bold,
  GloriaHallelujah_400Regular,
} as const;
