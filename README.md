# Notely - Modern Note-Taking Application

A modern, responsive note-taking application showcasing seamless note creation, editing, and real-time synchronization with offline-first capabilities.

## Features

- **Rich Text Editing**: Powered by Tiptap for a smooth and extensible editing experience
- **Real-Time Synchronization**: Seamless sync across devices with Supabase backend
- **Offline-First**: Works offline with IndexedDB and syncs when connection is restored
- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop devices
- **Progressive Web App (PWA)**: Install as a native app on mobile and desktop with offline support
- **Service Worker**: Intelligent caching strategy for fast load times and offline functionality
- **User Authentication**: Secure login and registration with Supabase
- **Toast Notifications**: Real-time user feedback with react-hot-toast
- **TypeScript**: Type-safe codebase for better development experience

## Tech Stack

- **Frontend Framework**: React 19.2.5
- **Build Tool**: Vite 8.0.10
- **Language**: TypeScript 6.0.2
- **Styling**: Tailwind CSS 4.2.4
- **Rich Text Editor**: Tiptap 3.22.4
- **Backend & Database**: Supabase with PostgreSQL
- **Local Storage**: IndexedDB via idb 8.0.3
- **Routing**: React Router DOM 7.14.2
- **Notifications**: React Hot Toast 2.6.0
- **Icons & Utilities**: UUID 14.0.0
- **Linting**: ESLint 10.2.1

## Installation

Clone the repository:
```bash
git clone <repository-url>
cd notely
```

Install dependencies:
```bash
npm install
```

## Development

To run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` with hot module reload (HMR) enabled.

## Build

To build for production:

```bash
npm run build
```

The optimized build output will be in the `dist/` directory.

## Preview

To preview the production build locally:

```bash
npm run preview
```

## Linting

To run ESLint:

```bash
npm run lint
```

## Progressive Web App (PWA)

Notely is a fully-featured PWA that can be installed on any device:

- **Install on Home Screen**: Add to home screen on iOS, Android, Windows, or macOS
- **Offline Support**: Service Worker caches assets for offline access
- **Native App Experience**: Runs in standalone mode without browser UI
- **Web App Manifest**: Configured with app icons, theme colors, and metadata
- **Fast Load Times**: Intelligent caching ensures quick app startup

### Installing Notely

**On Mobile (iOS/Android):**
1. Open Notely in your browser
2. Tap the share button (iOS) or menu button (Android)
3. Select "Add to Home Screen" or "Install"

**On Desktop (Chrome/Edge):**
1. Open Notely in your browser
2. Click the install button in the address bar
3. Click "Install"

## Project Structure

```
src/
├── components/     # Reusable React components
│   ├── NoteEditor.tsx
│   ├── NoteList.tsx
│   └── StatusBar.tsx
├── pages/          # Page components
│   ├── AuthGuard.tsx
│   ├── Login.tsx
│   ├── Notes.tsx
│   └── Register.tsx
├── hooks/          # Custom React hooks
│   ├── useNotes.ts
│   └── useSync.ts
├── lib/            # Utility libraries
│   ├── db.ts
│   └── supabase.ts
├── assets/         # Static assets
├── App.tsx         # Root application component
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## Author

Kenneth Jhun N. Balino

Full Stack Developer

Built with React, Vite, and Tailwind CSS
