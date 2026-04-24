# Angular Interview Cheat Sheet — Full (post-NgRx)

**Reference copy** with full snippets after NgRx was wired up. For a **shorter TV-friendly** sheet use **`CHEAT-SHEET.md`**.

**Row 1 layout:** **BOX 1** is split into **1a** (reactive setup only) and **1b** (submit + service + template) so **BOX 2** and **BOX 3** sit to the right and use horizontal space.

---

<table>
<tr>
<td width="24%" valign="top">

## BOX 1a: Forms — setup

### Reactive Form Setup

```typescript
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

createAccountForm = new FormGroup({
  accountNumber: new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(1),
    Validators.pattern(/^\d+$/),
  ]),
  firstName: new FormControl('', [
    Validators.required,
    Validators.maxLength(50),
  ]),
  email: new FormControl('', [
    Validators.required,
    Validators.email,
  ]),
});
```

</td>
<td width="24%" valign="top">

## BOX 1b: Forms — submit · service · template

### Form Submission

```typescript
onSubmit() {
  if (this.form.invalid) return;

  this.isLoading.set(true);
  this.error.set(null);

  this.service.create(this.form.value).subscribe({
    next: (result) => {
      this.isSuccess.set(true);
      this.form.reset();
      this.isLoading.set(false);
    },
    error: (err) => {
      this.error.set(err.message);
      this.isLoading.set(false);
    },
  });
}
```

### Service Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class AccountsService {
  private http = inject(HttpClient);

  getAccounts(): Observable<Account[]> {
    return of(MOCK_DATA).pipe(delay(500));
  }

  getById(id: string): Observable<Account> {
    const item = DATA.find((x) => x.id === id);
    if (!item) {
      return throwError(() => new Error('Not found'));
    }
    return of(item).pipe(delay(300));
  }
}
```

### Template Validation

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input formControlName="email" />

  @if (form.get('email')?.invalid && form.get('email')?.touched) {
    <span class="error">Invalid email</span>
  }

  <button [disabled]="form.invalid || isLoading()">Submit</button>
</form>
```

</td>
<td width="26%" valign="top" style="background-color: #fffde7;">

## BOX 2: RxJS & Search

### THE SEARCH PATTERN

```typescript
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
  tap,
  startWith,
} from 'rxjs/operators';
import { Subject } from 'rxjs';

export class SearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  accounts = signal<Account[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupSearch() {
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((query) => this.service.search(query ?? '')),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (results) => {
          this.accounts.set(results);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }
}
```

### RxJS Operators

| Operator               | Purpose                    |
| ---------------------- | -------------------------- |
| `debounceTime(300)`    | Wait 300ms after typing    |
| `distinctUntilChanged()` | Skip if same value       |
| `switchMap()`          | Cancel previous request    |
| `tap()`                | Side effects               |
| `takeUntil()`          | Cleanup on destroy         |
| `startWith('')`       | Emit initial value         |

### switchMap vs Others

```
switchMap → Cancel previous (SEARCH)
mergeMap  → Run in parallel
concatMap → Run in sequence
```

</td>
<td width="26%" valign="top">

## BOX 3: Components

### @Input / @Output

```typescript
@Component({
  selector: 'app-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  @Input() items: Item[] = [];
  @Input() loading = false;
  @Input() selectedId: string | null = null;

  @Output() itemSelected = new EventEmitter<Item>();

  onRowClick(item: Item) {
    this.itemSelected.emit(item);
  }
}
```

```html
@if (loading) {
  <div>Loading...</div>
}

@for (item of items; track item.id) {
  <tr
    [class.selected]="item.id === selectedId"
    (click)="onRowClick(item)"
  >
    {{ item.name }}
  </tr>
} @empty {
  <tr>No items found</tr>
}
```

### Parent Component

```typescript
@Component({ /* standalone, imports */ })
export class ParentComponent {
  private service = inject(MyService);

  items = signal<Item[]>([]);
  selected = signal<Item | null>(null);

  onItemSelected(item: Item) {
    this.selected.set(item);
  }
}
```

```html
<app-list
  [items]="items()"
  [loading]="loading()"
  [selectedId]="selected()?.id ?? null"
  (itemSelected)="onItemSelected($event)">
</app-list>

@if (selected()) {
  <app-detail
    [item]="selected()"
    (close)="selected.set(null)">
  </app-detail>
}
```

### OnPush Triggers

```
✓ @Input reference changes
✓ Event from component/child
✓ Async pipe emits
✓ markForCheck() called
```

</td>
</tr>
</table>

---

## BOX 4 & 5 — Jest · NgRx (wealth-platform)

<table>
<tr>
<td width="25%" valign="top">

### BOX 4 — Jest (component)

```typescript
describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('should render items', () => {
    component.items = mockItems;
    component.loading = false;
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(mockItems.length);
  });

  it('should emit on click', () => {
    component.items = mockItems;
    fixture.detectChanges();

    const spy = jest.spyOn(component.itemSelected, 'emit');

    fixture.nativeElement.querySelector('tr').click();

    expect(spy).toHaveBeenCalledWith(mockItems[0]);
  });
});
```

**OnPush in tests:** after setting `@Input()`s, call `fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck()` then `fixture.detectChanges()`.

</td>
<td width="25%" valign="top">

### BOX 4 — Jest (service / fakeAsync)

```typescript
describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyService);
  });

  it('should return data', fakeAsync(() => {
    let result: any[] = [];

    service.getData().subscribe((data) => {
      result = data;
    });

    tick(500);

    expect(result.length).toBeGreaterThan(0);
  }));

  it('should handle error', fakeAsync(() => {
    let error: Error | undefined;

    service.getById('INVALID').subscribe({
      error: (err) => {
        error = err;
      },
    });

    tick(300);

    expect(error?.message).toContain('not found');
  }));
});
```

**NgRx component tests:** `provideMockStore({ initialState, selectors })`.

</td>
<td width="25%" valign="top">

### BOX 5 — NgRx: state · actions · reducer

**`app.state.ts`**

```typescript
import { Account } from '@org/shared-mock-data';

export interface AccountsState {
  entities: Account[];
  selectedAccount: Account | null;
  loading: boolean;
  error: string | null;
}
```

**`accounts.actions.ts`**

```typescript
import { createAction, props } from '@ngrx/store';
import { Account } from '@org/shared-mock-data';

export const loadAccounts = createAction('[Accounts] Load');
export const loadAccountsSuccess = createAction(
  '[Accounts] Load Success',
  props<{ accounts: Account[] }>(),
);
export const loadAccountsFailure = createAction(
  '[Accounts] Load Failure',
  props<{ error: string }>(),
);

export const searchAccounts = createAction(
  '[Accounts] Search',
  props<{ query: string }>(),
);
export const searchAccountsSuccess = createAction(
  '[Accounts] Search Success',
  props<{ accounts: Account[] }>(),
);
export const searchAccountsFailure = createAction(
  '[Accounts] Search Failure',
  props<{ error: string }>(),
);

export const selectAccount = createAction(
  '[Accounts] Select',
  props<{ account: Account | null }>(),
);

export const clearError = createAction('[Accounts] Clear Error');
```

**`accounts.reducer.ts`** (matches repo)

```typescript
import { createReducer, on } from '@ngrx/store';
import * as AccountsActions from './accounts.actions';
import { AccountsState } from '../app.state';

export const initialAccountsState: AccountsState = {
  entities: [],
  selectedAccount: null,
  loading: false,
  error: null,
};

export const accountsReducer = createReducer(
  initialAccountsState,
  on(AccountsActions.loadAccounts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AccountsActions.loadAccountsSuccess, (state, { accounts }) => ({
    ...state,
    entities: accounts,
    loading: false,
    error: null,
  })),
  on(AccountsActions.loadAccountsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AccountsActions.searchAccounts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AccountsActions.searchAccountsSuccess, (state, { accounts }) => ({
    ...state,
    entities: accounts,
    loading: false,
  })),
  on(AccountsActions.searchAccountsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AccountsActions.selectAccount, (state, { account }) => ({
    ...state,
    selectedAccount: account,
  })),
  on(AccountsActions.clearError, (state) => ({
    ...state,
    error: null,
  })),
);
```

</td>
<td width="25%" valign="top">

### BOX 5 — NgRx: effects · selectors · component

**`accounts.effects.ts`** (matches repo)

```typescript
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, debounceTime } from 'rxjs';
import { AccountsService } from '../../services/accounts.service';
import * as AccountsActions from './accounts.actions';

export const loadAccountsEffect = createEffect(
  (actions$ = inject(Actions), accountsService = inject(AccountsService)) =>
    actions$.pipe(
      ofType(AccountsActions.loadAccounts),
      switchMap(() =>
        accountsService.getAccounts().pipe(
          map((accounts) => AccountsActions.loadAccountsSuccess({ accounts })),
          catchError((error) =>
            of(
              AccountsActions.loadAccountsFailure({
                error: error.message || 'Failed to load accounts',
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const searchAccountsEffect = createEffect(
  (actions$ = inject(Actions), accountsService = inject(AccountsService)) =>
    actions$.pipe(
      ofType(AccountsActions.searchAccounts),
      debounceTime(300),
      switchMap(({ query }) =>
        accountsService.searchAccounts(query).pipe(
          map((accounts) =>
            AccountsActions.searchAccountsSuccess({ accounts }),
          ),
          catchError((error) =>
            of(
              AccountsActions.searchAccountsFailure({
                error: error.message || 'Search failed',
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);
```

**`accounts.selectors.ts`**

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountsState } from '../app.state';

export const selectAccountsState =
  createFeatureSelector<AccountsState>('accounts');

export const selectAllAccounts = createSelector(
  selectAccountsState,
  (state) => state.entities,
);

export const selectAccountsLoading = createSelector(
  selectAccountsState,
  (state) => state.loading,
);

export const selectAccountsError = createSelector(
  selectAccountsState,
  (state) => state.error,
);

export const selectSelectedAccount = createSelector(
  selectAccountsState,
  (state) => state.selectedAccount,
);
```

**`AccountComponent.ts`** (NgRx + `toSignal` — matches repo)

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AccountListComponent } from './account-list/AccountListComponent';
import { AccountDetailComponent } from './account-detail/AccountDetailComponent';
import { Account } from '@org/shared-mock-data';
import * as AccountsActions from '../../state/accounts/accounts.actions';
import {
  selectAllAccounts,
  selectAccountsLoading,
  selectAccountsError,
  selectSelectedAccount,
} from '../../state/accounts/accounts.selectors';

@Component({
  standalone: true,
  selector: 'app-accounts',
  imports: [AccountListComponent, AccountDetailComponent, ReactiveFormsModule],
  templateUrl: './AccountComponent.html',
  styleUrl: './AccountComponent.css',
})
export class AccountComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  accounts = toSignal(this.store.select(selectAllAccounts), {
    initialValue: [] as Account[],
  });
  loading = toSignal(this.store.select(selectAccountsLoading), {
    initialValue: false,
  });
  error = toSignal(this.store.select(selectAccountsError), {
    initialValue: null as string | null,
  });
  selectedAccount = toSignal(this.store.select(selectSelectedAccount), {
    initialValue: null as Account | null,
  });
  searchControl = new FormControl('');

  ngOnInit() {
    this.store.dispatch(AccountsActions.loadAccounts());
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Debouncing is in `searchAccountsEffect` (`debounceTime`). */
  setupSearch() {
    this.searchControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        this.store.dispatch(
          AccountsActions.searchAccounts({ query: query ?? '' }),
        );
      });
  }

  loadAccounts() {
    this.store.dispatch(AccountsActions.loadAccounts());
  }

  onAccountSelected(account: Account) {
    this.store.dispatch(AccountsActions.selectAccount({ account }));
  }

  onCloseDetails() {
    this.store.dispatch(AccountsActions.selectAccount({ account: null }));
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  retryLoad() {
    this.store.dispatch(AccountsActions.clearError());
    this.searchControl.setValue('');
    this.store.dispatch(AccountsActions.loadAccounts());
  }
}
```

**`app.config.ts`**

```typescript
import { accountsReducer } from './state/accounts/accounts.reducer';
import * as accountsEffects from './state/accounts/accounts.effects';

provideStore({ accounts: accountsReducer }),
provideEffects(accountsEffects),
```

</td>
</tr>
</table>
