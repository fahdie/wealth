import { Account, AccountSummary } from '../types';

export const MOCK_ACCOUNTS: Account[] = [
  {
    accountId: 'ACC-001',
    accountNumber: 78432156,
    accountType: 'BROKERAGE',
    status: 'ACTIVE',
    firstName: 'Michael',
    lastName: 'Chen',
    username: 'mchen',
    email: 'michael.chen@email.com',
    advisorId: 'ADV-101',
    balance: 245780.50,
    availableBalance: 243500.00,
    currency: 'USD',
    openedDate: '2021-03-15',
    lastActivityDate: '2024-01-18',
  },
  {
    accountId: 'ACC-002',
    accountNumber: 78432157,
    accountType: 'IRA',
    status: 'ACTIVE',
    firstName: 'Michael',
    lastName: 'Chen',
    username: 'mchen',
    email: 'michael.chen@email.com',
    advisorId: 'ADV-101',
    balance: 156230.75,
    availableBalance: 156230.75,
    currency: 'USD',
    openedDate: '2021-03-15',
    lastActivityDate: '2024-01-15',
  },
  {
    accountId: 'ACC-003',
    accountNumber: 89123456,
    accountType: 'ROTH_IRA',
    status: 'ACTIVE',
    firstName: 'Sarah',
    lastName: 'Johnson',
    username: 'sjohnson',
    email: 'sarah.johnson@email.com',
    advisorId: 'ADV-101',
    balance: 89500.25,
    availableBalance: 89500.25,
    currency: 'USD',
    openedDate: '2020-06-22',
    lastActivityDate: '2024-01-17',
  },
  {
    accountId: 'ACC-004',
    accountNumber: 89123457,
    accountType: 'BROKERAGE',
    status: 'ACTIVE',
    firstName: 'Sarah',
    lastName: 'Johnson',
    username: 'sjohnson',
    email: 'sarah.johnson@email.com',
    advisorId: 'ADV-101',
    balance: 567890.00,
    availableBalance: 545000.00,
    currency: 'USD',
    openedDate: '2019-11-05',
    lastActivityDate: '2024-01-18',
  },
  {
    accountId: 'ACC-005',
    accountNumber: 91234567,
    accountType: 'TRUST',
    status: 'ACTIVE',
    firstName: 'Robert',
    lastName: 'Williams',
    username: 'rwilliams',
    email: 'robert.williams@email.com',
    advisorId: 'ADV-102',
    balance: 1250000.00,
    availableBalance: 1250000.00,
    currency: 'USD',
    openedDate: '2018-09-10',
    lastActivityDate: '2024-01-16',
  },
  {
    accountId: 'ACC-006',
    accountNumber: 92345678,
    accountType: 'SEP_IRA',
    status: 'ACTIVE',
    firstName: 'Emily',
    lastName: 'Davis',
    username: 'edavis',
    email: 'emily.davis@email.com',
    advisorId: 'ADV-102',
    balance: 320450.80,
    availableBalance: 320450.80,
    currency: 'USD',
    openedDate: '2022-01-20',
    lastActivityDate: '2024-01-14',
  },
  {
    accountId: 'ACC-007',
    accountNumber: 93456789,
    accountType: 'CUSTODIAL',
    status: 'PENDING',
    firstName: 'James',
    lastName: 'Miller',
    username: 'jmiller',
    email: 'james.miller@email.com',
    advisorId: 'ADV-101',
    balance: 0,
    availableBalance: 0,
    currency: 'USD',
    openedDate: '2024-01-10',
    lastActivityDate: '2024-01-10',
  },
  {
    accountId: 'ACC-008',
    accountNumber: 94567890,
    accountType: '401K',
    status: 'SUSPENDED',
    firstName: 'Amanda',
    lastName: 'Brown',
    username: 'abrown',
    email: 'amanda.brown@email.com',
    advisorId: 'ADV-103',
    balance: 45670.30,
    availableBalance: 0,
    currency: 'USD',
    openedDate: '2020-04-15',
    lastActivityDate: '2023-12-01',
  },
];

export const MOCK_ADVISORS = [
  { advisorId: 'ADV-101', name: 'Jennifer Martinez', region: 'Northeast' },
  { advisorId: 'ADV-102', name: 'David Thompson', region: 'Southeast' },
  { advisorId: 'ADV-103', name: 'Lisa Anderson', region: 'West' },
];

export function getAccountSummaries(): AccountSummary[] {
  return MOCK_ACCOUNTS
    .filter(acc => acc.status === 'ACTIVE')
    .map(acc => ({
      accountId: acc.accountId,
      accountNumber: acc.accountNumber,
      accountType: acc.accountType,
      displayName: `${acc.firstName} ${acc.lastName} - ${acc.accountType}`,
      balance: acc.balance,
      currency: acc.currency,
    }));
}

export function getAccountsByAdvisor(advisorId: string): Account[] {
  return MOCK_ACCOUNTS.filter(acc => acc.advisorId === advisorId);
}

export function getAccountByNumber(accountNumber: number): Account | undefined {
  return MOCK_ACCOUNTS.find(acc => acc.accountNumber === accountNumber);
}

export function getAccountById(accountId: string): Account | undefined {
  return MOCK_ACCOUNTS.find(acc => acc.accountId === accountId);
}
