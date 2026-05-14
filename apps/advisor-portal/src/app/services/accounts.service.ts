import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Account, MOCK_ACCOUNTS } from '@org/shared-mock-data';
import { CreateAccountDTO } from '@org/shared-dto';

/**
 * Client-side accounts API backed by in-memory mock data until the gateway
 * exposes `/api/accounts` in {@link AppModule}.
 */
@Injectable({ providedIn: 'root' })
export class AccountsService {
  private accounts: Account[] = structuredClone(MOCK_ACCOUNTS);

  getAccounts(): Observable<Account[]> {
    return of([...this.accounts]).pipe(delay(50));
  }

  searchAccounts(query: string): Observable<Account[]> {
    const q = query.trim().toLowerCase();
    if (!q) {
      return of([...this.accounts]).pipe(delay(50));
    }
    return of(
      this.accounts.filter(
        (a) =>
          a.firstName.toLowerCase().includes(q) ||
          a.lastName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.username.toLowerCase().includes(q) ||
          String(a.accountNumber).includes(q) ||
          a.accountId.toLowerCase().includes(q)
      )
    ).pipe(delay(50));
  }

  createAccount(dto: CreateAccountDTO): Observable<Account> {
    const nextIndex = this.accounts.length + 1;
    const today = new Date().toISOString().split('T')[0];
    const account: Account = {
      accountId: `ACC-${String(nextIndex).padStart(3, '0')}`,
      accountNumber: dto.accountNumber,
      accountType: 'BROKERAGE',
      status: 'PENDING',
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username,
      email: dto.email,
      advisorId: 'ADV-101',
      balance: 0,
      availableBalance: 0,
      currency: 'USD',
      openedDate: today,
      lastActivityDate: today,
    };
    this.accounts = [...this.accounts, account];
    return of(account).pipe(delay(50));
  }
}
