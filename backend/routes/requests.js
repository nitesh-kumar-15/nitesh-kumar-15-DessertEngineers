import { Router } from 'express';
import { db } from '../firebase.js';
import { authRequired } from '../auth.js';

const router = Router();
const coll = () => db.collection('requests');
const books = () => db.collection('books');

// Create request
router.post('/', authRequired, async (req, res, next) => {
  try {
    const { bookId, message, type } = req.body;
    if (!bookId) return res.status(400).json({ error: 'bookId required' });
    const bookRef = await books().doc(bookId).get();
    if (!bookRef.exists) return res.status(404).json({ error: 'Book not found' });
    const book = bookRef.data();
    if (book.ownerId === req.user.id) return res.status(400).json({ error: 'Cannot request your own book' });
    const doc = await coll().add({
      bookId,
      ownerId: book.ownerId,
      requesterId: req.user.id,
      type: type || 'borrow',
      message: message || '',
      status: 'pending',
      createdAt: Date.now()
    });
    const snap = await doc.get();
    res.status(201).json({ id: doc.id, ...snap.data() });
  } catch (e) { next(e); }
});

// Owner: incoming
router.get('/incoming', authRequired, async (req, res, next) => {
  try {
    const snap = await coll().where('ownerId','==',req.user.id).get();
    res.json(snap.docs.map(d=>({ id:d.id, ...d.data() })));
  } catch (e) { next(e); }
});

// Me: my requests
router.get('/me', authRequired, async (req, res, next) => {
  try {
    const snap = await coll().where('requesterId','==',req.user.id).get();
    res.json(snap.docs.map(d=>({ id:d.id, ...d.data() })));
  } catch (e) { next(e); }
});

// Owner: update status
router.put('/:id', authRequired, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending','approved','declined','completed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const ref = coll().doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Not found' });
    const r = snap.data();
    if (r.ownerId !== req.user.id) return res.status(403).json({ error: 'Not owner' });
    await ref.update({ status, updatedAt: Date.now() });
    const updated = await ref.get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (e) { next(e); }
});

export default router;
