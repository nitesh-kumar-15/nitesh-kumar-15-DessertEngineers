import { Router } from 'express';
import { db, adminApp } from '../firebase.js';
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

// Helper to enrich request with book and user info
async function enrichRequest(requestDoc) {
  const request = requestDoc.data();
  const requestId = requestDoc.id;
  
  // Get book info
  const bookRef = await books().doc(request.bookId).get();
  const book = bookRef.exists ? bookRef.data() : null;
  
  // Get requester email
  let requesterEmail = '';
  try {
    const requesterUser = await adminApp.auth().getUser(request.requesterId);
    requesterEmail = requesterUser.email || '';
  } catch (e) {
    console.error('Error getting requester email:', e);
  }
  
  // Get owner email
  let ownerEmail = '';
  try {
    const ownerUser = await adminApp.auth().getUser(request.ownerId);
    ownerEmail = ownerUser.email || '';
  } catch (e) {
    console.error('Error getting owner email:', e);
  }
  
  return {
    id: requestId,
    ...request,
    bookTitle: book?.title || 'Unknown Book',
    bookOwner: ownerEmail.split('@')[0] || 'Unknown',
    requesterEmail,
    ownerEmail
  };
}

// Owner: incoming
router.get('/incoming', authRequired, async (req, res, next) => {
  try {
    const snap = await coll().where('ownerId','==',req.user.id).get();
    const enriched = await Promise.all(snap.docs.map(d => enrichRequest(d)));
    res.json(enriched);
  } catch (e) { next(e); }
});

// Me: my requests
router.get('/me', authRequired, async (req, res, next) => {
  try {
    const snap = await coll().where('requesterId','==',req.user.id).get();
    const enriched = await Promise.all(snap.docs.map(d => enrichRequest(d)));
    res.json(enriched);
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

// Messages collection helper
const messages = (requestId) => db.collection('requests').doc(requestId).collection('messages');

// Get messages for a request
router.get('/:id/messages', authRequired, async (req, res, next) => {
  try {
    const requestRef = coll().doc(req.params.id);
    const requestSnap = await requestRef.get();
    if (!requestSnap.exists) return res.status(404).json({ error: 'Request not found' });
    const request = requestSnap.data();
    
    // Verify user is either owner or requester
    if (request.ownerId !== req.user.id && request.requesterId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Get messages ordered by creation time (Firestore will auto-create index if needed)
    const messagesSnap = await messages(req.params.id).orderBy('createdAt', 'asc').get();
    const messagesList = messagesSnap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    res.json(messagesList);
  } catch (e) { next(e); }
});

// Send a message
router.post('/:id/messages', authRequired, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Message text required' });
    
    const requestRef = coll().doc(req.params.id);
    const requestSnap = await requestRef.get();
    if (!requestSnap.exists) return res.status(404).json({ error: 'Request not found' });
    const request = requestSnap.data();
    
    // Verify user is either owner or requester
    if (request.ownerId !== req.user.id && request.requesterId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const isOwner = request.ownerId === req.user.id;
    const messageDoc = await messages(req.params.id).add({
      text: text.trim(),
      senderId: req.user.id,
      senderEmail: req.user.email,
      isOwner,
      createdAt: Date.now()
    });
    
    const messageSnap = await messageDoc.get();
    res.status(201).json({ id: messageSnap.id, ...messageSnap.data() });
  } catch (e) { next(e); }
});

export default router;
