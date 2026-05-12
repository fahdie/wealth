import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
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
  accounts = input<Account[]>([]);
  loading = input(false);
  selectedAccountId = input<string | null>(null);

  accountSelected = output<Account>();

  /** Signal-based view queries (see Angular `viewChild`). */
  loadingPanel = viewChild<ElementRef<HTMLElement>>('loadingPanel');
  tablePanel = viewChild<ElementRef<HTMLElement>>('tablePanel');

  constructor() {
    effect(() => {
      const loading = this.loading();
      const loadingEl = this.loadingPanel()?.nativeElement;
      const tableEl = this.tablePanel()?.nativeElement;
      if (!loadingEl || !tableEl) {
        return;
      }

      if (loading) {
        loadingEl.style.removeProperty('display');
        tableEl.style.display = 'none';
      } else {
        loadingEl.style.display = 'none';
        tableEl.style.removeProperty('display');
      }
    });
  }

  onRowClick(account: Account): void {
    this.accountSelected.emit(account);
  }
}
