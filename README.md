# Home Library Service

NestJS music library API with PostgreSQL database, containerized with Docker for easy deployment.

## Features

- **RESTful API** for music library management (Users, Artists, Albums, Tracks, Favorites)
- **PostgreSQL Database** with Prisma ORM
- **Docker Containerization** with optimized images (< 500MB)
- **Automated Database Migrations** on startup
- **Production-Ready** with security scanning and best practices
- **OpenAPI Documentation** with Swagger UI

## 🐳 Docker Deployment (Recommended)

The easiest and recommended way to run the application in both development and production is via the provided npm scripts:

### 🚀 Docker Compose via npm scripts

You can use convenient npm scripts to manage Docker containers for both development and production:

| Command                   | Description                                                      |
|---------------------------|------------------------------------------------------------------|
| npm run docker:up:dev     | Start development containers using docker-compose and .env.dev     |
| npm run docker:build:dev  | Build and start dev containers using docker-compose and .env.dev   |
| npm run docker:up:prod    | Start production containers using docker-compose.prod.yml and .env.prod |
| npm run docker:build:prod | Build and start prod containers using docker-compose.prod.yml and .env.prod |
| npm run docker:down       | Stop and remove all containers                                    |

**Example:**

```bash
npm run docker:build:prod   # Build and start production containers
npm run docker:down         # Stop and remove all containers
```

---

The application is fully containerized and available on Docker Hub for easy deployment.

### Quick Start with Docker Hub Images

The fastest way to run the application using pre-built images:

```bash
# Download the docker-compose file
curl -O https://raw.githubusercontent.com/freennnn/nodejs2025Q2-service/main/docker-compose.prod.yml

# Start the application
docker-compose -f docker-compose.prod.yml up -d

# Access the API
curl http://localhost:4000/user
```

**Available Docker Hub Images:**

- **Application**: `freennnn/nodejs2025q2-service-app:latest` (446MB)
- **Database**: `freennnn/nodejs2025q2-service-postgres:latest` (391MB)

### Docker Architecture

```bash
┌─────────────────┐    Docker Network    ┌──────────────────┐
│  NestJS App     │ ←─────────────────→  │  PostgreSQL      │
│  (Container)    │    postgres:5432     │  (Container)     │
│  Port: 4000     │                      │  Port: 5432      │
└─────────────────┘                      └──────────────────┘
        ↑                                          ↑
   Host: 4000                               Host: 5432
```

### Build from Source (Development)

```bash
# Clone the repository
git clone https://github.com/freennnn/nodejs2025Q2-service.git
cd nodejs2025Q2-service

# Build and start with Docker Compose
docker-compose up --build -d

# View logs
docker-compose logs -f app

# Stop the application
docker-compose down
```

### Docker Configuration

**Image Optimization Features:**

- ✅ **Multi-stage builds** for minimal production size
- ✅ **Alpine Linux** base images for security
- ✅ **Non-root user** execution
- ✅ **Automated migrations** on startup
- ✅ **Health checks** and monitoring
- ✅ **Security scanning** with zero vulnerabilities

**Environment Variables:**

```bash
# Application
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/home-library?schema=public

# Database (in docker-compose)
POSTGRES_DB=home-library
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

### Production Deployment Options

#### 1. Docker Compose (Recommended for single machine)**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### 2. Cloud Platforms**

- **Railway**: Connect GitHub repo, auto-deploy
- **Heroku**: Use container registry
- **DigitalOcean**: App Platform with Docker
- **AWS**: ECS/Fargate with Docker Hub images

### Docker Files Structure

**Clean, organized Docker configuration:**

```bash
📦 Docker Configuration (Clean & Standard)
├── 🔧 docker-compose.yml              # Development with hot reloading
├── 🚀 docker-compose.prod.yml         # Production (uses Docker Hub)
├── 📱 Dockerfile                      # Multi-stage (dev + prod)
├── 🗄️  Dockerfile.postgres             # Database image (391MB)  
└── 🚫 .dockerignore                   # Build optimization
```

### Usage Summary

#### 🔧 Development Workflow (with Hot Reloading)

```bash
# Clone and develop with automatic restart on file changes
git clone https://github.com/freennnn/nodejs2025Q2-service.git
cd nodejs2025Q2-service

# Start development with hot reloading (default)
docker-compose up --build

# Make changes to src/ files - app automatically restarts! 🔥

# View logs (watch restart messages on file changes)
docker-compose logs -f app

# Stop development environment
docker-compose down
```

#### 🚀 Production Deployment

```bash
# Quick deployment (no build required)
curl -O https://raw.githubusercontent.com/freennnn/nodejs2025Q2-service/main/docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d

# Or clone and use production compose
git clone https://github.com/freennnn/nodejs2025Q2-service.git
cd nodejs2025Q2-service
docker-compose -f docker-compose.prod.yml up -d
```

## Security & Monitoring

```bash
npm run security:docker:all              # Security scan
docker-compose ps                        # Service status
docker-compose top                       # Process monitoring
```

### Database Setup

#### Option 1: Use Docker for database only**

```bash
docker-compose up postgres -d
```

#### Option 2: Local PostgreSQL**

1. Install PostgreSQL locally
2. Create database: `home-library`
3. Update `.env` with your database credentials

### Running application

```bash
# Development mode
npm run start:dev

# Production mode
npm start
```

## 📖 API Documentation

To view interactive API documentation:

1. **Online**: Copy `doc/api.yaml` content to <https://editor.swagger.io/>
2. **VS Code**: Install "Swagger Viewer" extension and preview the YAML file
3. **Browser**: After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing <http://localhost:4000/doc/>.

## API Endpoints

The application provides REST API endpoints for managing:

- **Users** (`/user`) - Create, read, update, delete users
- **Tracks** (`/track`) - Manage music tracks with artist/album references
- **Albums** (`/album`) - Manage music albums with artist references
- **Artists** (`/artist`) - Manage music artists
- **Favorites** (`/favs`) - Add/remove tracks, albums, and artists to/from favorites

All endpoints support standard CRUD operations. See the OpenAPI documentation for detailed API specifications.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```bash
npm run test
```

To run only one of all test suites

```bash
npm run test -- <path to suite>
```

To run all test with authorization

```bash
npm run test:auth
```

To run only specific test suite with authorization

```bash
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```bash
npm run lint
```

```bash
npm run format
```

## 🔒 Security

Security scanning is integrated into the development workflow:

```bash
# Audit npm dependencies
npm run security:audit

# Fix automatic vulnerabilities
npm run security:audit:fix

# Scan Docker images
npm run security:docker:all

# Complete security scan
npm run security:all
```

**Current Security Status:**

- ✅ Application Image: 0 vulnerabilities
- ⚠️ Database Image: 60 vulnerabilities (Go standard library - non-critical)

## 🚀 Versioning & Release Management

### Version Release Process

When releasing a new version of the application or database, follow this systematic approach:

### 1. Application Version Release

#### Step 1: Prepare the Release**

```bash
# Update version in package.json
npm version patch  # or minor/major
git add package.json package-lock.json
git commit -m "feat: bump version to X.X.X"
git tag v1.2.3
git push origin main --tags
```

#### Step 2: Build and Test Locally**

```bash
# Build optimized images
docker-compose build --no-cache

# Test the new version
docker-compose up -d
curl http://localhost:4000/user  # Verify API works

# Run security scan
npm run security:docker:all

# Stop test environment
docker-compose down
```

#### Step 3: Tag and Push to Docker Hub**

```bash
# Tag with version number
docker tag nodejs2025q2-service-app:latest freennnn/nodejs2025q2-service-app:v1.2.3
docker tag nodejs2025q2-service-app:latest freennnn/nodejs2025q2-service-app:latest

# Push both tags
docker push freennnn/nodejs2025q2-service-app:v1.2.3
docker push freennnn/nodejs2025q2-service-app:latest

# Verify upload
docker pull freennnn/nodejs2025q2-service-app:v1.2.3
```

#### Step 4: Update Production Compose Files**

```bash
# Update docker-compose.prod.yml with new version
sed -i 's/freennnn\/nodejs2025q2-service-app:latest/freennnn\/nodejs2025q2-service-app:v1.2.3/' docker-compose.prod.yml

# Commit the updated compose file
git add docker-compose.prod.yml
git commit -m "deploy: update production to v1.2.3"
git push origin main
```

### 2. Database Schema Changes & Migrations

### For Prisma Schema Updates:**

#### Step 1: Create Migration (Development)**

```bash
# Make schema changes in prisma/schema.prisma
# Generate migration
npx prisma migrate dev --name add_new_feature

# Test migration locally
docker-compose up postgres -d
npx prisma migrate deploy
npm run start:dev  # Test app with new schema
```

#### Step 2: Production Migration Strategy**

#### Option A: Zero-Downtime Migration (Recommended)**

```bash
# 1. Deploy migration-only version first
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

# 2. Verify schema update
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d home-library -c "\dt"

# 3. Deploy new application version
docker-compose -f docker-compose.prod.yml pull app
docker-compose -f docker-compose.prod.yml up -d app
```

#### Option B: Maintenance Window Migration**

```bash
# 1. Stop application (maintenance mode)
docker-compose -f docker-compose.prod.yml stop app

# 2. Backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres home-library > backup_$(date +%Y%m%d_%H%M%S).sql

# 3. Run migrations
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d home-library -c "SELECT version();"
docker-compose -f docker-compose.prod.yml pull app
docker-compose -f docker-compose.prod.yml up -d

# 4. Verify migration success
docker-compose -f docker-compose.prod.yml logs app | grep "migration"
curl http://localhost:4000/user  # Test API
```

#### 3. Database Version Release

**When updating PostgreSQL version:**

#### Step 1: Update Base Image**

```dockerfile
# In Dockerfile.postgres, update version
FROM postgres:16-alpine  # Update from 15 to 16
```

#### Step 2: Test Compatibility**

```bash
# Build new database image
docker build -f Dockerfile.postgres -t nodejs2025q2-service-postgres:v16 .

# Test with existing data
docker run -d --name test-postgres-v16 \
  -e POSTGRES_DB=home-library \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -v postgres_data:/var/lib/postgresql/data \
  nodejs2025q2-service-postgres:v16

# Verify compatibility
docker exec test-postgres-v16 psql -U postgres -d home-library -c "SELECT version();"
```

#### Step 3: Production Database Upgrade**

```bash
# 1. CRITICAL: Backup before upgrade
docker-compose -f docker-compose.prod.yml exec postgres pg_dumpall -U postgres > full_backup_$(date +%Y%m%d).sql

# 2. Stop application
docker-compose -f docker-compose.prod.yml down

# 3. Update image versions
# Edit docker-compose.prod.yml to use new postgres version

# 4. Start with new version
docker-compose -f docker-compose.prod.yml up -d

# 5. Verify upgrade
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -c "SELECT version();"
```

### Environment-Specific Versioning

**Development Environment:**

```bash
# Always use latest for development
docker-compose up --build -d
```

**Staging Environment:**

```bash
# Use specific versions for testing
docker-compose -f docker-compose.prod.yml up -d
# Test with: freennnn/nodejs2025q2-service-app:v1.2.3-rc1
```

**Production Environment:**

```bash
# Use stable, tested versions only
# Example: freennnn/nodejs2025q2-service-app:v1.2.3
docker-compose -f docker-compose.prod.yml up -d
```

### Rollback Procedures

**Application Rollback:**

```bash
# Quick rollback to previous version
docker-compose -f docker-compose.prod.yml stop app
docker pull freennnn/nodejs2025q2-service-app:v1.2.2  # Previous version
docker tag freennnn/nodejs2025q2-service-app:v1.2.2 freennnn/nodejs2025q2-service-app:latest
docker-compose -f docker-compose.prod.yml up -d app
```

**Database Rollback:**

```bash
# Restore from backup (if migration failed)
docker-compose -f docker-compose.prod.yml stop app
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -c "DROP DATABASE \"home-library\";"
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -c "CREATE DATABASE \"home-library\";"
cat backup_YYYYMMDD_HHMMSS.sql | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres home-library
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Build and Push

```bash
# Build images
docker-compose build

# Tag for Docker Hub
docker tag nodejs2025q2-service-app:latest freennnn/nodejs2025q2-service-app:v1.2.3
docker tag nodejs2025q2-service-postgres:latest freennnn/nodejs2025q2-service-postgres:v1.2.3

# Push to Docker Hub
docker push freennnn/nodejs2025q2-service-app:v1.2.3
docker push freennnn/nodejs2025q2-service-postgres:v1.2.3
```

### Local Development (Without Docker)

For development without Docker, you'll need:

1. **Node.js** (v22.14.0 or higher)
2. **PostgreSQL** (v15 or higher)
3. **Environment Setup**:

   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your local database settings
   # For local development, use:
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/home-library
   ```

4. **Database Setup**:

   ```bash
   # Create database
   createdb home-library
   
   # Run migrations
   npx prisma migrate deploy
   ```

5. **Install Dependencies**:

   ```bash
   npm install
   npx prisma generate
   ```

6. **Start Development Server**:

   ```bash
   # Development mode with hot reload
   npm run start:dev
   
   # Or production mode
   npm run build
   npm run start:prod
   ```

The application will be available at <http://localhost:4000>
