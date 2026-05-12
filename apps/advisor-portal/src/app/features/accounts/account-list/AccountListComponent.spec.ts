import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountListComponent } from './AccountListComponent';
import { Account } from '@org/shared-mock-data';

declare const jest: typeof import('@jest/globals').jest;

describe('AccountListComponent', () => {
  let component: AccountListComponent;
  let fixture: ComponentFixture<AccountListComponent>;

  const mockAccounts: Account[] = [
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
      balance: 245780.5,
      availableBalance: 243500.0,
      currency: 'USD',
      openedDate: '2021-03-15',
      lastActivityDate: '2024-01-18',
    },
    {
      accountId: 'ACC-002',
      accountNumber: 65789012,
      accountType: 'BROKERAGE',
      status: 'ACTIVE',
      firstName: 'Sarah',
      lastName: 'Johnson',
      username: 'sjohnson',
      email: 'sarah.johnson@email.com',
      advisorId: 'ADV-102',
      balance: 125000.0,
      availableBalance: 125000.0,
      currency: 'USD',
      openedDate: '2020-06-01',
      lastActivityDate: '2024-01-15',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('renders accounts correctly', () => {
    it('should display table rows for each account', () => {
      fixture.componentRef.setInput('accounts', mockAccounts);
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);
    });

    it('should display account data in table cells', () => {
      fixture.componentRef.setInput('accounts', mockAccounts);
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const firstRow = fixture.nativeElement.querySelector('tbody tr');
      expect(firstRow?.textContent).toContain('ACC-001');
      expect(firstRow?.textContent).toContain('Michael');
      expect(firstRow?.textContent).toContain('Chen');
      expect(firstRow?.textContent).toContain('BROKERAGE');
    });
  });

  describe('loading state', () => {
    it('should display loading indicator when loading is true', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const loading = fixture.nativeElement.querySelector('.loading');
      expect(loading).toBeTruthy();
      expect(loading?.textContent).toContain('Loading accounts...');
    });

    it('should hide table panel when loading is true', () => {
      fixture.componentRef.setInput('accounts', mockAccounts);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const panel = fixture.nativeElement.querySelector(
        '.table-panel',
      ) as HTMLElement;
      expect(panel?.style.display).toBe('none');
    });

    it('should show table panel when loading is false', () => {
      fixture.componentRef.setInput('accounts', mockAccounts);
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const panel = fixture.nativeElement.querySelector(
        '.table-panel',
      ) as HTMLElement;
      expect(panel?.style.display).not.toBe('none');
    });
  });

  describe('empty state', () => {
    it('should display "No accounts found" when accounts array is empty', () => {
      fixture.componentRef.setInput('accounts', []);
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const emptyMessage = fixture.nativeElement.querySelector('tbody tr td');
      expect(emptyMessage?.textContent).toContain('No accounts found');
    });
  });

  describe('selection event', () => {
    it('should emit accountSelected when row is clicked', () => {
      fixture.componentRef.setInput('accounts', mockAccounts);
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const emitSpy = jest.spyOn(component.accountSelected, 'emit');

      const firstRow = fixture.nativeElement.querySelector('tbody tr');
      firstRow?.click();

      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(mockAccounts[0]);
    });

    it('should emit correct account when second row is clicked', () => {
      fixture.componentRef.setInput('accounts', mockAccounts);
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const emitSpy = jest.spyOn(component.accountSelected, 'emit');

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      rows[1]?.click();

      expect(emitSpy).toHaveBeenCalledWith(mockAccounts[1]);
    });

    it('should highlight selected row', () => {
      fixture.componentRef.setInput('accounts', mockAccounts);
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('selectedAccountId', 'ACC-001');
      fixture.detectChanges();

      const firstRow = fixture.nativeElement.querySelector('tbody tr');
      expect(firstRow?.classList.contains('selected')).toBe(true);
    });
  });
});
