import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

function initAdmin() {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const pathEnv = process.env.FIREBASE_CREDENTIALS_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!admin.apps.length) {
    if (inline) {
      const cred = JSON.parse(inline);
      admin.initializeApp({ credential: admin.credential.cert(cred) });
      console.log('Firebase Admin initialized from inline JSON');
      return;
    }
    if (pathEnv) {
      const abs = path.isAbsolute(pathEnv) ? pathEnv : path.resolve(process.cwd(), pathEnv);
      if (!fs.existsSync(abs)) {
        console.error('Credentials file not found at:', abs);
      } else {
        const cred = JSON.parse(fs.readFileSync(abs, 'utf-8'));
        admin.initializeApp({ credential: admin.credential.cert(cred) });
        console.log('✅ Firebase Admin initialized from file:', abs);
        return;
      }
    }
    throw new Error('Firebase Admin not initialized. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_CREDENTIALS_PATH/GOOGLE_APPLICATION_CREDENTIALS.');
  }
}
initAdmin();

export const adminApp = admin;
export const db = admin.firestore();
