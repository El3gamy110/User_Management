# User Management (Json Server Auth)

A full-stack authentication and user management web application built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **TanStack React Query**, backed by a JWT-authenticated **JSON Server** API (`json-server` + `json-server-auth`).

---

## Features

### Authentication & Session Management
- **Register & Login** (`/register`, `/login`) with split-screen layouts and password visibility toggles.
- **JWT Authentication** via `json-server-auth` with bcrypt password hashing and automatic `Authorization: Bearer <token>` header injection through Axios interceptors.
- **Session Persistence** storing the JWT token in cookies (`js-cookie`, supporting 1-day or 7-day "Remember me" expiry) and user profile data in `localStorage`.
- **Route Protection** guarding `/dashboard` and redirecting unauthenticated visitors to `/login`.

### Dashboard & Analytics
- **Overview Tab**:
  - Real-time KPI cards (Total Users, Active Accounts, Administrators, Inactive Accounts).
  - User composition breakdown bars across roles and statuses.
  - Interactive SVG donut chart toggling between **Status** (Active vs. Inactive) and **Role** (Admins vs. Standard Users).
  - Recent users feed with quick View/Edit actions, Quick Actions panel, and live Auth API Server status card.

### Users Management (Full CRUD)
- **Users Tab**:
  - Paginated users table with real-time search by name or email and row selection.
  - Modal dialogs to **Create** (`POST /users`), **View**, **Edit** (`PATCH /users/:id`), and **Delete** (`DELETE /users/:id`) users.
  - Live refetching, loading/error states, and dismissible success toast notifications.

### User Profile
- **Profile Tab**: View and update the currently authenticated user's full name and email (`GET` / `PATCH /users/:id`), automatically syncing local session state.

### Responsive UI
- Desktop sticky sidebar and mobile slide-over drawer navigation.

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend (`client/`)** | Next.js 16, React 19, TypeScript 5, Tailwind CSS v4, TanStack React Query v5, Axios, `js-cookie`, Lucide React, GSAP, `next-intl`, `next-themes` |
| **Backend (`server/`)** | Node.js, `json-server` v0.17, `json-server-auth` v2.1, `db.json` flat-file store |

---

## Project Structure

```text
User_Management/
├── client/                         # Next.js frontend application
│   ├── public/                     # Static assets
│   └── src/
│       ├── animations/             # GSAP / motion helpers
│       ├── app/                    # Next.js App Router pages
│       │   ├── dashboard/page.tsx  # Protected Users Management dashboard
│       │   ├── login/page.tsx      # Login page
│       │   ├── register/page.tsx   # Registration page
│       │   ├── layout.tsx          # Root layout & providers
│       │   └── page.tsx            # Redirects to /login
│       ├── config/env.ts           # API URL & app constants
│       ├── features/
│       │   ├── auth/               # Auth API, hooks, login/register forms
│       │   └── users/              # Users CRUD API, hooks, dashboard, modals, table
│       ├── i18n/ & messages/       # next-intl localization setup (en, ar)
│       ├── Providers/              # React Query & language providers
│       ├── services/               # Axios instance, ApiClient, tokenService, error helpers
│       └── shared/                 # Reusable atoms, hooks, and API types
└── server/                         # Mock REST & JWT Auth API
    ├── db.json                     # JSON database (users collection)
    ├── server.js                   # Custom json-server + json-server-auth entrypoint
    └── package.json
```

---

## Getting Started

### Prerequisites
- **Node.js** v20+
- **npm**

### 1. Clone the Repository

```bash
git clone https://github.com/El3gamy110/User_Management.git
cd User_Management
```

### 2. Run the Backend API (`server/`)

```bash
cd server
npm install
```

Start `json-server` with `json-server-auth` on port **3005** (matches the client's default `API_URL`):

```bash
npx json-server db.json -m ./node_modules/json-server-auth --port 3005
```

> **Alternative (`server.js`):** You can also run `npm start` inside `server/`, which starts `server.js` on port `3007`. If you use port `3007`, set `NEXT_PUBLIC_API_URL=http://localhost:3007` in `client/.env.local`.

### 3. Run the Frontend App (`client/`)

Open a new terminal window:

```bash
cd client
npm install
```

*(Optional)* Create a `client/.env.local` file if your backend runs on a custom URL/port:

```env
NEXT_PUBLIC_API_URL=http://localhost:3005
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Visiting `/` automatically redirects to `/login`.

---

## Configuration

Client configuration is centralized in `client/src/config/env.ts`:

| Variable / Setting | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3005` | Base URL for all Axios API requests |
| `API_TIMEOUT` | `10000` (ms) | Request timeout in milliseconds |
| `ACCESS_TOKEN_KEY` | `accessToken` | Cookie key used to store the JWT |
| `USER_STORAGE_KEY` | `authUser` | `localStorage` key for the logged-in user object |
| `DISABLE_DASHBOARD_PROTECTION` | `false` | Set to `true` only if bypassing the client auth guard during local development |

---

## Application Routes

| Route | Description |
| --- | --- |
| `/` | Redirects to `/login` |
| `/login` | Sign in with email and password |
| `/register` | Create a new account and sign in |
| `/dashboard` | Protected workspace with **Dashboard Overview**, **Users Management**, and **My Profile** tabs |

---

## API Endpoints

Base URL: `http://localhost:3005` (or your configured `NEXT_PUBLIC_API_URL`)

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/register` | Register a new user and receive `{ accessToken, user }` |
| `POST` | `/login` | Authenticate an existing user and receive `{ accessToken, user }` |
| `GET` | `/users` | Fetch all users |
| `GET` | `/users/:id` | Fetch a single user by ID |
| `POST` | `/users` | Create a new user account |
| `PATCH` | `/users/:id` | Partially update a user's details (name, email, role, status) |
| `DELETE` | `/users/:id` | Delete a user by ID |

### Example Request (`POST /register`)

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "User",
  "status": "Active"
}
```

---

## Available Scripts

### Frontend (`client/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js development server (`next dev --webpack`) |
| `npm run build` | Build the production application |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

### Backend (`server/`)

| Command | Description |
| --- | --- |
| `npm start` | Start the custom JSON Server (`node server.js` on port `3007`) |

---

## Notes

- The backend uses `server/db.json` as a local flat-file database and `json-server-auth` JWT tokens (1-hour default expiry).
- This setup is intended for prototyping, frontend integration, and learning—not for production deployment.
