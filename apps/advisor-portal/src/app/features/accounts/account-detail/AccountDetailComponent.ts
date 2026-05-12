import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
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
  account = input<Account | null>(null);
  close = output<void>();

  rootPanel = viewChild<ElementRef<HTMLElement>>('rootPanel');

  constructor() {
    effect(() => {
      const acc = this.account();
      this.rootPanel();

      const root = this.rootPanel()?.nativeElement;
      if (!root) {
        return;
      }
      root.style.display = acc ? '' : 'none';
    });
  }

  onClose() {
    this.close.emit();
  }

  getStatusClass(status: AccountStatus | undefined): string {
    switch (status) {
      case 'ACTIVE':
        return 'status-active';
      case 'PENDING':
        return 'status-pending';
      case 'SUSPENDED':
        return 'status-suspended';
      case 'CLOSED':
        return 'status-closed';
      default:
        return '';
    }
  }
}
