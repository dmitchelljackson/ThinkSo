import { initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const app = initializeApp({
  apiKey: 'demo-key',
  appId: 'demo-thinkso',
  projectId: 'demo-thinkso',
  authDomain: 'demo-thinkso.firebaseapp.com',
});
const auth = getAuth(app);
connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
const email = `agent-${Date.now()}@example.test`;
const password = 'test-password';
const created = await createUserWithEmailAndPassword(auth, email, password);
const signedIn = await signInWithEmailAndPassword(auth, email, password);
if (!(await created.user.getIdToken()) || !(await signedIn.user.getIdToken())) {
  throw new Error('Firebase Auth Emulator did not issue ID tokens');
}

await expectFirebaseCode(
  () => signInWithEmailAndPassword(auth, email, 'wrong-password'),
  'auth/wrong-password',
);
await expectFirebaseCode(
  () => createUserWithEmailAndPassword(auth, email, password),
  'auth/email-already-in-use',
);

async function expectFirebaseCode(operation, expectedCode) {
  try {
    await operation();
  } catch (error) {
    if (error?.code === expectedCode) return;
    throw error;
  }
  throw new Error(`Expected Firebase error ${expectedCode}`);
}
