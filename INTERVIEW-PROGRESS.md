# Interview Preparation Progress Tracker

## Core track complete · Optional backend prompt added

**Progress: 8/8 core prompts** ████████████████ · **+ Prompt 9 (NgRx)** · **+ Prompt 10 (optional NestJS)**

**Interview Format**: 1-hour StackBlitz session, live coding (Angular-heavy). NestJS prompt is for **local Nx practice** / full-stack interviews.

**Tech Stack**: Angular, TypeScript, RxJS, Reactive Forms, Jest · NestJS (Prompt 10)

---

## Skills Mastered ✅

| Skill | Status | Where Demonstrated |
|-------|--------|-------------------|
| `switchMap` + `debounceTime` for search | ✅ Mastered | AccountComponent.ts |
| Component communication (`@Input`/`@Output`) | ✅ Mastered | AccountList, AccountDetail |
| Reactive Forms with validation | ✅ Mastered | CreateAccount |
| Services with Observable returns | ✅ Mastered | AccountsService |
| Loading/Error states | ✅ Mastered | All components |
| Memory leak prevention (takeUntil) | ✅ Mastered | AccountComponent |
| OnPush Change Detection | ✅ Mastered | AccountList, AccountDetail |
| Jest component testing | ✅ Mastered | 21 tests passing |

---

## Completed Prompts

### Phase 1: Form Fundamentals ✅
- [x] **Prompt 1**: Reactive Forms with Validators
- [x] **Prompt 2**: Loading state, error handling, success feedback
- [x] **Prompt 3**: AccountsService with Observable pattern

### Phase 2: Component Architecture ✅
- [x] **Prompt 4**: Account List with @Input/@Output
- [x] **Prompt 5**: Debounced Search with switchMap
- [x] **Prompt 6**: Master-Detail pattern

### Phase 3: Performance & Testing ✅
- [x] **Prompt 7**: OnPush Change Detection
- [x] **Prompt 8**: Jest Testing (21 tests)

### Phase 4: State & Backend (extensions)
- [x] **Prompt 9**: NgRx — actions, reducer, effects wired to `AccountsService`, `AccountComponent` uses `Store` + `toSignal`
- [ ] **Prompt 10**: NestJS **controller + service** architecture — see below

---

## Prompt 10 — Controller + service architecture (NestJS)

**Goal**: Show the classic **thin controller / service owns logic** split used in enterprise APIs (and how it maps to “service + controller” in any framework).

**Where**: `apps/api-gateway` (existing Nest app).

### Your task

1. **`AccountsModule`**
   - `accounts.module.ts` — register `AccountsController`, `AccountsService`
   - Import into `AppModule` (or keep feature module self-contained per your preference)

2. **`AccountsController`** (`accounts.controller.ts`)
   - `@Controller('accounts')`
   - `GET /accounts` → list (delegate to service)
   - `GET /accounts/:id` → one account or **404** (`NotFoundException`)
   - `POST /accounts` → create body validated with **`CreateAccountDTO`** from `@org/shared-dto` (`@Body()` + `ValidationPipe` at app or method level)
   - Controller should be **thin**: parse route/body, call service, return result / throw HTTP exceptions only

3. **`AccountsService`** (`accounts.service.ts`)
   - `@Injectable()`
   - Holds **business rules** and **in-memory data** (reuse patterns from `@org/shared-mock-data` or a small in-memory array)
   - Methods: `findAll()`, `findOne(id)`, `create(dto)` — no `res.json` here; return domain objects / throw domain-friendly errors the controller maps to HTTP

4. **Separation checklist**
   - [ ] No business rules in the controller (no filtering logic beyond “call service”)
   - [ ] Service does not know about `Request` / `Response` / status codes
   - [ ] DTO validation at boundary (controller pipe or global `ValidationPipe`)

### Acceptance criteria

```
✓ AccountsController only orchestrates HTTP ↔ service
✓ AccountsService contains create/read logic + mock persistence
✓ GET /accounts/:id returns 404 for unknown id
✓ POST /accounts validates CreateAccountDTO
✓ Unit test: AccountsService (Jest) — at least findOne + create
```

### Interview talking points

- **Why a controller?** HTTP adapter — URLs, verbs, status codes, auth guards later.
- **Why a service?** Reusable business logic, easier to test without HTTP, same service could back GraphQL or a CLI.
- **Who validates input?** Boundary (DTO + pipe); service assumes validated shape or re-validates for defense in depth in high-risk domains.

### Optional stretch

- Extract **`AccountsRepository`** (in-memory “Dynamo-style” access) and inject into `AccountsService` — service orchestrates, repository only stores/queries.

---

## Your Debounced Search Pattern (MEMORIZE!)

```typescript
setupSearch() {
  this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.loading.set(true)),
    switchMap(query => this.accountsService.searchAccounts(query ?? '')),
    takeUntil(this.destroy$)
  ).subscribe({
    next: (accounts) => {
      this.accounts.set(accounts);
      this.loading.set(false);
    },
    error: (err) => {
      this.error.set(err.message);
      this.loading.set(false);
    }
  });
}
```

---

## Component Architecture Built

```
AccountComponent (Smart Container)
├── State: accounts, loading, selectedAccount, error (signals)
├── Search: debounceTime + switchMap + takeUntil
├── Cleanup: OnDestroy with Subject
│
├── AccountListComponent (Presentational)
│   ├── @Input: accounts, loading, selectedAccountId
│   ├── @Output: accountSelected
│   └── ChangeDetection: OnPush
│
└── AccountDetailComponent (Presentational)
    ├── @Input: account
    ├── @Output: close
    └── ChangeDetection: OnPush
```

---

## Interview Answers (Practice These!)

### "Why switchMap instead of mergeMap?"
> "switchMap cancels the previous HTTP request when a new search term is entered. This prevents race conditions where an older, slower request could overwrite newer results. It's the standard pattern for typeahead search."

### "Explain takeUntil for cleanup"
> "takeUntil with a destroy Subject automatically unsubscribes when the component is destroyed. This prevents memory leaks from orphaned subscriptions."

### "Why OnPush on presentational components?"
> "OnPush reduces change detection cycles - Angular only checks when @Input references change or events fire. Combined with signals that create new references on update, this is very performant."

### "How do you test OnPush components?"
> "You need to call markForCheck() on the ChangeDetectorRef after setting inputs, then detectChanges() to trigger the update."

### "How do you test Observables with delays?"
> "I use fakeAsync with tick() to simulate time passing synchronously, avoiding real delays in tests."

---

## Files Created

```
apps/advisor-portal/src/app/
├── services/
│   ├── accounts.service.ts          ✅
│   └── accounts.service.spec.ts     ✅ (11 tests)
├── features/accounts/
│   ├── AccountComponent.ts          ✅
│   ├── AccountComponent.html        ✅
│   ├── create-account/
│   │   ├── create-account.ts        ✅
│   │   └── create-account.html      ✅
│   ├── account-list/
│   │   ├── AccountListComponent.ts  ✅
│   │   ├── AccountListComponent.html✅
│   │   └── AccountListComponent.spec.ts ✅ (10 tests)
│   └── account-detail/
│       ├── AccountDetailComponent.ts✅
│       ├── AccountDetailComponent.html ✅
│       └── AccountDetailComponent.css ✅
```

**After Prompt 10 (target layout):**

```
apps/api-gateway/src/app/
├── app.module.ts
└── accounts/
    ├── accounts.module.ts
    ├── accounts.controller.ts
    └── accounts.service.ts   (+ optional accounts.repository.ts)
```

---

## Pre-Interview Checklist

- [ ] Practice building search → list → detail in StackBlitz (3x)
- [ ] Time yourself: 30 min basic, 30 min polish
- [ ] Review all RxJS operators and when to use each
- [ ] Practice explaining code decisions out loud
- [ ] Review OnPush change detection rules
- [ ] Get good sleep the night before!

---

## Good Luck! 🚀

You've built a production-quality Angular application demonstrating:
- Modern Angular patterns (standalone, signals)
- RxJS mastery (the search pattern they love to test)
- Component architecture (smart/dumb pattern)
- Performance optimization (OnPush)
- Testing proficiency (21 tests)

**You're ready for the interview!**
