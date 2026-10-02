import { fireEvent, render, screen } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { SafeAreaProvider, type Metrics } from 'react-native-safe-area-context';
import { AccountAccessScreen, accountAccessAllowsScroll } from './AccountAccessScreen';

const mockOnEvent = jest.fn();
let mockPresenterState: {
  email: string;
  password: string;
  busy: boolean;
  onEvent: typeof mockOnEvent;
} = {
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
      email: '',
      password: '',
      busy: false,
      onEvent: mockOnEvent,
    };
  });

  it('renders the locked Login controls and dispatches placeholder actions', async () => {
    await render(
      <SafeAreaProvider initialMetrics={metrics}>
        <AccountAccessScreen />
      </SafeAreaProvider>,
    );
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'LOG IN' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'CREATE ACCOUNT' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'HOW IT WORKS' })).toBeNull();
    expect(screen.getByRole('button', { name: 'TERMS OF SERVICE' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'PRIVACY POLICY' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'CREATE ACCOUNT' }));
    expect(mockOnEvent).toHaveBeenCalledWith({ type: 'createAccountPressed' });
    await fireEvent.press(screen.getByRole('button', { name: 'FORGOT IT' }));
    expect(mockOnEvent).toHaveBeenCalledWith({ type: 'forgotPasswordPressed' });
    await fireEvent.press(screen.getByRole('button', { name: 'TERMS OF SERVICE' }));
    expect(mockOnEvent).toHaveBeenCalledWith({ type: 'placeholderPressed' });
    await fireEvent.press(screen.getByRole('button', { name: 'PRIVACY POLICY' }));
    expect(mockOnEvent).toHaveBeenCalledWith({ type: 'placeholderPressed' });
  });

  it('keeps ordinary phone layouts fixed and only enables overflow when needed', () => {
    expect(accountAccessAllowsScroll(874)).toBe(false);
    expect(accountAccessAllowsScroll(800)).toBe(false);
    expect(accountAccessAllowsScroll(759)).toBe(true);
  });

  it('disables every action and shows loading inside the fixed submit action', async () => {
    mockPresenterState = { ...mockPresenterState, busy: true };
    await render(
      <SafeAreaProvider initialMetrics={metrics}>
        <AccountAccessScreen />
      </SafeAreaProvider>,
    );
    expect(screen.getByTestId('account-submit-indicator')).toBeTruthy();
    expect(screen.getByTestId('account-submit')).toContainElement(
      screen.getByTestId('account-submit-indicator'),
    );
    expect(screen.getByLabelText('Email').props.editable).toBe(false);
    expect(screen.getByLabelText('Password').props.editable).toBe(false);
    for (const action of screen.getAllByRole('button')) {
      expect(action.props.accessibilityState?.disabled).toBe(true);
    }
  });

  it('advances from email and submits from the password keyboard action', async () => {
    await render(
      <SafeAreaProvider initialMetrics={metrics}>
        <AccountAccessScreen />
      </SafeAreaProvider>,
    );
    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    expect(email.props.returnKeyType).toBe('next');
    expect(password.props.returnKeyType).toBe('done');
    await fireEvent(email, 'submitEditing');
    await fireEvent(password, 'submitEditing');
    expect(mockOnEvent).toHaveBeenCalledWith({ type: 'submitPressed' });
  });
});
