# Accounts API — NestJS controller + service architecture

**Status:** Implemented **alongside** the default api-gateway; **`AccountsModule` is not imported** in `AppModule`, so routes are inactive until you wire it.  
Shared **`CreateAccountDTO`** (`@org/shared-dto`) remains the **original** constructor-based DTO for the Angular app. The HTTP API uses **`CreateAccountApiDto`** in `dto/create-account-api.dto.ts` (Nest + `class-transformer`).

## Target layout (`apps/api-gateway/src/app/accounts/`)

```
accounts/
├── ACCOUNTS-NEST-ARCHITECTURE.md    # This document
├── accounts.module.ts               # Feature module (not imported by AppModule yet)
├── accounts.controller.ts           # Thin HTTP adapter (@Controller('accounts'))
├── accounts.service.ts              # Application logic; no Request/Response types
├── accounts.repository.ts           # In-memory store seeded from MOCK_ACCOUNTS
├── dto/
│   └── create-account-api.dto.ts    # POST body for Nest (separate from @org/shared-dto)
└── accounts.service.spec.ts         # Jest: findOne + create (+ repository.reset)
```

When wired, with `main.ts` global prefix `api`, routes would be:

- `GET /api/accounts`
- `GET /api/accounts/:id` → `404` when missing
- `POST /api/accounts` → body validated with **`CreateAccountApiDto`** (`class-validator` + `class-transformer`)

## How to enable (wire) the feature

1. In `app.module.ts`, add to `imports`: `AccountsModule` (from `./accounts/accounts.module`).
2. In `main.ts`, register a global `ValidationPipe`, for example:

```typescript
import { ValidationPipe } from '@nestjs/common';

// after NestFactory.create(AppModule)
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
);
```

3. Dependency: **`class-transformer`** (in root `package.json` for `@Type()` on `CreateAccountApiDto`).

## Thin controller vs service owns logic

| Layer | Responsibility |
|-------|----------------|
| **Controller** | Route mapping, HTTP status (`201` on create), translate “not found” → `NotFoundException`. No business rules. |
| **Service** | `findAll`, `findOne`, `create`; builds new `Account` from DTO; stays free of `Request` / `Response`. |
| **Repository** | Encapsulates **how** data is stored (`InMemoryAccountsRepository` today). Swap for TypeORM/Prisma without changing the service contract. |

## DTO validation (when wired)

- Global `ValidationPipe` in `main.ts`: `whitelist`, `forbidNonWhitelisted`, `transform`.
- **`CreateAccountApiDto`**: `@Type(() => Number)` on `accountNumber` for JSON coercion.

## Acceptance criteria (once wired)

1. **GET /api/accounts** returns a JSON array from in-memory seed (`MOCK_ACCOUNTS` pattern).
2. **GET /api/accounts/:id** returns one account or **404** if unknown.
3. **POST /api/accounts** with a valid **`CreateAccountApiDto`** body → **201**; invalid → **400**.
4. **`accounts.service.spec.ts`** covers **findOne** and **create** without bootstrapping HTTP.

## Interview talking points

1. **Thin controller:** HTTP only; rules live in the service.
2. **DTO at the edge:** ValidationPipe + DTO class; service trusts validated input.
3. **404 mapping:** Service returns `undefined`; controller throws `NotFoundException`.
4. **Side-by-side modules:** Ship a feature module unregistered until product enables it.

## Optional repository stretch

Replace `InMemoryAccountsRepository` with a DB-backed repository; inject the same token/interface so `AccountsService` stays stable.
