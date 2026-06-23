# Job Application Tracker

A simple, clean web app to track and manage your job applications. Add applications, update their status as you move through interviews, search and filter, and keep everything in one place.

## Features

- Full CRUD for job applications (create, read, update, delete)
- List view with a data table
- View a single application's full details
- Add and edit applications with form validation
- Delete with a confirmation dialog
- Status tracking: Applied, Interviewing, Offer, Rejected
- Filter applications by status
- Search by company name or job title
- Dashboard with summary stats and recent applications
- Email/password authentication (signup, login, logout) with JWT session cookies
- Protected routes — unauthenticated users are redirected to the login page
- Loading skeletons, empty states, and toast notifications
- Light and dark mode
- Responsive layout

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** JavaScript
- **Database:** PostgreSQL
- **ORM:** Prisma 7 (with the `@prisma/adapter-pg` driver adapter)
- **UI:** Tailwind CSS v4 + shadcn/ui components
- **Forms:** React Hook Form + Zod
- **Auth:** JWT session tokens signed with `jose`, hashed passwords via `bcryptjs`, stored in an HTTP-only cookie
- **Icons:** lucide-react
- **Toasts:** sonner
- **Theming:** next-themes

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your database connection string:

```bash
cp .env.example .env
```

Then edit `.env` and set `DATABASE_URL` (see [Environment Variables](#environment-variables) below).

### 3. Set up the database

Apply the Prisma migrations to create the database schema:

```bash
npx prisma migrate deploy
```

If you are developing locally and want to create new migrations as you change the schema, use:

```bash
npx prisma migrate dev
```

(Optional) Seed the database with 5 sample applications:

```bash
npm run seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build and run a production build

```bash
npm run build
npm run start
```

## Authentication

The app uses email/password authentication. Passwords are hashed with `bcryptjs`, and a signed JWT session token is stored in an HTTP-only `session` cookie (valid for 7 days).

A Next.js middleware protects all non-API pages: unauthenticated visitors are redirected to `/login`, and logged-in users visiting `/login` or `/signup` are redirected to the dashboard.

### Auth API Routes

| Method | Route              | Description                                                        |
| ------ | ------------------ | ------------------------------------------------------------------ |
| POST   | `/api/auth/signup` | Create an account. Sets the session cookie on success.             |
| POST   | `/api/auth/login`  | Log in with email and password. Sets the session cookie.           |
| POST   | `/api/auth/logout` | Clear the session cookie.                                          |
| GET    | `/api/auth/me`     | Return the currently authenticated user, or `401` if not signed in. |

**Signup** — body: `{ name?, email, password }`. `email` and `password` are required; password must be at least 6 characters. Returns `201` on success, `409` if the email already exists.

```json
{ "name": "Test User", "email": "tester@example.com", "password": "secret123" }
```

**Login** — body: `{ email, password }`. Returns `200` on success, `401` for invalid credentials.

```json
{ "email": "tester@example.com", "password": "secret123" }
```

Both `signup` and `login` respond with `{ success: true, data: { id, email, name } }` and set the `session` cookie automatically.

### Testing with Postman

Because the session is an HTTP-only cookie, you don't copy a token manually — Postman captures and reuses the cookie automatically. A full flow to verify auth:

1. `POST /api/auth/signup` (or `/api/auth/login`) → sets the `session` cookie.
2. `GET /api/auth/me` → returns your user (`success: true`).
3. `POST /api/auth/logout` → clears the cookie.
4. `GET /api/auth/me` again → now returns `401 Not authenticated.`

## API Routes

All routes return JSON in the shape `{ success: boolean, data?, message? }`.

| Method | Route                      | Description                                              |
| ------ | -------------------------- | -------------------------------------------------------- |
| GET    | `/api/applications`        | List all applications. Supports `?status=` and `?search=` query params. |
| POST   | `/api/applications`        | Create a new application.                                |
| GET    | `/api/applications/[id]`   | Get a single application by ID.                          |
| PATCH  | `/api/applications/[id]`   | Update the provided fields of an application.            |
| DELETE | `/api/applications/[id]`   | Delete an application by ID.                             |

### Query parameters (GET `/api/applications`)

- `status` — filter by one of `APPLIED`, `INTERVIEWING`, `OFFER`, `REJECTED`.
- `search` — case-insensitive match against company name or job title.

Example: `/api/applications?status=INTERVIEWING&search=acme`

## Environment Variables

| Variable       | Required | Description                                                                 |
| -------------- | -------- | --------------------------------------------------------------------------- |
| `DATABASE_URL` | Yes      | PostgreSQL connection string used by Prisma. See `.env.example` for the format. (Direct Connection String - Transaction Pooler)|
| `AUTH_SECRET`  | Yes      | Secret used to sign session JWTs. Use a long random string — generate one with `openssl rand -base64 32`. |

Never commit your real `.env` file. Only `.env.example` (with placeholder values) is tracked in git.


## Project Structure

```
app/
  api/applications/         # API route handlers (REST)
  api/auth/                 # Signup, login, logout, me endpoints
  applications/             # List, view, add, edit pages
  login/  signup/           # Auth pages
  settings/                 # Settings page
  page.js                   # Dashboard
components/                 # Feature components + shadcn/ui primitives
lib/auth.js                 # Session token + cookie helpers
lib/prisma.js               # Prisma client singleton
middleware.js               # Route protection / redirects
prisma/                     # Schema, migrations, seed script
```
