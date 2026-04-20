import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountsState } from '../app.state';

export const selectAccountsState =
  createFeatureSelector<AccountsState>('accounts');

export const selectAllAccounts = createSelector(
  selectAccountsState,
  (state) => state.entities
);

export const selectAccountsLoading = createSelector(
  selectAccountsState,
  (state) => state.loading
);

export const selectAccountsError = createSelector(
  selectAccountsState,
  (state) => state.error
);
