# 📚 Book Buddy — Firebase Edition

> A modern book exchange platform built with React, Firebase, and Express. Connect with fellow readers, share your favorite books, and discover new reads in your community.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Firestore Security Rules](#firestore-security-rules)
- [Environment Variables](#environment-variables)
- [Development Features](#development-features)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [License](#license)

## 🎯 Overview

Book Buddy is a full-stack book exchange application that allows users to:
- Register and authenticate securely using Firebase Auth
- List books they want to share with others
- Search and browse available books by title, author, or tags
- Request to borrow books from other users
- Manage incoming and outgoing book requests with status updates
- Chat in real-time with other users about book requests
- View and manage their profile information

The application uses a **monorepo structure** with a React frontend and Express backend, leveraging Firebase for authentication and database services. Real-time messaging is powered by Firestore's real-time listeners.

## ✨ Features

- 🔐 **Secure Authentication**: User registration and login via Firebase Auth (email/password)
- 📖 **Book Management**: Add, edit, delete, and view books with full CRUD operations
- 🔍 **Search Functionality**: Search books by title, author, or tags (case-insensitive)
- 📬 **Request System**: Request books and manage incoming/outgoing requests with status tracking
- ⚡ **Real-time Updates**: Live data synchronization using Firestore listeners
- 🔒 **Permission Control**: Owner-only permissions for updates and deletes
- 💬 **Real-time Messaging**: Chat functionality with instant message delivery via Firestore
- 👤 **User Profiles**: View and update user profile information (display name, photo, bio, etc.)
- 📊 **Request Status Management**: Track requests through pending, approved, declined, and completed states
- 🎨 **Modern UI**: Clean, responsive interface with sidebar navigation

## 🛠 Tech Stack

### Frontend
- **React 18+** - UI library
- **Vite** - Build tool and dev server
- **Firebase SDK v10+** - Client-side authentication and Firestore access
- **Firestore Real-time Listeners** - For live message updates

### Backend
- **Node.js 18+** - Runtime environment
- **Express 4.x** - Web framework
- **Firebase Admin SDK v12+** - Server-side Firebase operations
- **Jest 29+** - Testing framework
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

### Database & Services
- **Cloud Firestore** - NoSQL database with real-time capabilities
- **Firebase Authentication** - User authentication service

## 📁 Project Structure

```
book-buddy-firebase/
├── backend/                 # Express API server
│   ├── __tests__/          # Test files
│   │   ├── auth.test.js    # Authentication middleware tests
│   │   ├── books.test.js   # Book filtering and search tests
│   │   ├── listings.test.js # Listing management tests
│   │   └── utils.test.js   # Utility function tests
│   ├── routes/             # API route handlers
│   │   ├── books.js        # Book CRUD operations
│   │   ├── requests.js     # Request management + messaging
│   │   ├── profile.js      # User profile endpoints
│   │   └── seed.js         # Development seeding endpoint
│   ├── auth.js             # Firebase auth middleware
│   ├── firebase.js         # Firebase Admin initialization
│   ├── logic.js            # Pure business logic functions
│   ├── server.js           # Express server entry point
│   ├── jest.config.js      # Jest configuration
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── AddBook.jsx      # Add new book form
│   │   │   ├── BookDetail.jsx   # Book detail view with request
│   │   │   ├── BookList.jsx    # Book listing component
│   │   │   ├── Home.jsx        # Main home page with search
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── MyListings.jsx  # User's book listings
│   │   │   ├── MyRequests.jsx  # Chat/requests interface
│   │   │   ├── Navbar.jsx      # Navigation component
│   │   │   └── Register.jsx    # Registration page
│   │   ├── api.js          # API client wrapper
│   │   ├── firebase.js     # Firebase client config + helpers
│   │   ├── App.jsx         # Main app component with routing
│   │   ├── main.jsx        # Entry point
│   │   └── styles.css      # Global styles
│   ├── public/             # Static assets
│   │   └── logo.svg        # Book Buddy logo
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   └── package.json
├── firestore.rules         # Firestore security rules
└── README.md
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Firebase Account** with a project created
- **Firebase CLI** (optional, for deploying rules)

### Firebase Project Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** with Email/Password provider:
   - Go to Authentication → Sign-in method
   - Enable Email/Password provider
3. Enable **Cloud Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode (we'll add rules later)
   - Choose your preferred region
4. Get your Firebase configuration:
   - Go to Project Settings → General → Your apps → Web app
   - Copy the Firebase configuration object
5. Generate Service Account Key:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file (you'll need this for the backend)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nitesh-kumar-15-DessertEngineers
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file:
   ```bash
   touch .env
   ```

3. Configure Firebase Admin credentials. You have **two options**:

   **Option A: Inline JSON (Recommended for development)**
   ```env
   FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
   ```
   Copy the entire Service Account JSON and paste it as a **single line** in your `.env` file.

   **Option B: File Path**
   ```env
   FIREBASE_CREDENTIALS_PATH=./serviceAccount.json
   # OR
   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json
   ```
   Place your `serviceAccount.json` file in the backend directory.

4. (Optional) Set custom port:
   ```env
   PORT=4000
   ```

5. (Optional) Disable seed endpoint in production:
   ```env
   ALLOW_DEV_SEED=false
   ```

### Frontend Configuration

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Create a `.env` file:
   ```bash
   touch .env
   ```

3. Add your Firebase configuration and API URL:
   ```env
   VITE_API_URL=http://localhost:4000

   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

   Replace all `your_*` values with your actual Firebase project configuration from Firebase Console.

## ▶️ Running the Application

### Development Mode

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   The API will be available at `http://localhost:4000`
   You should see: `Book Buddy API (Firebase) on http://localhost:4000`

2. **Start the Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be available at `http://localhost:5173`
   Vite will display the local and network URLs.

3. Open your browser and navigate to `http://localhost:5173`

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview  # Preview the production build
```

**Backend:**
```bash
cd backend
npm start  # Runs in production mode
```

## 🧪 Testing

### Backend Tests

Run the test suite from the backend directory:

```bash
cd backend
npm test
```

The project includes tests for:
- **Authentication middleware** (`auth.test.js`) - Token verification
- **Book operations** (`books.test.js`) - Filtering and search logic
- **Listings management** (`listings.test.js`) - Listing operations
- **Utility functions** (`utils.test.js`) - Helper functions

**Note:** Some tests in `books.test.js` are intentionally failing to demonstrate test scenarios. These can be fixed by updating the expected values.

### Test Structure

Tests use Jest with ES modules. The `logic.js` file contains pure functions that are easily testable without Firebase dependencies.

## 📡 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication

All protected routes require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

The frontend automatically handles token retrieval and inclusion in requests via the `api.js` client.

### Endpoints

#### Books

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/api/books?q=term` | No | Search books by title, author, or tags (case-insensitive) |
| `GET` | `/api/books/:id` | No | Get book details by ID |
| `POST` | `/api/books` | Yes | Create a new book listing |
| `PUT` | `/api/books/:id` | Yes (Owner) | Update a book (owner only) |
| `DELETE` | `/api/books/:id` | Yes (Owner) | Delete a book (owner only) |
| `GET` | `/api/books/me/listings` | Yes | Get current user's book listings |

**Book Object Structure:**
```json
{
  "id": "book-id",
  "ownerId": "user-id",
  "title": "Book Title",
  "author": "Author Name",
  "condition": "Good",
  "description": "Book description",
  "tags": ["tag1", "tag2"],
  "status": "available",
  "imageUrl": "https://...",
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

#### Requests

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/requests` | Yes | Create a book request |
| `GET` | `/api/requests/incoming` | Yes | Get incoming requests (for book owners) |
| `GET` | `/api/requests/me` | Yes | Get current user's outgoing requests |
| `PUT` | `/api/requests/:id` | Yes (Owner) | Update request status (pending/approved/declined/completed) |
| `GET` | `/api/requests/:id/messages` | Yes (Participant) | Get messages for a request |
| `POST` | `/api/requests/:id/messages` | Yes (Participant) | Send a message in a request conversation |

**Request Object Structure:**
```json
{
  "id": "request-id",
  "bookId": "book-id",
  "ownerId": "owner-user-id",
  "requesterId": "requester-user-id",
  "type": "borrow",
  "message": "Request message",
  "status": "pending",
  "createdAt": 1234567890,
  "bookTitle": "Book Title",
  "bookOwner": "owner-username",
  "requesterEmail": "requester@email.com",
  "ownerEmail": "owner@email.com"
}
```

**Request Status Values:**
- `pending` - Initial status when request is created
- `approved` - Owner approved the request
- `declined` - Owner declined the request
- `completed` - Request has been completed

**Message Object Structure:**
```json
{
  "id": "message-id",
  "text": "Message content",
  "senderId": "user-id",
  "senderEmail": "user@email.com",
  "isOwner": true,
  "createdAt": 1234567890
}
```

#### Profile

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/api/profile/me` | Yes | Get current user profile (creates if doesn't exist) |
| `PUT` | `/api/profile/me` | Yes | Update user profile |

**Profile Update Fields:**
- `displayName` - User's display name
- `photoURL` - Profile photo URL
- `phone` - Phone number
- `campus` - Campus/location
- `bio` - User biography

#### Development

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/dev/seed` | No | Seed database with demo books (only if collection is empty) |

**Note:** The seed endpoint is disabled if `ALLOW_DEV_SEED=false` is set in environment variables.

### Response Format

**Success Response:**
```json
{
  "id": "...",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (not owner/not authorized)
- `404` - Not Found
- `500` - Server Error

## 🔒 Firestore Security Rules

**⚠️ Important:** The Firestore security rules must be deployed for the application to work correctly, especially for real-time features like messaging.

### Deploy Rules via Firebase CLI

1. Install Firebase CLI (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project root (if not already done):
   ```bash
   firebase init firestore
   ```
   When prompted, select `firestore.rules` as your rules file.

4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Manual Deployment

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules**
4. Copy the contents of `firestore.rules`
5. Paste into the rules editor
6. Click **Publish**

### Security Rules Overview

The rules enforce:

- **Books Collection** (`/books/{id}`):
  - ✅ Public read access
  - ✅ Authenticated users can create
  - ✅ Only owner can update/delete

- **Requests Collection** (`/requests/{requestId}`):
  - ✅ Authenticated users can read/create
  - ✅ Only owner can update status
  - ✅ Messages subcollection (`/requests/{requestId}/messages/{messageId}`):
    - ✅ Only request participants (owner or requester) can read
    - ✅ Only participants can create messages
    - ❌ Messages cannot be updated or deleted (immutable)

- **Users Collection** (`/users/{userId}`):
  - Handled by backend API (not directly accessible from client)

## 🔐 Environment Variables

### Frontend Variables

All frontend variables must be prefixed with `VITE_` to be accessible in the React app.

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | Yes | `http://localhost:4000` |
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key | Yes | `AIza...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Yes | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | Yes | `my-project` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | Yes | `project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | Yes | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | Yes | `1:123:web:abc` |

### Backend Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firebase Service Account JSON (one-line) | Yes* | `{"type":"service_account",...}` |
| `FIREBASE_CREDENTIALS_PATH` | Path to service account JSON file | Yes* | `./serviceAccount.json` |
| `GOOGLE_APPLICATION_CREDENTIALS` | Alternative path variable | Yes* | `./serviceAccount.json` |
| `PORT` | Server port | No | `4000` (default) |
| `ALLOW_DEV_SEED` | Enable seed endpoint | No | `false` (default: enabled) |

*At least one of the Firebase credential variables must be set.

**⚠️ Security Note:** 
- Never commit `.env` files or service account credentials to version control
- Add `.env` to `.gitignore`
- For production, use environment variables or secret management services
- The `serviceAccount.json` file contains sensitive credentials - keep it secure

## 🛠 Development Features

### Demo Data Seeding

The application includes a seed endpoint that populates the database with demo books. This is useful for:
- Initial setup and testing
- Demonstrating the application
- Development and UI testing

**To seed demo data:**
1. Ensure the books collection is empty
2. Make a POST request to `/api/dev/seed`:
   ```bash
   curl -X POST http://localhost:4000/api/dev/seed
   ```
3. Or use the "Load demo books" button in the frontend (appears when no books exist)

**Seed Endpoint Behavior:**
- Only works if the books collection is empty
- Can be disabled by setting `ALLOW_DEV_SEED=false`
- Adds 8 demo books with various genres and conditions

### Real-time Messaging

The application implements real-time messaging using Firestore's `onSnapshot` listeners:

- Messages are stored in a subcollection: `requests/{requestId}/messages`
- Frontend uses `listenToMessages()` helper from `firebase.js`
- Messages update in real-time without page refresh
- Only request participants can see and send messages

### Business Logic

The `backend/logic.js` file contains pure functions for:
- Book filtering and search
- Permission checks (can edit, can request)
- Request status validation
- Token parsing

These functions are easily testable and don't depend on Firebase or Express.

## 🐛 Troubleshooting

### Common Issues

#### 1. **Firebase Authentication Errors**

**Problem:** "Firebase: Error (auth/configuration-not-found)" or "Firebase: Error (auth/api-key-not-valid)"

**Solution:**
- Verify all `VITE_FIREBASE_*` environment variables are set correctly in `frontend/.env`
- Ensure Firebase Authentication is enabled in Firebase Console
- Check that Email/Password provider is enabled
- Verify the API key is correct in Firebase Console

#### 2. **CORS Errors**

**Problem:** "Access to fetch at 'http://localhost:4000' from origin 'http://localhost:5173' has been blocked by CORS policy"

**Solution:**
- Ensure the backend server is running
- Check that CORS is properly configured in `backend/server.js` (should be enabled by default)
- Verify `VITE_API_URL` matches the backend URL exactly
- Check browser console for specific CORS error details

#### 3. **Firestore Permission Denied**

**Problem:** "Missing or insufficient permissions" when trying to read/write data

**Solution:**
- Deploy Firestore security rules (see [Firestore Security Rules](#firestore-security-rules))
- Verify rules are correctly formatted (check `firestore.rules` file)
- Ensure user is authenticated (check Firebase Auth token)
- Verify the rules match your data structure
- Check Firebase Console → Firestore → Rules for any syntax errors

#### 4. **Service Account JSON Error**

**Problem:** "Firebase Admin not initialized" or "Error loading service account credentials"

**Solution:**
- Ensure `FIREBASE_SERVICE_ACCOUNT_JSON` is a valid JSON string (one line, properly escaped)
- If using file path, verify the file exists and path is correct
- Check that the service account has proper permissions in Firebase Console
- Verify the JSON is complete (not truncated)
- Try using the file path method instead: `FIREBASE_CREDENTIALS_PATH=./serviceAccount.json`

#### 5. **Port Already in Use**

**Problem:** "Error: listen EADDRINUSE: address already in use :::4000"

**Solution:**
- Change the port in backend `.env`: `PORT=4001`
- Update frontend `.env`: `VITE_API_URL=http://localhost:4001`
- Or stop the process using port 4000:
  ```bash
  # macOS/Linux
  lsof -ti:4000 | xargs kill
  
  # Windows
  netstat -ano | findstr :4000
  taskkill /PID <PID> /F
  ```

#### 6. **Module Not Found Errors**

**Problem:** "Cannot find module '...'"

**Solution:**
- Delete `node_modules` and `package-lock.json`:
  ```bash
  rm -rf node_modules package-lock.json
  ```
- Run `npm install` again
- Ensure you're in the correct directory (backend or frontend)
- Check that all dependencies are listed in `package.json`

#### 7. **Real-time Messages Not Updating**

**Problem:** Messages don't appear in real-time or listener doesn't work

**Solution:**
- Verify Firestore security rules are deployed (especially messages subcollection rules)
- Check browser console for Firestore permission errors
- Ensure you're authenticated (check `auth.currentUser`)
- Verify the request ID is correct
- Check that Firestore indexes are created (if using complex queries)
- Ensure Firestore is enabled in your Firebase project

#### 8. **Environment Variables Not Loading**

**Problem:** `import.meta.env.VITE_*` variables are undefined

**Solution:**
- Ensure variables are prefixed with `VITE_`
- Restart the Vite dev server after changing `.env` file
- Check that `.env` file is in the `frontend/` directory
- Verify no typos in variable names
- For backend, ensure `dotenv` is configured and `.env` is in `backend/` directory

#### 9. **Seed Endpoint Not Working**

**Problem:** Seed endpoint returns "Seeding disabled" or doesn't add books

**Solution:**
- Check if `ALLOW_DEV_SEED=false` is set (remove it or set to `true`)
- Ensure books collection is empty (seed only works on empty collection)
- Verify backend server is running
- Check backend logs for errors

## 💻 Development

### Development Workflow

1. **Start both servers** (backend and frontend) in separate terminals
2. **Make changes** to your code
3. **Hot reload** is enabled - changes will reflect automatically:
   - Frontend: Vite HMR (Hot Module Replacement)
   - Backend: Restart server manually or use nodemon (if configured)
4. **Run tests** before committing:
   ```bash
   cd backend && npm test
   ```

### Code Structure

- **Backend**: Express routes handle API endpoints, Firebase Admin SDK for server-side operations
- **Frontend**: React components with Firebase client SDK for authentication and Firestore access
- **Authentication Flow**:
  1. User logs in via Firebase Auth (frontend)
  2. Frontend retrieves ID token using `auth.currentUser.getIdToken()`
  3. Token sent in `Authorization: Bearer <token>` header for protected routes
  4. Backend verifies token using Firebase Admin SDK
  5. User info attached to `req.user = { id, email, name }`

### Real-time Messaging Implementation

The messaging system uses Firestore subcollections:

```
requests/
  {requestId}/
    messages/
      {messageId}/
        - text: string
        - senderId: string
        - senderEmail: string
        - isOwner: boolean
        - createdAt: timestamp
```

Frontend uses `onSnapshot` to listen for new messages:
```javascript
const unsubscribe = listenToMessages(requestId, (messages) => {
  setMessages(messages)
})
```

### Best Practices

- Keep API URL in `VITE_API_URL` for easy environment switching
- For production, use environment-specific Firebase projects
- Store Service Account credentials securely (use environment variables or secret management)
- Consider implementing Firestore indexes for better query performance as data grows
- Add input validation and sanitization for user inputs
- Implement rate limiting for production
- Use Firebase App Check for additional security in production
- Monitor Firestore usage and costs
- Set up Firebase error reporting

### Testing Strategy

- **Unit Tests**: Test pure functions in `logic.js`
- **Integration Tests**: Test API endpoints with mocked Firebase
- **E2E Tests**: Consider adding Cypress or Playwright for full user flows

### Future Enhancements

- [ ] Add Firestore query indexes for optimized search
- [ ] Implement pagination for book listings
- [ ] Add book rating/review system
- [ ] Implement push notifications for request updates
- [ ] Add book cover image uploads (Firebase Storage)
- [ ] Implement user profiles with avatars
- [ ] Add book categories and advanced filtering
- [ ] Implement book exchange history
- [ ] Add email notifications for requests
- [ ] Implement book recommendations
- [ ] Add social features (follow users, see their books)
- [ ] Implement book wishlist
- [ ] Add location-based book search
- [ ] Implement book condition photos
- [ ] Add analytics dashboard

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Made with ❤️ for book lovers everywhere**
