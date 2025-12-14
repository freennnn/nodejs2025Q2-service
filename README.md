# Home Library Service

NestJS music library API with PostgreSQL database, containerized with Docker.

## Quick Start

### Docker (Recommended)

```bash
# Development
npm run docker:build:dev

# Production
npm run docker:build:prod

# Stop containers
npm run docker:down
```

The API will be available at `http://localhost:4000`

## Running the Application

### Option 1: Full Docker Setup

```bash
# Development with hot reload
npm run docker:up:dev

# Production
npm run docker:up:prod
```

### Option 2: Hybrid Mode (Database in Docker, App Locally)

Useful for running tests or local development:

```bash
# Start database in Docker
npm run dev:db

# Setup Prisma and start app locally
npm run dev:hybrid
```

This runs:
- PostgreSQL in Docker container
- NestJS app locally (connects to Docker database)
- Prisma migrations and code generation

### Option 3: Local Development (No Docker)

Requires local PostgreSQL installation:

```bash
# Install dependencies
npm install

# Setup database
npm run dev:setup

# Start app
npm run start:dev
```

## Running Tests

**Prerequisites:** The application must be running and accessible at `http://localhost:4000`

### Test Modes

```bash
# Run all tests (without auth)
npm run test

# Run all tests (with auth)
npm run test:auth

# Run specific test suite
npm run test -- <path-to-suite>
npm run test:auth -- <path-to-suite>

# Run refresh token tests
npm run test:refresh
```

### Running Tests with Docker

Tests work with Docker setup since the app container exposes port 4000:

```bash
# Start app in Docker
npm run docker:up:dev

# In another terminal, run tests
npm run test:auth
```

### Running Tests with Hybrid Mode

Hybrid mode is ideal for testing - database in Docker, app runs locally:

```bash
# Start database and app locally
npm run dev:hybrid

# In another terminal, run tests
npm run test:auth
```

## API Documentation

- **Swagger UI**: `http://localhost:4000/doc` (when app is running)
- **OpenAPI Spec**: `doc/api.yaml`

## Environment Variables

Create `.env.dev` or `.env.prod` files with:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/home-library?schema=public
POSTGRES_DB=home-library
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Application
PORT=4000
NODE_ENV=development

# JWT
JWT_SECRET_KEY=your-secret-key
JWT_SECRET_REFRESH_KEY=your-refresh-secret
TOKEN_EXPIRE_TIME=30m
TOKEN_REFRESH_EXPIRE_TIME=7d

# Password Hashing
CRYPT_SALT=10

# Logging
LOG_LEVEL=INFO
LOG_DIR=./logs
LOG_MAX_FILE_SIZE=1024
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run docker:up:dev` | Start dev containers |
| `npm run docker:build:dev` | Build and start dev containers |
| `npm run docker:up:prod` | Start production containers |
| `npm run docker:build:prod` | Build and start prod containers |
| `npm run docker:down` | Stop all containers |
| `npm run dev:hybrid` | Database in Docker, app locally |
| `npm run start:dev` | Start app locally (dev mode) |
| `npm run test` | Run tests without auth |
| `npm run test:auth` | Run tests with auth |
| `npm run lint` | Lint and auto-fix |
| `npm run format` | Format code |

## Features

- RESTful API for Users, Artists, Albums, Tracks, Favorites
- JWT Authentication with Bearer tokens
- PostgreSQL with Prisma ORM
- Docker containerization
- Comprehensive logging
- OpenAPI/Swagger documentation
