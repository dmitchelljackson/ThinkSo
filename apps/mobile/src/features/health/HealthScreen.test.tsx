import { render, screen } from '@testing-library/react-native';
import { HealthScreen } from './HealthScreen';

jest.mock('./presentation/use-health-presenter', () => ({
  useHealthPresenter: () => ({
    type: 'ready',
    label: 'thinkso-api is ok',
    checkedAt: '2026-09-04T12:00:00.000Z',
    onEvent: jest.fn(),
  }),
}));

describe('HealthScreen', () => {
  it('renders the presentation-ready health state', async () => {
    await render(<HealthScreen />);
    expect(screen.getByTestId('health-status')).toHaveTextContent('thinkso-api is ok');
  });
});
