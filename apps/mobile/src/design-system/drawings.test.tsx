import { render } from '@testing-library/react-native';
import { AppDrawing, appDrawingLabel, appDrawingNames } from './drawings';

describe('ThinkSo drawing inventory', () => {
  it('keeps every named app-owned drawing renderable', async () => {
    const view = await render(
      <>
        {appDrawingNames.map((name) => (
          <AppDrawing key={name} name={name} testID={`drawing-${name}`} />
        ))}
      </>,
    );

    expect(appDrawingNames).toHaveLength(36);
    expect(new Set(appDrawingNames.map(appDrawingLabel)).size).toBe(36);
    for (const name of appDrawingNames) expect(view.getByTestId(`drawing-${name}`)).toBeTruthy();
  });
});
