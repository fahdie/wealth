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

  // Load
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

  // Search
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

  // Selection
  on(AccountsActions.selectAccount, (state, { account }) => ({
    ...state,
    selectedAccount: account,
  })),

  // Clear error
  on(AccountsActions.clearError, (state) => ({
    ...state,
    error: null,
  }))
);
