# Angular Interview Cheat Sheet

## TV / PDF

- **Landscape** + **fit page / whole page**. Zoom **100–150%** (280% shows only a tiny strip).
- Two **rows** below: **row 1** = Forms (2 cols) · RxJS · Components (2 cols) · **row 2** = Jest · NgRx (4 columns).
- **Full readable copy** (same layout as right after NgRx, multi-line snippets): **`CHEAT-SHEET-FULL-NGRX.md`**.

---

## Row 1 — Forms (2) · RxJS · Components (2)

<table>
<tr>
<td width="20%" valign="top">

### BOX 1a — Form setup

```typescript
form = new FormGroup({
  accountNumber: new FormControl<number | null>(null, [
    Validators.required, Validators.min(1), Validators.pattern(/^\d+$/),
  ]),
  firstName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
  email: new FormControl('', [Validators.required, Validators.email]),
});
```

</td>
<td width="20%" valign="top">

### BOX 1b — Submit · service · template

```typescript
onSubmit() {
  if (this.form.invalid) return;
  this.isLoading.set(true);
  this.service.create(this.form.value).subscribe({
    next: () => { this.isSuccess.set(true); this.form.reset(); this.isLoading.set(false); },
    error: (e) => { this.error.set(e.message); this.isLoading.set(false); },
  });
}
@Injectable({ providedIn: 'root' })
export class AccountsService {
  getAccounts() { return of(MOCK).pipe(delay(500)); }
}
```

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input formControlName="email">
  @if (form.get('email')?.invalid && form.get('email')?.touched) { <span class="error">Bad email</span> }
  <button [disabled]="form.invalid || isLoading()">Submit</button>
</form>
```

</td>
<td width="20%" valign="top" style="background-color:#fffde7;">

### BOX 2 — Search

```typescript
private destroy$ = new Subject<void>();
searchControl = new FormControl('');
accounts = signal<Account[]>([]); loading = signal(false); error = signal<string | null>(null);
ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
setupSearch() {
  this.searchControl.valueChanges.pipe(
    startWith(''), debounceTime(300), distinctUntilChanged(),
    tap(() => this.loading.set(true)),
    switchMap((q) => this.svc.search(q ?? '')),
    takeUntil(this.destroy$),
  ).subscribe({
    next: (r) => { this.accounts.set(r); this.loading.set(false); },
    error: (e) => { this.error.set(e.message); this.loading.set(false); },
  });
}
```

`debounceTime` · `distinctUntilChanged` · **`switchMap` = cancel old HTTP** · `takeUntil` · `tap`  
**switchMap** search · **mergeMap** parallel · **concatMap** queue

</td>
<td width="20%" valign="top">

### BOX 3 — Child (OnPush)

```typescript
@Component({ selector: 'app-list', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush })
export class ListComponent {
  @Input() items: Item[] = []; @Input() loading = false; @Input() selectedId: string | null = null;
  @Output() itemSelected = new EventEmitter<Item>();
  onRowClick(i: Item) { this.itemSelected.emit(i); }
}
```

```html
@if (loading) { <div>Loading...</div> }
@for (item of items; track item.id) {
<tr [class.selected]="item.id === selectedId" (click)="onRowClick(item)">{{ item.name }}</tr>
} @empty { <tr>No items</tr> }
```

OnPush: **@Input ref** · **DOM event** · **async** · **`markForCheck()`**

</td>
<td width="20%" valign="top">

### BOX 3 — Parent

```typescript
export class ParentComponent {
  private svc = inject(MyService);
  items = signal<Item[]>([]); selected = signal<Item | null>(null);
  onItemSelected(i: Item) { this.selected.set(i); }
}
```

```html
<app-list [items]="items()" [loading]="loading()" [selectedId]="selected()?.id ?? null"
  (itemSelected)="onItemSelected($event)"></app-list>
@if (selected()) { <app-detail [item]="selected()" (close)="selected.set(null)"></app-detail> }
```

</td>
</tr>
</table>

---

## Row 2 — Jest · NgRx

<table>
<tr>
<td width="25%" valign="top">

### BOX 4 — Jest (component)

```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({ imports: [ListComponent] }).compileComponents();
  fixture = TestBed.createComponent(ListComponent); component = fixture.componentInstance;
});
it('renders', () => {
  component.items = mockItems; component.loading = false; fixture.detectChanges();
  expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(mockItems.length);
});
it('emit', () => {
  component.items = mockItems; fixture.detectChanges();
  const spy = jest.spyOn(component.itemSelected, 'emit');
  fixture.nativeElement.querySelector('tr').click();
  expect(spy).toHaveBeenCalledWith(mockItems[0]);
});
```

OnPush: set `@Input` → `fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck()` → `detectChanges()`.

</td>
<td width="25%" valign="top">

### BOX 4 — Jest (service)

```typescript
beforeEach(() => { TestBed.configureTestingModule({}); service = TestBed.inject(MyService); });
it('data', fakeAsync(() => { let r: any[] = []; service.getData().subscribe((d) => (r = d)); tick(500); expect(r.length).toBeGreaterThan(0); }));
it('err', fakeAsync(() => { let err: Error | undefined; service.getById('X').subscribe({ error: (e) => (err = e) }); tick(300); expect(err?.message).toContain('not found'); }));
```

NgRx component: **`provideMockStore({ initialState, selectors })`**.

</td>
<td width="25%" valign="top">

### BOX 5 — State / actions / reducer

```typescript
export interface AccountsState {
  entities: Account[]; selectedAccount: Account | null; loading: boolean; error: string | null;
}
```

```typescript
export const loadAccounts = createAction('[Accounts] Load');
export const loadAccountsSuccess = createAction('[Accounts] Load Success', props<{ accounts: Account[] }>());
export const loadAccountsFailure = createAction('[Accounts] Load Failure', props<{ error: string }>());
export const searchAccounts = createAction('[Accounts] Search', props<{ query: string }>());
export const searchAccountsSuccess = createAction('[Accounts] Search Success', props<{ accounts: Account[] }>());
export const searchAccountsFailure = createAction('[Accounts] Search Failure', props<{ error: string }>());
export const selectAccount = createAction('[Accounts] Select', props<{ account: Account | null }>());
export const clearError = createAction('[Accounts] Clear Error');
```

```typescript
import * as A from './accounts.actions';
export const accountsReducer = createReducer(initialAccountsState,
  on(A.loadAccounts, (s) => ({ ...s, loading: true, error: null })),
  on(A.loadAccountsSuccess, (s, { accounts }) => ({ ...s, entities: accounts, loading: false, error: null })),
  on(A.loadAccountsFailure, (s, { error }) => ({ ...s, loading: false, error })),
  on(A.searchAccounts, (s) => ({ ...s, loading: true, error: null })),
  on(A.searchAccountsSuccess, (s, { accounts }) => ({ ...s, entities: accounts, loading: false })),
  on(A.searchAccountsFailure, (s, { error }) => ({ ...s, loading: false, error })),
  on(A.selectAccount, (s, { account }) => ({ ...s, selectedAccount: account })),
  on(A.clearError, (s) => ({ ...s, error: null })),
);
```

</td>
<td width="25%" valign="top">

### BOX 5 — Effects / selectors / component

```typescript
import * as AccountsActions from './accounts.actions';
export const loadAccountsEffect = createEffect(
  (actions$ = inject(Actions), svc = inject(AccountsService)) =>
    actions$.pipe(ofType(AccountsActions.loadAccounts), switchMap(() =>
      svc.getAccounts().pipe(
        map((accounts) => AccountsActions.loadAccountsSuccess({ accounts })),
        catchError((e) => of(AccountsActions.loadAccountsFailure({ error: e.message || 'Failed to load accounts' }))),
      ))), { functional: true });
export const searchAccountsEffect = createEffect(
  (actions$ = inject(Actions), svc = inject(AccountsService)) =>
    actions$.pipe(ofType(AccountsActions.searchAccounts), debounceTime(300), switchMap(({ query }) =>
      svc.searchAccounts(query).pipe(
        map((accounts) => AccountsActions.searchAccountsSuccess({ accounts })),
        catchError((e) => of(AccountsActions.searchAccountsFailure({ error: e.message || 'Search failed' }))),
      ))), { functional: true });
```

```typescript
export const selectAccountsState = createFeatureSelector<AccountsState>('accounts');
export const selectAllAccounts = createSelector(selectAccountsState, (s) => s.entities);
export const selectAccountsLoading = createSelector(selectAccountsState, (s) => s.loading);
export const selectAccountsError = createSelector(selectAccountsState, (s) => s.error);
export const selectSelectedAccount = createSelector(selectAccountsState, (s) => s.selectedAccount);
```

```typescript
import * as AccountsActions from '../../state/accounts/accounts.actions';
private store = inject(Store); private destroy$ = new Subject<void>();
accounts = toSignal(this.store.select(selectAllAccounts), { initialValue: [] as Account[] });
loading = toSignal(this.store.select(selectAccountsLoading), { initialValue: false });
error = toSignal(this.store.select(selectAccountsError), { initialValue: null as string | null });
selectedAccount = toSignal(this.store.select(selectSelectedAccount), { initialValue: null as Account | null });
searchControl = new FormControl('');
ngOnInit() { this.store.dispatch(AccountsActions.loadAccounts()); this.setupSearch(); }
setupSearch() {
  this.searchControl.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
    .subscribe((q) => this.store.dispatch(AccountsActions.searchAccounts({ query: q ?? '' })));
}
// also: selectAccount, clearError, loadAccounts, clearSearch, retryLoad → dispatch
```

```typescript
provideStore({ accounts: accountsReducer }), provideEffects(accountsEffects),
```

**Full files:** `apps/advisor-portal/.../AccountComponent.ts`, `state/accounts/*`.

</td>
</tr>
</table>
