import { adminApp } from './firebase.js';

export async function authRequired(req, res, next) {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    const decoded = await adminApp.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid, id: decoded.uid, email: decoded.email || '', name: decoded.name || '' };
    next();
  } catch (e) {
    console.error('Auth error', e);
    res.status(401).json({ error: 'Invalid token' });
  }
}
