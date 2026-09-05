import { useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';
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
  LoadingS,
  NoticeDialog,
  Rule,
  Stamp,
  StatusLabel,
  ThreadsConnectButton,
  appDrawingLabel,
  appDrawingNames,
} from './';
import { colors, typography } from './tokens';

export function CatalogScreen() {
  const [acknowledged, setAcknowledged] = useState(false);
  const [toastVisible, setToastVisible] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <DocumentScreen testID="design-catalog">
      <FormHeader
        eyebrow="THINKSO · FOUNDATION CATALOG"
        reference="TS-FOUNDATION"
        formNumber="FORM 000"
      />
      <EditorialHeading underline>Visual foundation</EditorialHeading>
      <HandwrittenAnnotation>small rules, big consequences</HandwrittenAnnotation>
      <ClauseHeading label="CLAUSE 1">Document primitives</ClauseHeading>
      <StatusLabel tone="blue">Enabled state</StatusLabel>
      <Text style={styles.body}>
        Warm paper, editorial headings, administrative labels, and restrained ink accents are shared
        without importing a screen's behavior.
      </Text>
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
      <Text style={styles.body}>
        App-owned illustrations and hand-drawn marks from the current screen sources.
      </Text>
      <View style={styles.drawingGrid}>
        <View style={styles.drawingCard}>
          <LoadingS size={44} label="Loading S" />
          <Text style={styles.drawingLabel}>Loading S</Text>
        </View>
        {appDrawingNames.map((name) => (
          <View key={name} style={styles.drawingCard}>
            <AppDrawing name={name} />
            <Text style={styles.drawingLabel}>{appDrawingLabel(name)}</Text>
          </View>
        ))}
      </View>
    </DocumentScreen>
  );
}

function ViewRow({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = {
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  body: { color: colors.ink, fontFamily: typography.administrative, fontSize: 15, lineHeight: 24 },
  drawingGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 10 },
  drawingCard: {
    width: '48%' as const,
    minHeight: 142,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.raisedPaper,
    padding: 12,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    gap: 10,
  },
  drawingLabel: {
    color: colors.ink,
    fontFamily: typography.administrativeBold,
    fontSize: 10,
    letterSpacing: 1.2,
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
  },
};
