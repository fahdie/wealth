import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { AccountDetailComponent } from './AccountDetailComponent';

describe('AccountDetailComponent', () => {
  let component: AccountDetailComponent;
  let fixture: ComponentFixture<AccountDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display detail rows when account is set', () => {
    component.account = {
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
    };

    fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.detail-row');
    expect(rows.length).toBe(10);
  });

  it('should not display content when account is null', () => {
    component.account = null;
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.account-detail-card');
    expect(card).toBeNull();
  });
});
