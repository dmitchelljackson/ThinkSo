import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { Animated, StyleSheet } from 'react-native';
import { SafeAreaProvider, type Metrics } from 'react-native-safe-area-context';

const metrics: Metrics = {
  frame: { x: 0, y: 0, width: 393, height: 852 },
  insets: { top: 0, right: 0, bottom: 0, left: 0 },
};
import {
  AcknowledgmentControl,
  ActionButton,
  actionButtonVisualStyle,
  DocumentScreen,
  FilingErrorToast,
  Inline,
  LoadingS,
  NoticeDialog,
  Spacer,
  Stack,
  ThreadsConnectButton,
  shouldDismissToastSwipe,
} from './';

describe('native visual foundation primitives', () => {
  beforeAll(() => {
    jest.spyOn(Animated, 'loop').mockImplementation(() => ({
      start: jest.fn(),
      stop: jest.fn(),
      reset: jest.fn(),
    }));
  });

  afterAll(() => jest.restoreAllMocks());

  it('keeps the document surface safe-area aware and content-driven', async () => {
    const view = await render(
      <SafeAreaProvider initialMetrics={metrics}>
        <DocumentScreen testID="document">
          <LoadingS testID="loading" />
        </DocumentScreen>
      </SafeAreaProvider>,
    );
    expect(await view.findByTestId('document')).toBeTruthy();
    expect(await view.findByTestId('loading')).toBeTruthy();
  });

  it('applies the shared layout rhythm through typed atoms', async () => {
    const view = await render(
      <Stack testID="stack" gap="xl">
        <Inline testID="inline" gap="md" wrap={false}>
          <Spacer testID="spacer" size="sm" />
        </Inline>
      </Stack>,
    );
    expect(StyleSheet.flatten(view.getByTestId('stack').props.style)).toMatchObject({ gap: 24 });
    expect(StyleSheet.flatten(view.getByTestId('inline').props.style)).toMatchObject({
      flexDirection: 'row',
      gap: 12,
    });
    expect(
      StyleSheet.flatten(view.getByTestId('spacer', { includeHiddenElements: true }).props.style),
    ).toMatchObject({ width: 8, height: 8 });
  });

  it('supports finite action states and does not call disabled actions', async () => {
    const onPress = jest.fn();
    const view = await render(
      <>
        <ActionButton testID="enabled" onPress={onPress}>
          Continue
        </ActionButton>
        <ActionButton testID="disabled" disabled onPress={onPress}>
          Disabled
        </ActionButton>
        <ActionButton testID="loading" loading onPress={onPress}>
          Loading
        </ActionButton>
      </>,
    );
    await fireEvent.press(view.getByTestId('enabled'));
    await fireEvent.press(view.getByTestId('disabled'));
    await fireEvent.press(view.getByTestId('loading'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(view.getByTestId('disabled').props.accessibilityState.disabled).toBe(true);
    expect(view.getByTestId('loading').props.accessibilityState.busy).toBe(true);
    expect(view.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders pressed feedback without moving the action', async () => {
    const pressedStyle = StyleSheet.flatten(actionButtonVisualStyle('primary', true, false));
    expect(pressedStyle).toMatchObject({ backgroundColor: '#202437' });
    expect(pressedStyle).not.toHaveProperty('transform');
  });

  it('keeps the provider-branded Threads control distinct and unavailable while busy', async () => {
    const onPress = jest.fn();
    const view = await render(
      <>
        <ThreadsConnectButton testID="threads-enabled" onPress={onPress} />
        <ThreadsConnectButton testID="threads-disabled" disabled onPress={onPress} />
        <ThreadsConnectButton testID="threads-loading" loading onPress={onPress} />
      </>,
    );
    await fireEvent.press(view.getByTestId('threads-enabled'));
    await fireEvent.press(view.getByTestId('threads-disabled'));
    await fireEvent.press(view.getByTestId('threads-loading'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(view.getByTestId('threads-disabled').props.accessibilityState.disabled).toBe(true);
    expect(view.getByTestId('threads-loading-indicator')).toBeTruthy();
  });

  it('toggles the full-row acknowledgment without persisting it', async () => {
    const onChange = jest.fn();
    const view = await render(
      <AcknowledgmentControl checked={false} label="I agree" onChange={onChange} />,
    );
    const control = view.getByRole('checkbox');
    expect(control.props.accessibilityState.checked).toBe(false);
    await fireEvent.press(control);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('dismisses a filing error at expiry without invoking its action', async () => {
    jest.useFakeTimers();
    const onAction = jest.fn();
    const onDismiss = jest.fn();
    const view = await render(
      <FilingErrorToast
        header="ERROR · JUST NOW"
        message="Nothing changed."
        action="TRY AGAIN"
        initialSeconds={1}
        onAction={onAction}
        onDismiss={onDismiss}
      />,
    );
    expect(view.getByTestId('toast-action')).toHaveTextContent('TRY AGAIN · 1');
    await act(async () => jest.advanceTimersByTime(1000));
    await view.findByText('TRY AGAIN · 0');
    expect(onAction).not.toHaveBeenCalled();
    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1));
    jest.useRealTimers();
  });

  it('only treats a deliberate upward gesture as toast dismissal', () => {
    expect(shouldDismissToastSwipe(-32)).toBe(true);
    expect(shouldDismissToastSwipe(-24)).toBe(false);
    expect(shouldDismissToastSwipe(32)).toBe(false);
  });

  it('runs explicit toast actions and dialog actions exactly once', async () => {
    const onToastAction = jest.fn();
    const onDismiss = jest.fn();
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    const view = await render(
      <>
        <FilingErrorToast
          header="ERROR · JUST NOW"
          message="Nothing changed."
          action="TRY AGAIN"
          onAction={onToastAction}
          onDismiss={onDismiss}
        />
        <NoticeDialog
          visible
          title="Notice"
          confirmLabel="CONTINUE"
          onConfirm={onConfirm}
          onCancel={onCancel}
        >
          Read this.
        </NoticeDialog>
      </>,
    );
    await fireEvent.press(view.getByTestId('toast-action'));
    await fireEvent.press(view.getByText('CONTINUE'));
    await fireEvent.press(view.getByText('CANCEL'));
    expect(onToastAction).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onDismiss).not.toHaveBeenCalled();
    view.unmount();
  });
});
