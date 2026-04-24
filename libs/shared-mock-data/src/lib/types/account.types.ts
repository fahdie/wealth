export type AccountType = 'BROKERAGE' | 'IRA' | 'ROTH_IRA' | 'SEP_IRA' | '401K' | 'TRUST' | 'CUSTODIAL';
export type AccountStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'CLOSED';

export interface Account {
  accountId: string;
  accountNumber: number;
  accountType: AccountType;
  status: AccountStatus;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  advisorId: string;
  balance: number;
  availableBalance: number;
  currency: string;
  openedDate: string;
  lastActivityDate: string;
}

export interface AccountSummary {
  accountId: string;
  accountNumber: number;
  accountType: AccountType;
  displayName: string;
  balance: number;
  currency: string;
}

export interface selectedAccountId{
  accountId: string;
}