import { thinkSoFonts } from './fonts';
import { typography } from './tokens';

describe('ThinkSo typography foundation', () => {
  it('bundles one verified face for every visual role', () => {
    expect(thinkSoFonts.Spectral_400Regular).toBeDefined();
    expect(thinkSoFonts.CourierPrime_400Regular).toBeDefined();
    expect(thinkSoFonts.CourierPrime_700Bold).toBeDefined();
    expect(thinkSoFonts.GloriaHallelujah_400Regular).toBeDefined();
    expect(typography.editorial).toBe('Spectral_400Regular');
    expect(typography.administrative).toBe('CourierPrime_400Regular');
    expect(typography.annotation).toBe('GloriaHallelujah_400Regular');
  });
});
