# 📚 Book Buddy — Firebase Edition (Auth + Firestore)

A book exchange app with **Firebase Auth** (email/password) and **Cloud Firestore**, plus a lightweight **Express** API for business rules.

## Monorepo
```
book-buddy-firebase/
  backend/        # Express API (verifies Firebase ID tokens, Firestore CRUD)
  frontend/       # React (Vite) — uses Firebase Auth client SDK
```

## Prereqs
- Node 18+
- Firebase project (enable **Authentication** and **Firestore**)

---
## Backend setup
```bash
cd backend
cp .env.example .env
# Put your Firebase Service Account JSON (compressed one-line) into FIREBASE_SERVICE_ACCOUNT_JSON=...
npm i
npm run dev     # -> http://localhost:4000
```

**Routes**
- `GET  /api/books?q=term`
- `POST /api/books` (auth) create
- `GET  /api/books/:id`
- `PUT  /api/books/:id` (owner)
- `DELETE /api/books/:id` (owner)
- `GET  /api/books/me/listings` (auth)
- `POST /api/requests` (auth)
- `GET  /api/requests/incoming` (auth, owner inbox)
- `GET  /api/requests/me` (auth)
- `PUT  /api/requests/:id {status}` (auth, owner)

Auth is enforced by verifying **Firebase ID tokens** from the `Authorization: Bearer <idToken>` header.

---
## Frontend setup
```bash
cd ../frontend
npm i
npm run dev       # -> http://localhost:5173
```

Create `frontend/.env` with your Firebase web config + API URL:
```ini
VITE_API_URL=http://localhost:4000

VITE_FIREBASE_API_KEY=YOUR_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=XXXX
VITE_FIREBASE_APP_ID=1:XXXX:web:YYYY
```

**Auth flow**
- React uses Firebase Auth for **login/register**.
- For protected API calls, frontend fetches a fresh **ID token** and sends it as `Bearer`.
- Backend verifies token → attaches `req.user = { id, email, name }`.

---
## Firestore Security Rules (optional if all writes go via backend)
If you also access Firestore directly from the client, add rules like:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function signedIn() { return request.auth != null; }

    match /books/{id} {
      allow read: if true;
      allow create: if signedIn();
      allow update, delete: if signedIn() && resource.data.ownerId == request.auth.uid;
    }

    match /requests/{id} {
      allow read, create: if signedIn();
      allow update: if signedIn() && resource.data.ownerId == request.auth.uid;
    }
  }
}
```

---
## Notes
- Keep API URL in `VITE_API_URL` (Vite env). Backend runs on 4000 by default.
- Replace search with Firestore queries/indexes later if dataset grows.
- For production, store the Service Account securely (not in repo).
