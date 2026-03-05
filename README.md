# YORK AIoT Society Website

A modern React website for the YORK AIoT Society with a built-in admin CMS powered by Firebase.

## Quick Start

```bash
npm install
npm run dev
```

## Firebase Setup

This project uses Firebase for real-time content management and authentication.

### Firebase Project Details
- **Project ID:** `aiot-d9c90`
- **Firestore Database:** Enabled (collection: `site`, document: `content` - auto-created on first run)
- **Authentication:** Email/Password enabled

### Setup Steps

1. **Environment Variables**
   
   Create a `.env` file in the project root with your Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

2. **Add Admin User**
   
   Go to Firebase Console → Authentication → Users → Add User
   - Enter email and password for your admin account

3. **Set Firestore Security Rules**
   
   Go to Firebase Console → Firestore → Rules tab and paste:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /site/content {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

4. **Never commit `.env` to GitHub**
   
   The `.env` file is already in `.gitignore`

## Admin Access

Access the admin panel via the secret Konami sequence on the main site, or navigate directly to `/admin?key=your_admin_key`.

## Features

- Real-time content sync across all browsers
- Firebase Authentication for secure admin access
- Live connection indicator in admin panel
- Offline support with automatic reconnection
- Export/Import content as JSON backup
