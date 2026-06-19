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

Never commit your real `.env` file. Only `.env.example` (with placeholder values) is tracked in git.


## Project Structure

```
app/
  api/applications/         # API route handlers (REST)
  applications/             # List, view, add, edit pages
  settings/                 # Settings page
  page.js                   # Dashboard
components/                 # Feature components + shadcn/ui primitives
lib/prisma.js               # Prisma client singleton
prisma/                     # Schema, migrations, seed script
```
