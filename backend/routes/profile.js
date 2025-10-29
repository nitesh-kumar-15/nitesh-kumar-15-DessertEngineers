import express from 'express';
import { db } from '../lib/firebase.js';
import { authRequired } from '../lib/auth.js';

const router = express.Router();


router.get('/me', authRequired, async (req, res) => {
  const ref = db.collection('users').doc(req.user.uid);
  const snap = await ref.get();

  if (!snap.exists) {
    const doc = {
      displayName: req.user.name || '',
      email: req.user.email || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await ref.set(doc, { merge: true });
    return res.json({ id: ref.id, ...doc });
  }
  res.json({ id: snap.id, ...snap.data() });
});

router.put('/me', authRequired, async (req, res) => {
  const { displayName, photoURL, phone, campus, bio } = req.body || {};
  const payload = { displayName, photoURL, phone, campus, bio, updatedAt: new Date() };
  Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

  const ref = db.collection('users').doc(req.user.uid);
  await ref.set(payload, { merge: true });
  const snap = await ref.get();
  res.json({ id: snap.id, ...snap.data() });
});

export default router;
