# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack Todo application with JWT authentication and role-based access control (RBAC).

**Backend**: NestJS + GraphQL + Prisma + PostgreSQL
**Frontend**: Next.js (to be implemented)

## Architecture

### Backend (`api/`)

**Technology Stack:**
- NestJS (Node.js framework)
- GraphQL (Apollo Server, Code First approach)
- Prisma ORM
- PostgreSQL database
- JWT authentication
- bcrypt for password hashing

**Key Features:**
1. **JWT Authentication**: Signup, login, and token-based auth
2. **Role-Based Access Control (RBAC)**:
   - `USER`: Default role, can manage own todos
   - `ADMIN`: Can manage categories
3. **Data Models**:
   - **User**: id, email, password (hashed), role, timestamps
   - **Category**: id, name, description, timestamps
   - **Todo**: id, title, description, status, userId, categoryId, timestamps

**Access Rules:**
- Categories: CRUD operations restricted to ADMIN users only
- Todos: Users can only access/modify their own todos

### Database

PostgreSQL runs via Docker Compose:
```bash
docker-compose up -d
```

Database connection: `postgresql://todouser:todopass@localhost:5432/tododb`

### Directory Structure

```
api/
├── prisma/
│   ├── schema.prisma          # Prisma schema with User, Category, Todo models
│   └── migrations/            # Database migration files
├── src/
│   ├── auth/                  # Authentication module (JWT, guards, decorators)
│   ├── categories/            # Categories module (admin-only CRUD)
│   ├── todos/                 # Todos module (owner-only CRUD)
│   ├── prisma/                # Prisma service module
│   ├── common/
│   │   ├── models/            # GraphQL object types
│   │   └── enums/             # GraphQL enums (Role, TodoStatus)
│   └── app.module.ts          # Root module
├── .env                       # Environment variables (DATABASE_URL, JWT_SECRET)
└── README.md                  # API documentation with GraphQL examples
```

## Common Development Commands

### Backend

```bash
# Navigate to API directory
cd api/api

# Install dependencies
yarn install

# Start PostgreSQL
docker-compose up -d  # Run from project root

# Run migrations
yarn prisma migrate dev

# Start dev server (with hot reload)
yarn start:dev

# Build for production
yarn build

# Prisma Studio (database GUI)
yarn prisma studio

# Generate Prisma Client
yarn prisma generate
```

### GraphQL API

Server: `http://localhost:4001`
GraphQL Playground: `http://localhost:4001/graphql`

See `api/README.md` for detailed GraphQL query/mutation examples.

## Important Implementation Details

### Authentication Flow

1. User signs up via `signup` mutation → receives JWT token
2. User logs in via `login` mutation → receives JWT token
3. Protected queries/mutations require `Authorization: Bearer <token>` header
4. JWT payload contains: `{ sub: userId, email, role }`

### Guards and Decorators

- **JwtAuthGuard**: Validates JWT token and attaches user to request
- **RolesGuard**: Checks if user has required role (e.g., ADMIN)
- **@CurrentUser()**: Decorator to get authenticated user in resolvers
- **@Roles(...)**: Decorator to specify required roles

### Creating Admin Users

By default, all users are created with `USER` role. To create an admin:

```bash
# Via Prisma Studio
yarn --cwd api prisma studio
# Then manually change role to ADMIN

# Or via SQL
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

## Environment Variables

Required in `api/.env`:

```env
DATABASE_URL="postgresql://todouser:todopass@localhost:5432/tododb"
JWT_SECRET="your-secret-key-change-this-in-production"
JWT_EXPIRATION="1d"
```

## Frontend (To Be Implemented)

The `front/` directory is intended for a Next.js application that will:
- Consume the GraphQL API
- Implement authentication UI (login/signup pages)
- Display todos with CRUD operations
- Show category management for admin users
- Use Apollo Client for GraphQL queries

## Testing

Backend is currently running and testable via GraphQL Playground.

Test the auth flow:
1. Create a user via `signup` mutation
2. Copy the `accessToken` from response
3. Set HTTP header: `Authorization: Bearer <token>`
4. Test protected queries like `me`, `todos`, `categories`

## Notes for Claude

- Use NestJS CLI when generating new modules: `nest g module <name>`
- Follow Code First approach for GraphQL (decorators in model classes)
- All database changes should go through Prisma migrations
- Never commit `.env` file (it's in .gitignore)
- Password is always hashed with bcrypt before storing
- Authorization is enforced at resolver level with guards
