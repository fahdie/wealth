import { createAction, props } from '@ngrx/store';

export const loadAccounts = createAction('[Accounts] Load Accounts');

export const loadAccountsSuccess = createAction(
  '[Accounts] Load Accounts Success',
  props<{ accounts: unknown[] }>()
);

export const loadAccountsFailure = createAction(
  '[Accounts] Load Accounts Failure',
  props<{ error: string }>()
);
