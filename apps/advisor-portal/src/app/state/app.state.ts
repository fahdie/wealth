export interface AppState {
  accounts: AccountsState;
}

export interface AccountsState {
  entities: unknown[];
  loading: boolean;
  error: string | null;
}
