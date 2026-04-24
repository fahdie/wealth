import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CreateAccountDTO } from '@org/shared-dto';
import { 
  MOCK_ACCOUNTS, 
  Account, 
  shouldSimulateFailure 
} from '@org/shared-mock-data';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private http = inject(HttpClient);
  private accounts = [...MOCK_ACCOUNTS];

  getAccounts(): Observable<Account[]> {
    return of(this.accounts).pipe(
      delay(500)
    );
  }

  getAccountById(accountId: string): Observable<Account> {
    const account = this.accounts.find(acc => acc.accountId === accountId);
    
    if (!account) {
      return throwError(() => new Error(`Account ${accountId} not found`));
    }
    
    return of(account).pipe(delay(300));
  }

  createAccount(dto: CreateAccountDTO): Observable<Account> {
    if (shouldSimulateFailure(0.15)) {
      return throwError(() => new Error('Failed to create account. Please try again.')).pipe(
        delay(500)
      );
    }

    const newAccount: Account = {
      accountId: `ACC-${String(this.accounts.length + 1).padStart(3, '0')}`,
      accountNumber: Math.floor(Math.random() * 90000000) + 10000000,
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
      openedDate: new Date().toISOString().split('T')[0],
      lastActivityDate: new Date().toISOString().split('T')[0],
    };

    // this.accounts.push(newAccount);

    this.accounts = [...this.accounts, newAccount];
    
    return of(newAccount).pipe(delay(800));
  }

  searchAccounts(query: string): Observable<Account[]> {
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) {
      return of(this.accounts).pipe(delay(300));
    }

    const filtered = this.accounts.filter(acc =>
      acc.firstName.toLowerCase().includes(lowerQuery) ||
      acc.lastName.toLowerCase().includes(lowerQuery) ||
      acc.email.toLowerCase().includes(lowerQuery) ||
      acc.accountId.toLowerCase().includes(lowerQuery)
    );

    return of(filtered).pipe(delay(400));
  }
}
