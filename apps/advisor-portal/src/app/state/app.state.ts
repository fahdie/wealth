import { Account } from '@org/shared-mock-data';

export interface AppState {
  accounts: AccountsState;
}

export interface AccountsState {
  entities: Account[];
  selectedAccount: Account | null;
  loading: boolean;
  error: string | null;
}
