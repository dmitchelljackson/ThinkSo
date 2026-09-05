import { act, fireEvent, render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FeedbackProvider, useFeedback } from './feedback-host';
import { ActionButton } from './primitives';

const metrics = {
  frame: { x: 0, y: 0, width: 393, height: 852 },
  insets: { top: 0, right: 0, bottom: 0, left: 0 },
};

function Harness() {
  const feedback = useFeedback();
  return (
    <>
      <ActionButton onPress={() => feedback.showLoading('Filing')}>SHOW LOADING</ActionButton>
      <ActionButton onPress={feedback.hideLoading}>HIDE LOADING</ActionButton>
      <ActionButton
        onPress={() =>
          feedback.showError({
            header: 'FILING ERROR · JUST NOW',
            message: 'Nothing changed.',
            action: 'TRY AGAIN',
            initialSeconds: 6,
          })
        }
      >
        SHOW ERROR
      </ActionButton>
    </>
  );
}

describe('application feedback host', () => {
  it('shows and clears application-scoped loading and errors', async () => {
    const view = await render(
      <SafeAreaProvider initialMetrics={metrics}>
        <FeedbackProvider>
          <Harness />
        </FeedbackProvider>
      </SafeAreaProvider>,
    );

    await act(async () => fireEvent.press(view.getByText('SHOW LOADING')));
    expect(await view.findByTestId('global-loading')).toBeTruthy();
    await act(async () => fireEvent.press(view.getByText('HIDE LOADING')));
    expect(view.queryByTestId('global-loading')).toBeNull();

    await act(async () => fireEvent.press(view.getByText('SHOW ERROR')));
    expect(await view.findByTestId('global-error-toast')).toBeTruthy();
    await act(async () => fireEvent.press(view.getByTestId('toast-close')));
    expect(view.queryByTestId('global-error-toast')).toBeNull();
  });
});
