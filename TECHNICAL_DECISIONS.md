# Technical Decisions & Architecture Choices

This document outlines the key architectural and technical decisions made during the development of the Dynamic Arcads Real Estate application, along with their rationale and trade-offs.

## Project Structure

### Decision: No Monorepo Setup

**Choice:** Separate projects (`arcads-api` and `arcads-web`) without a monorepo tool (Turborepo, Nx, etc.)

**Rationale:**

- Project was already started with separate directories
- Simpler setup and maintenance for a small-scale application
- Lower configuration overhead
- Easier to understand for reviewers
- Each service can be deployed independently without monorepo tooling

**Trade-offs:**

- ✅ Simpler project structure
- ✅ No monorepo learning curve
- ✅ Independent deployment and versioning
- ❌ Code sharing requires npm packages or manual duplication
- ❌ No unified dependency management
- ❌ Separate `node_modules` for each project

**Alternatives Considered:**

- **Turborepo**: Better for larger teams, shared packages, and unified builds
- **Nx**: More features but higher complexity
- **Yarn Workspaces**: Lighter weight but still adds configuration overhead

---

## Backend

### Decision: Prisma ORM over TypeORM

**Choice:** Prisma as the database ORM

**Rationale:**

- Type-safe database client with excellent TypeScript integration
- Schema-first approach with Prisma Schema language
- Automatic migrations and better migration management
- Superior developer experience with autocompletion
- Built-in connection pooling and query optimization
- Prisma Studio provides a visual database management tool

**Trade-offs:**

- ✅ Excellent TypeScript support and type inference
- ✅ Intuitive schema definition language
- ✅ Automated migrations with `prisma migrate`
- ✅ Better query builder with type safety
- ✅ Integrated data seeding support
- ❌ Less flexible for complex raw SQL queries
- ❌ Additional CLI tool dependency
- ❌ Slightly more opinionated than TypeORM

**Alternatives Considered:**

- **TypeORM**: More mature, decorator-based, better for complex queries, but weaker TypeScript inference
- **MikroORM**: Good TypeScript support but smaller community
- **Knex.js**: Lower level, more control but less type safety

### Decision: Manual DTO Mapping

**Choice:** Manual DTO mapping in services (e.g., `TransactionResponseDto`)

**Rationale:**

- Explicit control over what data is exposed to clients
- Calculate derived fields (margin, marginPercentage) at the service layer
- Keep business logic separate from database models
- Better security by preventing accidental data leaks

**Trade-offs:**

- ✅ Clear separation of concerns
- ✅ Explicit data transformation
- ✅ Can add computed fields easily
- ❌ More code to maintain
- ❌ Manual updates when schema changes

---

## Frontend

### Decision: TanStack Query (React Query) over Redux Toolkit

**Choice:** TanStack Query for server state management, no Redux Toolkit

**Rationale:**

- Specialized tool for server state (async data fetching, caching, synchronization)
- Redux Toolkit is better suited for client state, which this app has minimal of
- Built-in features: automatic refetching, cache invalidation, loading states
- Less boilerplate than Redux for API calls
- React Query DevTools for debugging

**Trade-offs:**

- ✅ Automatic cache management and stale data handling
- ✅ Built-in loading, error, and success states
- ✅ Optimistic updates and query invalidation
- ✅ Less boilerplate than Redux + RTK Query
- ✅ Better developer experience for CRUD operations
- ❌ Not suitable for complex client-side state
- ❌ Different mental model from Redux
- ❌ Requires understanding of cache keys and invalidation

**Alternatives Considered:**

- **Redux Toolkit + RTK Query**: Good for apps with complex client state, but overkill for this project
- **SWR**: Similar to React Query but less features
- **Zustand + fetch**: Simpler but requires manual cache management

**Why Not Redux Toolkit:**

- This application has minimal client state (mostly forms)
- All complex state is server state (transactions, reports)
- TanStack Query handles server state better than Redux
- Redux would add unnecessary complexity and boilerplate

### Decision: shadcn/ui Component Library

**Choice:** shadcn/ui for UI components

**Rationale:**

- Copy-paste components rather than npm package dependency
- Full control over component code
- Built on Radix UI primitives (accessibility built-in)
- Customizable with Tailwind CSS
- Modern design patterns

**Trade-offs:**

- ✅ Full ownership of component code
- ✅ No bundle size from unused components
- ✅ Easy to customize and extend
- ✅ Excellent accessibility out of the box
- ❌ Manual updates when shadcn releases changes
- ❌ More files in the codebase
- ❌ No version management for components

---

## Testing

### Decision: Unit Tests Only (No E2E)

**Choice:** Comprehensive unit tests for backend services and controllers

**Rationale:**

- 41 unit tests provide good coverage for business logic
- Faster to run than E2E tests
- Easier to maintain and debug
- Sufficient for a technical test project

**Trade-offs:**

- ✅ Fast test execution (~1.12s)
- ✅ Easy to debug failures
- ✅ Tests specific business logic
- ❌ No full integration testing
- ❌ Can't catch issues in request/response cycle
- ❌ No frontend testing

**What's Missing:**

- E2E tests with Cypress or Playwright
- Frontend component tests with React Testing Library
- API integration tests with Supertest

---

## What Could Be Improved

### Short-term improvements:

1. **Add E2E tests** - Playwright or Cypress for critical user flows
2. **API documentation** - Swagger/OpenAPI for automatic API docs
3. **Error handling** - Global error handler and error boundary in frontend
4. **Logging** - Structured logging with Winston or Pino
5. **Request validation** - More comprehensive DTO validation
