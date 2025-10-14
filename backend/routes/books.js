import { Router } from 'express';
import { db } from '../firebase.js';
import { authRequired } from '../auth.js';

const router = Router();
const coll = () => db.collection('books');

// Public list/search
router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').toLowerCase();
    const snap = await coll().get();
    let rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (q) {
      rows = rows.filter(b => (b.title||'').toLowerCase().includes(q)
        || (b.author||'').toLowerCase().includes(q)
        || (Array.isArray(b.tags) ? b.tags : []).some(t => (t||'').toLowerCase().includes(q)));
    }
    res.json(rows);
  } catch (e) { next(e); }
});

// Create (auth)
router.post('/', authRequired, async (req, res, next) => {
  try {
    const { title, author, condition, description, tags } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const doc = await coll().add({
      ownerId: req.user.id,
      title,
      author: author || '',
      condition: condition || 'Good',
      description: description || '',
      tags: Array.isArray(tags) ? tags : [],
      status: 'available',
      createdAt: Date.now()
    });
    const snap = await doc.get();
    res.status(201).json({ id: doc.id, ...snap.data() });
  } catch (e) { next(e); }
});

// Read single
router.get('/:id', async (req, res, next) => {
  try {
    const ref = await coll().doc(req.params.id).get();
    if (!ref.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ id: ref.id, ...ref.data() });
  } catch (e) { next(e); }
});

// Update (owner only)
router.put('/:id', authRequired, async (req, res, next) => {
  try {
    const ref = coll().doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Not found' });
    const book = snap.data();
    if (book.ownerId !== req.user.id) return res.status(403).json({ error: 'Not owner' });
    const { title, author, condition, description, tags, status } = req.body;
    const patch = {
      ...(title !== undefined ? { title } : {}),
      ...(author !== undefined ? { author } : {}),
      ...(condition !== undefined ? { condition } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(tags !== undefined ? { tags: Array.isArray(tags) ? tags : book.tags } : {}),
      ...(status !== undefined ? { status } : {}),
      updatedAt: Date.now()
    };
    await ref.update(patch);
    const updated = await ref.get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (e) { next(e); }
});

// Delete (owner only)
router.delete('/:id', authRequired, async (req, res, next) => {
  try {
    const ref = coll().doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Not found' });
    const book = snap.data();
    if (book.ownerId !== req.user.id) return res.status(403).json({ error: 'Not owner' });
    await ref.delete();
    res.json({ ok: true, removedId: req.params.id });
  } catch (e) { next(e); }
});

// My listings
router.get('/me/listings', authRequired, async (req, res, next) => {
  try {
    const snap = await coll().where('ownerId','==',req.user.id).get();
    const rows = snap.docs.map(d=>({ id:d.id, ...d.data() }));
    res.json(rows);
  } catch (e) { next(e); }
});

export default router;
