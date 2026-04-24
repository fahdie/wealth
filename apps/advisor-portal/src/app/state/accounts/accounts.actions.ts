import { createAction, props } from '@ngrx/store';
import { Account } from '@org/shared-mock-data';

// Load
export const loadAccounts = createAction('[Accounts] Load');

export const loadAccountsSuccess = createAction(
  '[Accounts] Load Success',
  props<{ accounts: Account[] }>()
);
export const loadAccountsFailure = createAction(
  '[Accounts] Load Failure',
  props<{ error: string }>()
);

// Search
export const searchAccounts = createAction(
  '[Accounts] Search',
  props<{ query: string }>()
);
export const searchAccountsSuccess = createAction(
  '[Accounts] Search Success',
  props<{ accounts: Account[] }>()
);
export const searchAccountsFailure = createAction(
  '[Accounts] Search Failure',
  props<{ error: string }>()
);

// Selection
export const selectAccount = createAction(
  '[Accounts] Select',
  props<{ account: Account | null }>()
);

// Clear error
export const clearError = createAction('[Accounts] Clear Error');
