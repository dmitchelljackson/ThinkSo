# Source: ThinkSo Firebase email/password design archive

- Type: imported Claude Design export
- Imported: 2026-09-04
- Preserved contents: [`./thinkso-login-email-password-2026-09-04/`](./thinkso-login-email-password-2026-09-04/)
- Supersedes the login-source links in [`thinkso-claude-export.md`](./thinkso-claude-export.md) for account access only; the older archive remains preserved as historical evidence.

## Account-access source manifest

- Primary Login/account-access form: [`ThinkSo Access Form.dc.html`](<./thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>)
- Create Account form: [`ThinkSo Register.dc.html`](<./thinkso-login-email-password-2026-09-04/ThinkSo Register.dc.html>)
- Alternate historical composition with provider buttons: [`ThinkSo Login.dc.html`](<./thinkso-login-email-password-2026-09-04/ThinkSo Login.dc.html>)
- Shared error treatment: [`ErrorToast.dc.html`](./thinkso-login-email-password-2026-09-04/ErrorToast.dc.html)
- Shared activity indicator: [`CoolSpinner.dc.html`](./thinkso-login-email-password-2026-09-04/CoolSpinner.dc.html)
- Full product-flow composition: [`ThinkSo Flow.dc.html`](<./thinkso-login-email-password-2026-09-04/ThinkSo Flow.dc.html>)

The archive also preserves the previously exported Record, Contract, Create Challenge, Account, retirement-warning, and shared-component files. Their account-independent links remain available from [`SCREENS.md`](../../SCREENS.md).

## Interpretation notes

The exported `ThinkSo Access Form` is the Login visual reference and includes email/password fields, a show/hide control, a Forgot it affordance, and a Register affordance. The separate `ThinkSo Register` source includes a `Name for the record` field. That field is a raw-source mismatch: locked product behavior uses the connected Threads identity for public identity, so Create Account must not display or require a signup display-name field. The mismatch is preserved here for traceability and does not change the BDD.

No standalone forgot-password dialog file is present in this archive. The normal MVP Forgot Password interaction is a standard account-access dialog entered from the Access Form's Forgot it affordance; its behavior, neutral confirmation, and Firebase-hosted reset completion are defined by the Login BDD. Do not infer provider buttons or a custom reset page from the historical `ThinkSo Login` source.

As with the original export, these files are visual evidence rather than production layout code. Do not copy the preview device frame or fixed dimensions into React Native.
