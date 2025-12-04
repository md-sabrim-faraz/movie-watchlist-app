# 🎬 CineTrack - Movie Watchlist Application

A modern, responsive movie watchlist application built with React, TypeScript, and Vite. Browse popular movies, search by title, and manage your personal watchlist with a beautiful, intuitive interface.

## ✨ Features

- 🔍 **Search Movies** - Search for movies by title using the TMDB API
- 📋 **Browse Popular Movies** - Discover trending and popular movies
- ⭐ **Personal Watchlist** - Add and remove movies from your watchlist
- 🔐 **User Authentication** - Secure login/signup system with protected routes
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🎨 **Modern UI** - Built with Tailwind CSS and smooth animations
- 🚀 **Fast Performance** - Powered by Vite for lightning-fast development

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **Icons:** Lucide React
- **API:** The Movie Database (TMDB) API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or pnpm package manager
- A TMDB API key (free - get it from [TMDB](https://www.themoviedb.org/settings/api))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd movie-watchlist-app
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using pnpm:

```bash
pnpm install
```

### 3. Set Up Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Open `.env` and add your TMDB API key:

```env
VITE_TMDB_API_KEY=your_actual_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

**How to get a TMDB API key:**

1. Go to [TMDB](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API
4. Request an API key (choose "Developer" option)
5. Copy your API key to the `.env` file

### 4. Run the Development Server

```bash
pnpm dev
```

The application will open at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 🏗️ Project Structure

```
movie-watchlist-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── WatchlistButton.tsx
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.tsx
│   ├── lib/                 # Utility functions and helpers
│   │   ├── auth.ts
│   │   ├── storage.ts
│   │   └── types.ts
│   ├── pages/               # Page components
│   │   ├── LoginPage.tsx
│   │   ├── MovieDetailsPage.tsx
│   │   ├── SearchPage.tsx
│   │   └── WatchlistPage.tsx
│   ├── services/            # API services
│   │   ├── tmdb.ts
│   │   └── watchlist.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## 🎯 Key Features Explained

### Authentication System

- Mock authentication system for demonstration
- Protected routes for watchlist access
- Login/signup functionality
- Session persistence using localStorage

### Movie Search

- Real-time search using TMDB API
- Debounced search (300ms delay)
- Displays popular movies by default
- Returns to popular movies when search is cleared

### Watchlist Management

- Add/remove movies from personal watchlist
- Persistent storage using localStorage
- Separate watchlists for different users
- Visual indicators for movies in watchlist

### Movie Details

- Comprehensive movie information
- Poster, title, genres, plot summary
- Release date and ratings
- Direct watchlist management from details page

## 🔒 Security Notes

- The `.env` file is excluded from Git (in `.gitignore`)
- Never commit your actual API keys
- TMDB API keys are client-side and have built-in rate limits

### Modifying API Endpoints

Edit `src/services/tmdb.ts` to change API behavior or add new endpoints.

## 🐛 Troubleshooting

### API Key Issues

- Ensure your TMDB API key is valid
- Check that the `.env` file is in the root directory
- Restart the dev server after changing `.env`

### Build Errors

- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### TypeScript Errors

- Run type checking: `npm run typecheck`
- Ensure all dependencies are installed

### Demo video Google Drive link ``

## 👨‍💻 Author

Your Name - MD. Sabrim Faraz

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the movie data API
- [Lucide](https://lucide.dev/) for the beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework

---

**Happy movie tracking! 🎬🍿**
