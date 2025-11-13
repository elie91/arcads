# Dynamic Arcads Real Estate

Fullstack application for real estate transaction management and reporting, built with NestJS (backend) and Next.js (frontend).

## Architecture

```
arcads/
├── arcads-api/          # NestJS Backend
├── arcads-web/          # Next.js Frontend
├── docker-compose.yml   # PostgreSQL Configuration
└── Makefile            # Project Management Commands
```

## Technologies

### Backend (arcads-api)

- **NestJS** - Node.js Framework
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **TypeScript** - Language
- **Jest** - Testing Framework

### Frontend (arcads-web)

- **Next.js 16** - React Framework
- **React 19** - UI Library
- **TanStack Query** - API State Management
- **Tailwind CSS** - CSS Framework
- **shadcn/ui** - UI Components
- **TypeScript** - Language

## Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**
- **Docker** and **Docker Compose** v2
- **Make** (optional but recommended)

## Quick Start

### Option 1: Complete Setup with Make (Recommended)

```bash
# Complete setup: install dependencies + DB + migrations + seed data
make setup

# Seed the database with test data
cd arcads-api && npm run prisma:seed

# Start development environment (API + Web + DB)
make dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api

### Option 2: Manual Setup

```bash
# 1. Install dependencies
cd arcads-api && npm install
cd ../arcads-web && npm install
cd ..

# 2. Start PostgreSQL
docker compose up -d postgres

# 3. Run Prisma migrations
cd arcads-api
npx prisma migrate dev
npx prisma generate

# 4. Seed the database with test data
npm run prisma:seed

# 5. Start the API (port 3001)
npm run start:dev

# 6. In another terminal, start the frontend (port 3000)
cd ../arcads-web
npm run dev
```

## Configuration

### Environment Variables

#### Backend (arcads-api/.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/arcads"
PORT=3001
NODE_ENV=development
```

#### Frontend (arcads-web/.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Available Make Commands

### Development

```bash
make dev          # Start API + Web + DB
make api-dev      # Start API only
make web-dev      # Start Web only
```

### Database

```bash
make db-up        # Start PostgreSQL
make db-down      # Stop PostgreSQL
make db-migrate   # Create/apply migrations
make db-generate  # Generate Prisma client
make db-reset     # Reset DB (⚠️ deletes all data)
make db-studio    # Open Prisma Studio (GUI)
```

**Seed Database:**
```bash
cd arcads-api && npm run prisma:seed
```
This populates the database with 103 test transactions.

### Build & Production

```bash
make build        # Build API + Web
make api-build    # Build API only
make web-build    # Build Web only
make start        # Start in production mode
```

### Maintenance

```bash
make install      # Install dependencies
make lint         # Lint code
make format       # Format code
make test         # Run API tests
make stop         # Stop all services
make clean        # Clean (node_modules, build, docker)
make help         # Display all commands
```

## API Endpoints

### Transactions

- `POST /transactions` - Create a new transaction
- `GET /transactions` - Get all transactions
- `GET /transactions/:id` - Get a transaction by ID

### Reports

- `GET /reports/highest-margin` - Top 5 transactions with highest margin
- `GET /reports/weekly-average-margin` - Weekly average margin comparison
- `GET /reports/city-performance` - Top 5 cities by average transaction value

## Testing

```bash
# Run all tests
cd arcads-api && npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

All 41 backend tests should pass successfully.

## Troubleshooting

### Port Already in Use

```bash
# Free port 3001 (API)
lsof -ti:3001 | xargs kill -9

# Free port 3000 (Web)
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
docker ps

# Restart the database
make db-down && make db-up

# Check logs
docker logs arcads-postgres
```

### Prisma Client Not Generated

```bash
cd arcads-api
npx prisma generate
```

### Empty Database

If your database is empty:
```bash
cd arcads-api
npm run prisma:seed
```
