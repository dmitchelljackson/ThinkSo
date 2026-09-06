import { DocumentScreen, EditorialHeading, FormHeader, ThinkSoText } from '../../design-system';

export function ConnectThreadsPendingScreen() {
  return (
    <DocumentScreen>
      <FormHeader eyebrow="THINKSO · CONNECTION" reference="PENDING" formNumber="FORM 002" />
      <EditorialHeading>Connect Threads</EditorialHeading>
      <ThinkSoText>
        The account is ready. Threads authorization is the next build slice.
      </ThinkSoText>
    </DocumentScreen>
  );
}
