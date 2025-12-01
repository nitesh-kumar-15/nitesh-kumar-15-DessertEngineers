import { auth } from './firebase';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function bearer() {
  const u = auth.currentUser;
  if (!u) return null;
  return await u.getIdToken();
}

async function api(path, { method='GET', body, authRequired=false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (authRequired) {
    const t = await bearer();
    if (t) headers['Authorization'] = 'Bearer ' + t;
  }
  const res = await fetch(API_BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const BooksAPI = {
  list(q='') { return api('/api/books' + (q ? `?q=${encodeURIComponent(q)}` : '')); },
  create(b) { return api('/api/books', { method:'POST', authRequired:true, body:b }); },
  get(id) { return api('/api/books/'+id); },
  update(id, b) { return api('/api/books/'+id, { method:'PUT', authRequired:true, body:b }); },
  remove(id) { return api('/api/books/'+id, { method:'DELETE', authRequired:true }); },
  myListings() { return api('/api/books/me/listings', { authRequired:true }); }
};

export const ReqAPI = {
  create(r) { return api('/api/requests', { method:'POST', authRequired:true, body:r }); },
  incoming() { return api('/api/requests/incoming', { authRequired:true }); },
  mine() { return api('/api/requests/me', { authRequired:true }); },
  update(id, status) { return api('/api/requests/'+id, { method:'PUT', authRequired:true, body:{ status } }); },
  getMessages(requestId) { return api('/api/requests/'+requestId+'/messages', { authRequired:true }); },
  sendMessage(requestId, text) { return api('/api/requests/'+requestId+'/messages', { method:'POST', authRequired:true, body:{ text } }); }
};
