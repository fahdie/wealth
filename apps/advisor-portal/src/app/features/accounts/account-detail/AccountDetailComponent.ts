import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Account, AccountStatus } from '@org/shared-mock-data';


@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './AccountDetailComponent.html',
  styleUrl: './AccountDetailComponent.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailComponent {
  @Input() account: Account | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  getStatusClass(status: AccountStatus | undefined): string {
    switch (status) {
      case 'ACTIVE': return 'status-active';
      case 'PENDING': return 'status-pending';
      case 'SUSPENDED': return 'status-suspended';
      case 'CLOSED': return 'status-closed';
      default: return '';
    }
  }
}
