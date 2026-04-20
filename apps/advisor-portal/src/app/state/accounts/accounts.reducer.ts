import { createReducer, on } from '@ngrx/store';
import * as AccountsActions from './accounts.actions';
import { AccountsState } from '../app.state';

export const initialAccountsState: AccountsState = {
  entities: [],
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
  }))
);
