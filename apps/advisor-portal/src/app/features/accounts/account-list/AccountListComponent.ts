import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Account } from '@org/shared-mock-data';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './AccountListComponent.html',
  styleUrl: './AccountListComponent.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountListComponent {
  @Input() accounts: Account[] = [];
  @Input() loading = false;
  @Input() selectedAccountId: string | null = null;

  @Output() accountSelected = new EventEmitter<Account>();

  onRowClick(account: Account): void {
    this.accountSelected.emit(account);
  }
}
 