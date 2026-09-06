import { fireEvent, render, screen } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { SafeAreaProvider, type Metrics } from 'react-native-safe-area-context';
import { AccountAccessScreen } from './AccountAccessScreen';

const mockOnEvent = jest.fn();
let mockPresenterState = {
  mode: 'login' as const,
  email: '',
  password: '',
  busy: false,
  onEvent: mockOnEvent,
};
jest.mock('./presentation/use-account-access-presenter', () => ({
  useAccountAccessPresenter: () => mockPresenterState,
}));

const metrics: Metrics = {
  frame: { x: 0, y: 0, width: 393, height: 852 },
  insets: { top: 0, right: 0, bottom: 0, left: 0 },
};

describe('AccountAccessScreen', () => {
  beforeAll(() => {
    jest.spyOn(Animated, 'loop').mockImplementation(() => ({
      start: jest.fn(),
      stop: jest.fn(),
      reset: jest.fn(),
    }));
  });

  afterAll(() => jest.restoreAllMocks());

  beforeEach(() => {
    mockOnEvent.mockReset();
    mockPresenterState = {
      mode: 'login',
      email: '',
      password: '',
      busy: false,
      onEvent: mockOnEvent,
    };
  });

  it('renders the locked Login controls and leaves placeholders inert', async () => {
    await render(
      <SafeAreaProvider initialMetrics={metrics}>
        <AccountAccessScreen />
      </SafeAreaProvider>,
    );
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'LOG IN' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'CREATE ACCOUNT' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'TERMS OF SERVICE' }));
    expect(mockOnEvent).toHaveBeenCalledWith({ type: 'placeholderPressed' });
  });

  it('disables every action and shows the separate loading S while submitting', async () => {
    mockPresenterState = { ...mockPresenterState, busy: true };
    await render(
      <SafeAreaProvider initialMetrics={metrics}>
        <AccountAccessScreen />
      </SafeAreaProvider>,
    );
    expect(screen.getByTestId('account-loading')).toBeTruthy();
    expect(screen.getByLabelText('Email').props.editable).toBe(false);
    expect(screen.getByLabelText('Password').props.editable).toBe(false);
    for (const action of screen.getAllByRole('button')) {
      expect(action.props.accessibilityState?.disabled).toBe(true);
    }
  });
});
