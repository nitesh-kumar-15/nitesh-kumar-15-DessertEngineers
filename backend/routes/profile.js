import express from 'express';
import { db } from '../firebase.js';
import { authRequired } from '../auth.js';

const router = express.Router();

router.get('/me', authRequired, async (req, res, next) => {
  try {
    const ref = db.collection('users').doc(req.user.id);
    const snap = await ref.get();

    if (!snap.exists) {
      const doc = {
        displayName: req.user.name || '',
        email: req.user.email || '',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      await ref.set(doc, { merge: true });
      return res.json({ id: ref.id, ...doc });
    }
    res.json({ id: snap.id, ...snap.data() });
  } catch (e) { next(e); }
});

router.put('/me', authRequired, async (req, res, next) => {
  try {
    const { displayName, photoURL, phone, campus, bio } = req.body || {};
    const payload = { displayName, photoURL, phone, campus, bio, updatedAt: Date.now() };
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

    const ref = db.collection('users').doc(req.user.id);
    await ref.set(payload, { merge: true });
    const snap = await ref.get();
    res.json({ id: snap.id, ...snap.data() });
  } catch (e) { next(e); }
});

export default router;