# 📚 Book Buddy — Firebase Edition (Auth + Firestore)

A book exchange app with **Firebase Auth** (email/password) and **Cloud Firestore**, plus a lightweight **Express** API for business rules.

## Tech Stack
- Frontend: React (Vite), Firebase Auth
- Backend: Node.js, Express
- Database: Firestore (Cloud Firestore)
- Authentication: Firebase Auth (email/password)



## Features
- User registration/login via Firebase Auth
- Add, edit, delete, and view books
- Search books by title, author, or tags
- Request books and manage incoming/outgoing requests
- Real-time updates using Firestore
- Owner-only permissions for updates and deletes




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
## Firestore Security Rules
**Required for real-time chat functionality!** 

The project includes `firestore.rules` with complete security rules. Deploy them to Firebase:

```bash
firebase deploy --only firestore:rules
```

Or manually copy the rules from `firestore.rules` to your Firebase Console → Firestore Database → Rules.

The rules include:
- Books: Public read, authenticated create, owner-only update/delete
- Requests: Authenticated read/create, owner-only update
- Messages: Only request participants (owner or requester) can read/write messages

**Note:** Real-time chat requires these rules to be deployed. Without them, the frontend won't be able to listen to messages.

---
## Notes
- Keep API URL in `VITE_API_URL` (Vite env). Backend runs on 4000 by default.
- Replace search with Firestore queries/indexes later if dataset grows.
- For production, store the Service Account securely (not in repo).

## Quick Start
1. Register a new account on the frontend.
2. Add a book via the "Add Book" form.
3. Search or browse books.
4. Send a request to borrow a book.
5. Accept or reject incoming requests in your inbox.

 ## Environment Variables Table
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Backend Service Account JSON |


## License
This project is licensed under the MIT License.
