import { thinkSoFonts } from './fonts';
import { fontFamilies, textStyles } from './tokens';

describe('ThinkSo typography foundation', () => {
  it('bundles one verified face for every visual role', () => {
    expect(thinkSoFonts.Spectral_400Regular).toBeDefined();
    expect(thinkSoFonts.CourierPrime_400Regular).toBeDefined();
    expect(thinkSoFonts.CourierPrime_700Bold).toBeDefined();
    expect(thinkSoFonts.GloriaHallelujah_400Regular).toBeDefined();
    expect(fontFamilies.editorial).toBe('Spectral_400Regular');
    expect(fontFamilies.administrative).toBe('CourierPrime_400Regular');
    expect(fontFamilies.annotation).toBe('GloriaHallelujah_400Regular');
    expect(textStyles.display).toMatchObject({ fontSize: 42, lineHeight: 48 });
    expect(textStyles.body).toMatchObject({ fontSize: 15, lineHeight: 24 });
  });
});
