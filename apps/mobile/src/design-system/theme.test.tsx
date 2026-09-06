import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThinkSoText } from './primitives';
import { ThinkSoThemeProvider, darkTheme, lightTheme, useThinkSoTheme } from './theme';

function ThemeProbe() {
  const theme = useThinkSoTheme();
  return (
    <Text testID="theme-probe">{`${theme.name}:${theme.colors.paper}:${theme.colors.ink}`}</Text>
  );
}

describe('ThinkSo themes', () => {
  it('defines the same semantic contract for light and dark palettes', () => {
    expect(Object.keys(darkTheme.colors).sort()).toEqual(Object.keys(lightTheme.colors).sort());
    expect(darkTheme.colors.paper).not.toBe(lightTheme.colors.paper);
  });

  it('switches component-level semantic tokens without changing component APIs', async () => {
    const view = await render(
      <ThinkSoThemeProvider mode="dark">
        <ThemeProbe />
        <ThinkSoText testID="themed-text">Dark ink</ThinkSoText>
      </ThinkSoThemeProvider>,
    );
    expect(view.getByTestId('theme-probe')).toHaveTextContent(
      `dark:${darkTheme.colors.paper}:${darkTheme.colors.ink}`,
    );
    expect(view.getByTestId('themed-text')).toHaveStyle({ color: darkTheme.colors.ink });
  });
});
