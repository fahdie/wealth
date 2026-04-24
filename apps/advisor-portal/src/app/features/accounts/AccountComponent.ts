import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { AccountListComponent } from './account-list/AccountListComponent';
import { AccountDetailComponent } from './account-detail/AccountDetailComponent';
import { AccountsService } from '../../services/accounts.service';
import { Account } from '@org/shared-mock-data';

@Component({
  standalone: true,
  selector: 'app-accounts',
  imports: [AccountListComponent, AccountDetailComponent, ReactiveFormsModule],
  templateUrl: './AccountComponent.html',
  styleUrl: './AccountComponent.css',
})
export class AccountComponent implements OnInit, OnDestroy {
  private accountsService = inject(AccountsService);
  private destroy$ = new Subject<void>();

  accounts = signal<Account[]>([]);
  loading = signal(false);
  selectedAccount = signal<Account | null>(null);
  error = signal<string | null>(null);
  searchControl = new FormControl('');

  ngOnInit() {
    this.loadAccounts();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((query) =>
          this.accountsService.searchAccounts(query ?? '')
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (accounts) => {
          this.accounts.set(accounts);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.message || 'Search failed');
          this.loading.set(false);
        },
      });
  }

  loadAccounts() {
    this.loading.set(true);
    this.error.set(null);

    this.accountsService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts.set(accounts);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load accounts');
        this.loading.set(false);
      },
    });
  }

  onAccountSelected(account: Account) {
    this.selectedAccount.set(account);
  }

  onCloseDetails() {
    this.selectedAccount.set(null);
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  retryLoad() {
    this.error.set(null);
    this.searchControl.setValue('');
    this.loadAccounts();
  }
}
