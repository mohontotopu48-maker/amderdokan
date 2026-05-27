# আমাদের দোকান - Vercel Deployment Guide

## Quick Deploy to Vercel

### Step 1: Fork/Clone the Repository
```bash
git clone https://github.com/mohontotopu48-maker/amderdokan.git
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import the `amderdokan` repository
4. Configure Environment Variables:
   - `DATABASE_URL` = Your PostgreSQL/MySQL connection string
   - `ADMIN_PASSWORD` = Your admin password (default: admin123)
5. Click "Deploy"

### Step 3: Set Up Database
After deployment, run the seed command to populate the database:
```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma db push
npm run db:seed
```

## Important Notes

### Database Requirements
- **SQLite will NOT work on Vercel** (serverless = no persistent filesystem)
- Use **PostgreSQL** (recommended) or **MySQL**
- Free options: [Supabase](https://supabase.com), [Neon](https://neon.tech), [PlanetScale](https://planetscale.com)

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Database connection string |
| `ADMIN_PASSWORD` | ❌ | Admin login password (default: admin123) |

### Switching from SQLite to PostgreSQL
1. Update `prisma/schema.prisma`:
   ```
   datasource db {
     provider = "postgresql"  // change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL` in Vercel environment variables
3. Run `npx prisma db push` to create tables
4. Run `npm run db:seed` to populate data

## Architecture
- **Frontend**: Next.js 16 + Tailwind CSS 4 + shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM (SQLite for dev, PostgreSQL for production)
- **State**: Zustand (client), Prisma (server)
- **Auth**: Cookie-based admin authentication
