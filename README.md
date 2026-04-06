# 🚀 MERN Portfolio — Production-Ready Full-Stack Developer Portfolio

A premium, production-ready personal portfolio website built with the full MERN stack. Features a stunning dark-themed UI with Framer Motion animations, a secure admin panel with JWT auth, dynamic project management, and a contact inbox — all deployable for free.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Folder Structure](#2-folder-structure)
3. [Dependencies](#3-dependencies)
4. [Environment Variables](#4-environment-variables)
5. [Backend File Explanations](#5-backend-file-explanations)
6. [Frontend File Explanations](#6-frontend-file-explanations)
7. [Setup Instructions](#7-setup-instructions)
8. [Deployment Guide](#8-deployment-guide)
9. [API Reference](#9-api-reference)
10. [Final Notes](#10-final-notes)

---

## 1. Project Overview

### What It Is

A complete full-stack portfolio website for a developer named "Aman Shah" (fully customisable). It showcases projects, skills, an about page, and a contact form — all backed by a real MongoDB database with an Express API. An admin panel (protected by JWT) lets the portfolio owner add/edit/delete projects and read contact messages.

### Key Features

- **Premium Dark UI** — void-black background, phosphor-green accents, Framer Motion animations
- **Dynamic Projects** — stored in MongoDB, fetched via API, filterable by category
- **Contact System** — form stores messages in DB; admin reads them in an inbox UI
- **Admin Panel** — JWT-secured dashboard with full project CRUD and message management
- **Production-Ready** — CORS, Helmet, rate limiting, input validation, error handling
- **Free Deployment** — Vercel (frontend) + Render (backend) + MongoDB Atlas (database)

### Tech Stack

| Layer    | Technology                                                      |
| -------- | --------------------------------------------------------------- |
| Frontend | React 18, Vite, Tailwind CSS v3, Framer Motion, React Router v6 |
| Backend  | Node.js, Express 4, Mongoose 8                                  |
| Database | MongoDB (via MongoDB Atlas)                                     |
| Auth     | JWT (jsonwebtoken) + bcryptjs                                   |
| Fonts    | Clash Display, Cabinet Grotesk, JetBrains Mono                  |

---

## 2. Folder Structure

```
portfolio/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Auth logic (login, register, profile)
│   │   ├── contactController.js   # Contact form submission & admin inbox
│   │   └── projectController.js   # Project CRUD operations
│   ├── middleware/
│   │   └── auth.js                # JWT verification middleware
│   ├── models/
│   │   ├── User.js                # Admin user schema (bcrypt password)
│   │   ├── Project.js             # Project schema with all fields
│   │   └── Contact.js             # Contact message schema
│   ├── routes/
│   │   ├── auth.js                # POST /login, POST /register, GET /profile
│   │   ├── projects.js            # GET/POST/PUT/DELETE /projects
│   │   └── contact.js             # POST /contact, GET/DELETE (admin)
│   ├── .env.example               # Template for environment variables
│   ├── .env                       # Your actual env (DO NOT commit)
│   ├── package.json
│   ├── seed.js                    # Seeds DB with admin user + sample projects
│   └── server.js                  # Express app entry point
│
└── frontend/
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── AdminLayout.jsx    # Admin panel shell with sidebar
    │   │   │   ├── Footer.jsx         # Site footer with social links
    │   │   │   ├── MainLayout.jsx     # Public pages shell (Navbar + Footer)
    │   │   │   ├── Navbar.jsx         # Sticky navbar with mobile menu
    │   │   │   ├── PageLoader.jsx     # Suspense fallback spinner
    │   │   │   └── ProtectedRoute.jsx # JWT-guarded route wrapper
    │   │   └── sections/
    │   │       ├── FeaturedProjects.jsx  # Home page project cards
    │   │       ├── HeroSection.jsx       # Animated landing hero
    │   │       └── SkillsSection.jsx     # Animated skill bars + tech cloud
    │   ├── context/
    │   │   └── AuthContext.jsx        # Global auth state (login/logout)
    │   ├── pages/
    │   │   ├── About.jsx              # About page with timeline
    │   │   ├── Contact.jsx            # Contact form page
    │   │   ├── Home.jsx               # Landing page
    │   │   ├── Projects.jsx           # Filterable projects grid
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx  # Stats + recent messages overview
    │   │       ├── AdminLogin.jsx      # Admin sign-in form
    │   │       ├── AdminMessages.jsx   # Contact inbox management
    │   │       └── AdminProjects.jsx   # Project CRUD with modal form
    │   ├── utils/
    │   │   └── api.js                # Axios instance + API method exports
    │   ├── App.jsx                   # Route definitions + providers
    │   ├── index.css                 # Tailwind + global styles + CSS vars
    │   └── main.jsx                  # React DOM entry point
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 3. Dependencies

### Backend

```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "express-validator": "^7.0.1",
  "morgan": "^1.10.0",
  "dotenv": "^16.3.1"
}
```

### Frontend

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.1",
  "axios": "^1.6.2",
  "framer-motion": "^10.16.16",
  "react-hot-toast": "^2.4.1",
  "react-type-animation": "^3.2.0",
  "react-intersection-observer": "^9.5.3",
  "lucide-react": "^0.303.0",
  "tailwindcss": "^3.4.0"
}
```

---

## 4. Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio
JWT_SECRET=your_32+_char_secret_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-portfolio.vercel.app
NODE_ENV=production
ADMIN_EMAIL=admin@yoursite.com
ADMIN_PASSWORD=YourSecurePassword123!
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

> **Security Notes:**
>
> - `JWT_SECRET` must be at least 32 characters of random characters
> - Never commit `.env` files to Git
> - Use strong unique passwords for admin

---

## 5. Backend File Explanations

### `server.js`

The Express application entry point. Responsibilities:

- Loads environment variables via `dotenv`
- Applies security middleware: `helmet` (HTTP headers), `cors` (cross-origin), `express-rate-limit` (brute-force protection)
- Sets up JSON body parsing with a 10kb limit
- Mounts all routes under `/api`
- Registers a global error handler that sanitises error messages in production
- Connects to MongoDB via Mongoose before starting the HTTP server

### `models/User.js`

Mongoose schema for admin accounts. Key design decisions:

- `password` field has `select: false` — never accidentally returned in queries
- `pre('save')` hook bcrypt-hashes the password with cost factor 12 when modified
- `comparePassword()` instance method provides safe credential comparison
- `toJSON()` transform strips the password field from serialised responses

### `models/Project.js`

Rich project schema supporting: title, description, short description, tech stack (array), GitHub/live links, image URL, category enum, featured boolean, display order integer, and status enum. Indexes on `order` and `featured` optimise the most common query patterns.

### `models/Contact.js`

Contact message schema with: sender details, subject, message body, `isRead` boolean flag, and IP address for spam tracking. Compound index on `{isRead, createdAt}` makes the admin unread filter query efficient.

### `middleware/auth.js`

JWT verification middleware. Flow:

1. Extracts `Bearer <token>` from `Authorization` header
2. Verifies token signature and expiry with `jwt.verify()`
3. Fetches the user from MongoDB to confirm they still exist
4. Attaches the user to `req.user` and calls `next()`
5. Returns 401 with specific messages for missing/invalid/expired tokens

### `controllers/authController.js`

- `register()` — creates the first admin (rejects if one exists); returns JWT
- `login()` — validates credentials, updates `lastLogin`, returns JWT
- `getProfile()` — returns the authenticated user's data
- `changePassword()` — verifies current password before updating

### `controllers/projectController.js`

Standard CRUD + reorder:

- `getProjects()` — accepts `?category=`, `?featured=true`, `?limit=N` query params
- `createProject()` — auto-assigns `order = max(order) + 1`
- `updateProject()` / `deleteProject()` — standard find-and-update/delete with 404 handling
- `reorderProjects()` — accepts `{ projects: [{id, order}] }` and bulk-updates order fields

### `controllers/contactController.js`

- `submitContact()` (public) — validates input, captures IP, persists to DB
- `getMessages()` (admin) — paginated listing with unread filter + count
- `getMessage()` (admin) — fetches message AND marks it as read atomically
- `deleteMessage()` (admin) — permanent delete with 404 guard

### `seed.js`

Development seed script. Run once to populate the DB with:

- An admin user (credentials from `.env`)
- 6 realistic sample projects across different categories
- 1 sample contact message

---

## 6. Frontend File Explanations

### `src/main.jsx`

React 18 entry point using `createRoot`. Wraps `<App>` in `StrictMode` and imports global CSS.

### `src/App.jsx`

Defines the entire routing tree using React Router v6. Uses `lazy()` + `Suspense` for code-splitting every page. `AuthProvider` wraps all routes. Admin routes are wrapped in `ProtectedRoute`. `Toaster` is placed at the app root to handle all toast notifications globally.

### `src/index.css`

Core stylesheet with:

- Tailwind `@base/@components/@utilities` directives
- CSS custom properties (design tokens) for all colours, surfaces, and borders
- Custom scrollbar styling
- Reusable `.glass`, `.btn-primary`, `.btn-secondary`, `.card`, `.input-field`, `.tag`, `.section-label` component classes
- `text-gradient-*` utility classes for coloured text
- Keyframe animations used across components

### `src/utils/api.js`

Configured Axios instance that:

- Reads `VITE_API_URL` for the base URL
- Injects `Authorization: Bearer <token>` on every request via request interceptor
- Handles 401 responses by clearing auth state and redirecting admin routes to login
- Exports typed API methods grouped by resource: `projectsAPI`, `contactAPI`, `authAPI`

### `src/context/AuthContext.jsx`

React Context providing `{ user, isAuthenticated, loading, login, logout }`:

- On mount, reads token from `localStorage` and validates it against the backend
- `login()` persists token + user to `localStorage` and updates state
- `logout()` clears storage and resets state
- `loading` prevents flash-redirect when refreshing a protected page

### `src/components/common/Navbar.jsx`

Premium sticky navbar with:

- Scroll-aware background blur activation
- Active route indicator (animated dot using `layoutId` for shared layout animation)
- Mobile hamburger with `AnimatePresence` icon swap
- Slide-down mobile menu with staggered link entrance animation

### `src/components/sections/HeroSection.jsx`

Full-viewport hero with:

- Animated background orbs (CSS keyframe float animation)
- Grid overlay texture
- Staggered content reveal via Framer Motion `containerVariants` + `itemVariants`
- `TypeAnimation` component cycling through role titles
- Animated underline on the name using `motion.span` with `scaleX` transition
- Stat cards with staggered scale-in animation

### `src/components/sections/SkillsSection.jsx`

Skills showcase with:

- Three category columns (Frontend, Backend, Database/Cloud)
- Animated progress bars triggered by Intersection Observer (only animate when visible)
- Tech cloud of 20+ technologies with staggered scale-in entrance
- Each bar fills from 0 to the skill's percentage with an easeOut spring

### `src/components/sections/FeaturedProjects.jsx`

Home page project cards that:

- Fetch featured projects from the API with `useEffect`
- Use `whileHover={{ y: -6 }}` for lift effect
- Show a colour-coded top accent line that animates in after card entrance
- Display tech tags, status, and GitHub/live links
- Handle loading and empty states gracefully

### `src/pages/About.jsx`

Full about page with:

- Two-column bio + profile card layout
- Vertical timeline for work history and education with animated dot connectors
- Values grid with emoji icons and staggered card entrance
- Download CV and contact CTAs

### `src/pages/Projects.jsx`

Filterable project grid with:

- Category filter tabs updating `activeCategory` state
- Search box filtering by title, description, or tech stack
- `useMemo` for efficient filtering without re-fetching
- `AnimatePresence` + `motion.div layout` for smooth card exit/enter animations
- Empty state with "clear filters" action

### `src/pages/Contact.jsx`

Contact form with:

- Local validation before submission (no external library)
- Axios submission to `/api/contact`
- Character counter on the message field
- Success state with animated checkmark (replaces the form on send)
- React Hot Toast notifications for success/error

### `src/pages/admin/AdminLogin.jsx`

Standalone admin login (not inside `MainLayout`):

- Redirects to dashboard if already authenticated
- Shows/hides password toggle
- Inline error message on bad credentials
- Animated entrance and background orb

### `src/pages/admin/AdminDashboard.jsx`

Overview dashboard with:

- Parallel data fetching (projects + messages) in one `useEffect`
- Animated stat cards with skeleton loading state
- Recent messages list with unread dot indicators
- Quick action links to common tasks

### `src/pages/admin/AdminProjects.jsx`

Full CRUD project management:

- Data table with category colour badges, featured star, status label, and action buttons
- `ProjectFormModal` — reused for both create and edit; includes tech stack tag input (add by typing + Enter/comma)
- `DeleteConfirm` modal with explicit confirmation step
- `AnimatePresence` to animate modals in/out

### `src/pages/admin/AdminMessages.jsx`

Two-panel inbox:

- Left panel: message list with unread/read visual states
- Right panel: full message detail with reply-by-email link
- Marks message as read when selected (optimistic update)
- Filter tabs (all / unread) with pagination
- Delete with confirmation modal

---

## 7. Setup Instructions

### Prerequisites

- Node.js v18+ and npm v9+
- MongoDB Atlas account (free tier) OR local MongoDB
- Git

### Step 1 — Clone / Download

```bash
# If using git
git clone https://github.com/yourusername/mern-portfolio.git
cd mern-portfolio

# Or extract the downloaded zip
cd portfolio
```

### Step 2 — Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# → Edit .env with your MongoDB URI and JWT secret (see Section 4)

# Seed the database (optional but recommended)
node seed.js
# This creates: 1 admin user + 6 sample projects + 1 sample message

# Start the development server
npm run dev
# Server runs at http://localhost:5000
# Test it: http://localhost:5000/api/health
```

### Step 3 — Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api  (default for dev)

# Start the development server
npm run dev
# App runs at http://localhost:5173
```

### Step 4 — First Login

After seeding, go to **http://localhost:5173/admin/login** and use:

- Email: `admin@portfolio.dev`
- Password: `Admin@123456`

### Step 5 — Customise Your Portfolio

**Change your name / info:**

- `frontend/src/components/sections/HeroSection.jsx` — name, bio, stats
- `frontend/src/pages/About.jsx` — bio, timeline, contact details
- `frontend/src/components/common/Footer.jsx` — social links
- `frontend/src/components/common/Navbar.jsx` — logo text

**Change theme colours:**

- `frontend/tailwind.config.js` — extend colours
- `frontend/src/index.css` — CSS custom properties

**Add your resume:**

- Place `resume.pdf` in `frontend/public/`

---

## 8. Deployment Guide

### Step 1 — MongoDB Atlas (Free Database)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) and create a free account
2. Create a **free M0 cluster** (512MB, enough for a portfolio)
3. Under **Database Access**, create a user with password
4. Under **Network Access**, add `0.0.0.0/0` (allow all IPs — required for Render)
5. Click **Connect → Drivers** and copy the connection string:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

### Step 2 — Deploy Backend on Render (Free)

1. Go to [render.com](https://render.com) and sign up with GitHub
2. Click **New → Web Service**
3. Connect your GitHub repository (push your code first)
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** `Node`
5. Under **Environment Variables**, add all variables from `backend/.env`:
   ```
   MONGODB_URI       = mongodb+srv://...
   JWT_SECRET        = your_strong_secret_here
   JWT_EXPIRES_IN    = 7d
   NODE_ENV          = production
   FRONTEND_URL      = https://your-app.vercel.app  (add after Vercel deploy)
   ADMIN_EMAIL       = your@email.com
   ADMIN_PASSWORD    = YourStrongPassword!
   ```
6. Deploy. Note your Render URL: `https://portfolio-api-xxxx.onrender.com`

> **Note:** Free Render services spin down after 15 min of inactivity. First request takes ~30s to wake up. Upgrade to Render Starter ($7/mo) to eliminate cold starts.

### Step 3 — Deploy Frontend on Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **Add New → Project** and import your repository
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   ```
   VITE_API_URL = https://portfolio-api-xxxx.onrender.com/api
   ```
5. Deploy. Note your Vercel URL: `https://your-portfolio.vercel.app`

### Step 4 — Connect Frontend + Backend

1. **Update Render environment variable:**
   - Go to Render dashboard → your service → Environment
   - Update `FRONTEND_URL` to `https://your-portfolio.vercel.app`
   - Redeploy the backend

2. **Verify CORS works:**
   - Open your Vercel URL
   - Open browser DevTools → Network tab
   - Navigate to Projects page — API calls should succeed (status 200)
   - If you see CORS errors, double-check `FRONTEND_URL` matches exactly (including `https://`)

### Step 5 — Seed Production Database

```bash
# From your local machine, pointing at the production DB:
cd backend
MONGODB_URI="mongodb+srv://..." node seed.js
```

Or use the admin panel at `https://your-portfolio.vercel.app/admin` to add projects manually.

### Step 6 — Custom Domain (Optional, Free)

**Vercel:**

1. Vercel Dashboard → Domains → Add your domain
2. Update your domain registrar's DNS with the provided CNAME/A records

**Update CORS:**
After adding a custom domain, update `FRONTEND_URL` on Render to your custom domain.

---

## 9. API Reference

### Authentication

| Method | Endpoint                    | Auth | Description                            |
| ------ | --------------------------- | ---- | -------------------------------------- |
| POST   | `/api/auth/register`        | No   | Create first admin (blocked if exists) |
| POST   | `/api/auth/login`           | No   | Login, returns JWT                     |
| GET    | `/api/auth/profile`         | Yes  | Get current admin profile              |
| PUT    | `/api/auth/change-password` | Yes  | Change admin password                  |

### Projects

| Method | Endpoint                | Auth | Description                                               |
| ------ | ----------------------- | ---- | --------------------------------------------------------- |
| GET    | `/api/projects`         | No   | List all projects (supports ?category, ?featured, ?limit) |
| GET    | `/api/projects/:id`     | No   | Get single project                                        |
| POST   | `/api/projects`         | Yes  | Create project                                            |
| PUT    | `/api/projects/:id`     | Yes  | Update project                                            |
| DELETE | `/api/projects/:id`     | Yes  | Delete project                                            |
| PUT    | `/api/projects/reorder` | Yes  | Bulk update project order                                 |

### Contact

| Method | Endpoint                | Auth | Description                                     |
| ------ | ----------------------- | ---- | ----------------------------------------------- |
| POST   | `/api/contact`          | No   | Submit contact form (rate-limited: 5/hour)      |
| GET    | `/api/contact`          | Yes  | List messages (supports ?page, ?limit, ?unread) |
| GET    | `/api/contact/:id`      | Yes  | Get + mark as read                              |
| PATCH  | `/api/contact/:id/read` | Yes  | Mark as read                                    |
| DELETE | `/api/contact/:id`      | Yes  | Delete message                                  |

### Request Headers (authenticated routes)

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 10. Final Notes

### Personalisation Checklist

- [x] Replaced "Alex Morgan" with "Aman Shah" throughout
- [ ] Update bio text in `HeroSection.jsx` and `About.jsx`
- [ ] Update social links in `Navbar.jsx`, `Footer.jsx`, `About.jsx`, `Contact.jsx`
- [ ] Replace `alex@portfolio.dev` with your actual email
- [ ] Add your `resume.pdf` to `frontend/public/`
- [ ] Update location in `About.jsx`
- [ ] Update timeline with your real work history
- [ ] Add your real projects via the admin panel
- [ ] Optional: Replace emoji avatar in `About.jsx` with a real photo

### Performance Tips

- Images: Use WebP format, host on Cloudinary or Uploadthing (free tiers available)
- Fonts: The Fontshare CDN import may occasionally be slow; consider self-hosting
- Render cold starts: Add a health-check ping service (e.g., UptimeRobot free tier) to keep the backend warm

### Security Checklist

- [ ] Change `JWT_SECRET` to a 32+ character random string in production
- [ ] Change admin password from the default
- [ ] Ensure `.env` files are in `.gitignore`
- [ ] Keep `ADMIN_EMAIL` and `ADMIN_PASSWORD` out of seed.js for production
- [ ] Regularly rotate your JWT secret

### Extending the Project

- **Image uploads:** Integrate Cloudinary or AWS S3 for project screenshots
- **Blog:** Add a `Post` model and `/blog` page for technical articles
- **Analytics:** Add a simple `pageviews` counter or integrate Plausible/Umami (privacy-friendly)
- **Dark/Light toggle:** The CSS variable system makes this straightforward to add
- **Email notifications:** Integrate Nodemailer or Resend to email yourself on new contact submissions

---

Built with ❤️ using React, Node.js, Express, and MongoDB.
