# Angular Interview Practice — JSONPlaceholder Users Track

**Purpose**: Sequential prompts that build on each other: `HttpClient` + **NgRx signal store** + **standalone components** + **reactive forms** + **deep signals** in a child, then **lazy routing**, then **RxJS observables** end-to-end.

**Mock API**: [https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users)

**Stack decisions (locked in)**:

| Topic | Choice |
|-------|--------|
| Signals | Angular built-in (`signal`, `computed`, `effect`; nested / chained `computed` for “deep signals”) |
| Components | Standalone |
| State | NgRx **signal-based** store (`signalStore`, etc.) |

---

## How to use this document

1. Complete **Prompt 1**, then update **§ Completion — Prompt 1** below (what you built, file paths, any deviations).
2. Add **Talking point — Prompt 1**: one short paragraph on *why* the approach is efficient / maintainable (interview voice).
3. Repeat for Prompt 2 and Prompt 3.

*(After each prompt, you can paste your notes here or ask the proctor to draft the completion + talking point from your summary.)*

---

## Prompt 1 — Parent + child, API, signal store, forms, deep signals

### Goal

- **Parent** (`UsersComponent`): loads users from the API, shows list + loading/error, **reactive filter form**, selects a user into the store.
- **Child** (`UserDetailsComponent`): shows selected user with **reactive form**, **deep signals** (`computed` chains from selected user), and an **`effect`** to `patchValue` / reset the form when selection changes.
- **State**: NgRx **signal store** owns `users`, `loading`, `error`, `selectedUserId` (or equivalent).

### Tasks

1. **`User` model** — TypeScript interface for fields you display (minimum: `id`, `name`, `username`, `email`; optional nested `address`, `company`).
2. **`UsersApiService`** — inject `HttpClient`; `getUsers(): Observable<User[]>` → `GET` the users URL above.
3. **`UsersStore`** (signal store) — `loadUsers()`, `selectUser(id)`, selectors for list/loading/error/selected user.
4. **`UsersComponent`** (standalone) — on init call `loadUsers()`; template binds to store signals; filter form drives filtered list (signals + form state).
5. **`UserDetailsComponent`** (standalone) — reactive form with validators; multiple `computed` layers from `selectedUser()`; `effect` syncs store → form.

### Acceptance criteria

- [ ] No duplicate “source of truth”: list + selection live in the **signal store**.
- [ ] Child demonstrates **deep** signal usage (nested / chained `computed`, not a single flat `computed`).
- [ ] Child uses **`effect`** to sync selected user → **reactive form** (`patchValue` / reset).
- [ ] At least one **validator** on the child form (e.g. `Validators.required`, `Validators.email`).
- [ ] Loading and error states are visible from the store.

### Completion — Prompt 1

*(Fill after you finish Prompt 1.)*

- **What was implemented**:
- **Key files / paths**:
- **Deviations / shortcuts taken**:

### Talking point — Prompt 1

*(Why this is efficient / interview-ready — one short paragraph.)*

---

## Prompt 2 — Lazy-loaded routes + `routerLink` (parent ↔ child)

### Goal

- Navigate between parent list and child detail using the **Router**.
- **Lazy load** the feature (parent route loads a chunk; child route under it or sibling per your structure).
- Use **`routerLink`** (and optionally `routerLinkActive`) from the parent list to open the child route (e.g. `/users/:id`).

### Tasks

1. Define routes: e.g. lazy route `''` → `UsersComponent`, child `':id'` → `UserDetailsComponent` (or equivalent layout that still satisfies “parent + child” + lazy loading).
2. **`loadComponent`** or lazy `loadChildren` / route-level lazy loading — match what your Angular version supports; goal is **code-splitting**.
3. Parent list: `routerLink` to `['/users', user.id]` (adjust to your path scheme).
4. Child: read **`ActivatedRoute`** params (`paramMap` / `params`) and call `selectUser(id)` (or drive selection from route only — document which you chose).
5. Optional: `router-outlet` for nested child under parent.

### Acceptance criteria

- [ ] Direct URL navigation to a user id works (refresh on `/users/3` still shows correct user).
- [ ] List → detail uses **`routerLink`** (not only programmatic `navigate`).
- [ ] Lazy loading is observable (separate chunk or lazy route config you can point to in the interview).

### Completion — Prompt 2

*(Fill after you finish Prompt 2.)*

- **What was implemented**:
- **Route table (paths)**:
- **Key files / paths**:

### Talking point — Prompt 2

*(Why lazy routes + URL-driven selection help scale and UX.)*

---

## Prompt 3 — RxJS observables + API data (streams first-class)

### Goal

- Treat **Observables** as first-class: operators on streams derived from the API / store / forms.
- Connect RxJS to the existing feature without abandoning the signal store (clear boundary: streams for async + composition; signals for derived UI where it still helps).

### Tasks (suggested)

1. **`filteredUsers$`** (or similar) using RxJS: e.g. `combineLatest` of store-derived observable + `form.valueChanges` with `startWith`, then `map` / `debounceTime` as appropriate.
2. **`valueChanges`** on the parent filter form as an observable pipeline (avoid redundant subscriptions where `async` pipe suffices).
3. Expose store state as observables where useful (`store.select(...)` or `toObservable` from signals — use what your NgRx / Angular version supports) and **pipe** with `map`, `distinctUntilChanged`, etc.
4. Document one place where you **intentionally** chose Observable vs Signal and why.

### Acceptance criteria

- [ ] At least one meaningful pipeline uses **multiple operators** (not only a single `map`).
- [ ] No memory leaks: `takeUntilDestroyed`, `shareReplay` where justified, or `async` pipe in template.
- [ ] Still uses data from [jsonplaceholder users](https://jsonplaceholder.typicode.com/users) (same service or wrapped).

### Completion — Prompt 3

*(Fill after you finish Prompt 3.)*

- **What was implemented**:
- **Observable vs signal boundary**:
- **Key files / paths**:

### Talking point — Prompt 3

*(Why composing with RxJS + keeping store signals avoids spaghetti and scales.)*

---

## Quick reference — interview checklist

| Area | Prompt 1 | Prompt 2 | Prompt 3 |
|------|----------|----------|----------|
| `HttpClient` | ✅ | — | ✅ (streams) |
| NgRx signal store | ✅ | ✅ (routing + selection) | ✅ |
| Reactive forms | ✅ | — | ✅ (`valueChanges`) |
| Deep signals + `effect` | ✅ | — | optional |
| Lazy routing + `routerLink` | — | ✅ | — |
| RxJS operators | light | — | ✅ |

---

## Session log

| Date | Prompt | Notes |
|------|--------|-------|
| | 1 | |
| | 2 | |
| | 3 | |
