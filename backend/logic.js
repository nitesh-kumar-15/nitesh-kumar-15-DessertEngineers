// src/lib/logic.js
// All pure functions for easy unit testing (no API / DB / Firebase).

/** Mock login check against an in-memory user store. */
export function checkLogin(users, email, password) {
  if (!email || !password) return false;
  const u = users.find(u => u.email === email);
  return !!u && u.password === password;
}

/** Filter books the same way your GET /api/books does (title/author/tags; case-insensitive). */
/* Mirrors: includes on title, author, and tags; lowercased. */
export function filterBooks(rows, q) {
  const s = (q || '').toLowerCase();
  if (!s) return rows.slice();
  return rows.filter(b =>
    (b.title || '').toLowerCase().includes(s) ||
    (b.author || '').toLowerCase().includes(s) ||
    (Array.isArray(b.tags) ? b.tags : []).some(t => (t || '').toLowerCase().includes(s))
  );
}

/** Find a listing by id; return null if not found. */
export function findListingById(rows, id) {
  return rows.find(b => b.id === id) || null;
}

/** Can the given user edit the listing? */
export function canEditListing(book, userId) {
  if (!book || !userId) return false;
  return book.ownerId === userId;
}

/** Can the user request this book? (not their own) */
export function canRequestBook(book, userId) {
  if (!book || !userId) return false;
  return book.ownerId !== userId;
}

/** Validate request status value. */
const VALID_STATUSES = ['pending','approved','declined','completed'];
export function validateRequestStatus(status) {
  return VALID_STATUSES.includes(status);
}

/** Parse "Authorization" header like authRequired: "Bearer <token>" -> token or null. */
export function parseBearer(hdr) {
  const h = hdr || '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
}
