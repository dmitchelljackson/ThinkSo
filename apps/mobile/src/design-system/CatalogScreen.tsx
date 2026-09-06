import { useState, type ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import {
  AccountFormFields,
  AcknowledgmentControl,
  ActionButton,
  AppDrawing,
  ClauseHeading,
  DocumentScreen,
  EditorialHeading,
  FilingErrorToast,
  FormHeader,
  HandwrittenAnnotation,
  IconButton,
  Inline,
  LoadingS,
  NoticeDialog,
  Rule,
  Stamp,
  StatusLabel,
  ThinkSoText,
  ThinkSoThemeProvider,
  ThreadsConnectButton,
  appDrawingLabel,
  appDrawingNames,
  useThinkSoTheme,
  type ThemeMode,
} from './';
import { spacing } from './tokens';

export function CatalogScreen() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  return (
    <ThinkSoThemeProvider mode={themeMode}>
      <CatalogContent themeMode={themeMode} onThemeModeChange={setThemeMode} />
    </ThinkSoThemeProvider>
  );
}

function CatalogContent({
  themeMode,
  onThemeModeChange,
}: {
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
}) {
  const { colors, dark } = useThinkSoTheme();
  const [acknowledged, setAcknowledged] = useState(false);
  const [toastVisible, setToastVisible] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <DocumentScreen testID="design-catalog">
      <StatusBar style={dark ? 'light' : 'dark'} />
      <FormHeader
        eyebrow="THINKSO · FOUNDATION CATALOG"
        reference="TS-FOUNDATION"
        formNumber="FORM 000"
      />
      <EditorialHeading underline>Visual foundation</EditorialHeading>
      <HandwrittenAnnotation>small rules, big consequences</HandwrittenAnnotation>
      <ClauseHeading label="THEME">Appearance</ClauseHeading>
      <Inline>
        {(['light', 'dark', 'system'] as const).map((mode) => (
          <ActionButton
            key={mode}
            variant={themeMode === mode ? 'primary' : 'secondary'}
            onPress={() => onThemeModeChange(mode)}
          >
            {mode}
          </ActionButton>
        ))}
      </Inline>
      <ClauseHeading label="CLAUSE 1">Document primitives</ClauseHeading>
      <StatusLabel tone="blue">Enabled state</StatusLabel>
      <ThinkSoText>
        Warm paper, editorial headings, administrative labels, and restrained ink accents are shared
        without importing a screen's behavior.
      </ThinkSoText>
      <Rule />
      <ViewRow>
        <ActionButton onPress={() => undefined}>Primary action</ActionButton>
        <ActionButton variant="secondary" onPress={() => undefined}>
          Secondary
        </ActionButton>
        <ActionButton variant="destructive" onPress={() => undefined}>
          Destructive
        </ActionButton>
      </ViewRow>
      <ThreadsConnectButton onPress={() => undefined} />
      <ThreadsConnectButton disabled />
      <ThreadsConnectButton loading />
      <ViewRow>
        <ActionButton disabled>Disabled</ActionButton>
        <ActionButton loading>Loading</ActionButton>
        <IconButton icon="profile" label="Profile" onPress={() => undefined} />
      </ViewRow>
      <AcknowledgmentControl
        testID="catalog-ack"
        checked={acknowledged}
        label="I understand this is a local acknowledgment."
        onChange={setAcknowledged}
      />
      <Stamp>FINAL</Stamp>
      <LoadingS testID="catalog-loading" label="Loading preview" />
      <ActionButton variant="secondary" onPress={() => setToastVisible(true)}>
        Show filing error
      </ActionButton>
      {toastVisible && (
        <FilingErrorToast
          testID="catalog-toast"
          header="ACCOUNT ERROR · JUST NOW"
          message="Nothing changed. You can try again."
          action="TRY AGAIN"
          onAction={() => setToastVisible(false)}
          onDismiss={() => setToastVisible(false)}
        />
      )}
      <ActionButton onPress={() => setDialogVisible(true)}>Open notice dialog</ActionButton>
      <NoticeDialog
        visible={dialogVisible}
        title="A small notice"
        confirmLabel="UNDERSTOOD"
        onConfirm={() => setDialogVisible(false)}
        onCancel={() => setDialogVisible(false)}
      >
        This shell provides a document-style modal without deciding what a product operation means.
      </NoticeDialog>
      <AccountFormFields
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={() => undefined}
        submitLabel="ACCOUNT ACTION"
      />
      <Rule />
      <ClauseHeading label="CLAUSE 2">Drawings</ClauseHeading>
      <ThinkSoText>
        App-owned illustrations and hand-drawn marks from the current screen sources.
      </ThinkSoText>
      <View style={styles.drawingGrid}>
        <DrawingCard colors={colors}>
          <LoadingS size={44} label="Loading S" />
          <ThinkSoText variant="label">Loading S</ThinkSoText>
        </DrawingCard>
        {appDrawingNames.map((name) => (
          <DrawingCard key={name} colors={colors}>
            <AppDrawing name={name} />
            <ThinkSoText variant="label" style={styles.drawingLabel}>
              {appDrawingLabel(name)}
            </ThinkSoText>
          </DrawingCard>
        ))}
      </View>
    </DocumentScreen>
  );
}

function ViewRow({ children }: { children: ReactNode }) {
  return <Inline>{children}</Inline>;
}

function DrawingCard({
  children,
  colors,
}: {
  children: ReactNode;
  colors: { rule: string; raisedPaper: string };
}) {
  return (
    <View
      style={[
        styles.drawingCard,
        { borderColor: colors.rule, backgroundColor: colors.raisedPaper },
      ]}
    >
      {children}
    </View>
  );
}

const styles = {
  drawingGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.md,
  },
  drawingCard: {
    width: '48%' as const,
    minHeight: 142,
    borderWidth: 1,
    padding: spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    gap: spacing.md,
  },
  drawingLabel: { textAlign: 'center' as const },
};
