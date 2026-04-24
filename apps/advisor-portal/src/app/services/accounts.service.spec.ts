import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AccountsService } from './accounts.service';
import { firstValueFrom } from 'rxjs';

describe('AccountsService', () => {
  let service: AccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountsService],
    });
    service = TestBed.inject(AccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAccounts', () => {
    it('should return accounts array', fakeAsync(() => {
      let result: any[] = [];

      service.getAccounts().subscribe((accounts) => {
        result = accounts;
      });

      tick(500); // Wait for delay

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('accountId');
      expect(result[0]).toHaveProperty('firstName');
      expect(result[0]).toHaveProperty('balance');
    }));

    it('should return all mock accounts', fakeAsync(() => {
      let result: any[] = [];

      service.getAccounts().subscribe((accounts) => {
        result = accounts;
      });

      tick(500);

      expect(result.length).toBeGreaterThanOrEqual(1);
    }));
  });

  describe('searchAccounts', () => {
    it('should filter accounts by name query "chen"', fakeAsync(() => {
      let result: any[] = [];

      service.searchAccounts('chen').subscribe((accounts) => {
        result = accounts;
      });

      tick(400);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((account) => {
        const matchesQuery =
          account.firstName.toLowerCase().includes('chen') ||
          account.lastName.toLowerCase().includes('chen') ||
          account.email.toLowerCase().includes('chen') ||
          account.accountId.toLowerCase().includes('chen');
        expect(matchesQuery).toBe(true);
      });
    }));

    it('should return all accounts when query is empty', fakeAsync(() => {
      let allAccounts: any[] = [];
      let searchResult: any[] = [];

      service.getAccounts().subscribe((accounts) => {
        allAccounts = accounts;
      });
      tick(500);

      service.searchAccounts('').subscribe((accounts) => {
        searchResult = accounts;
      });
      tick(300);

      expect(searchResult.length).toBe(allAccounts.length);
    }));

    it('should return all accounts when query is whitespace only', fakeAsync(() => {
      let allAccounts: any[] = [];
      let searchResult: any[] = [];

      service.getAccounts().subscribe((accounts) => {
        allAccounts = accounts;
      });
      tick(500);

      service.searchAccounts('   ').subscribe((accounts) => {
        searchResult = accounts;
      });
      tick(300);

      expect(searchResult.length).toBe(allAccounts.length);
    }));

    it('should be case insensitive', fakeAsync(() => {
      let lowerResult: any[] = [];
      let upperResult: any[] = [];

      service.searchAccounts('chen').subscribe((accounts) => {
        lowerResult = accounts;
      });
      tick(400);

      service.searchAccounts('CHEN').subscribe((accounts) => {
        upperResult = accounts;
      });
      tick(400);

      expect(lowerResult.length).toBe(upperResult.length);
    }));

    it('should return empty array when no matches found', fakeAsync(() => {
      let result: any[] = [];

      service.searchAccounts('xyznonexistent123').subscribe((accounts) => {
        result = accounts;
      });

      tick(400);

      expect(result.length).toBe(0);
    }));
  });

  describe('getAccountById', () => {
    it('should return correct account for valid ID', fakeAsync(() => {
      let allAccounts: any[] = [];
      let result: any = null;

      service.getAccounts().subscribe((accounts) => {
        allAccounts = accounts;
      });
      tick(500);

      const validId = allAccounts[0].accountId;

      service.getAccountById(validId).subscribe((account) => {
        result = account;
      });
      tick(300);

      expect(result).toBeTruthy();
      expect(result.accountId).toBe(validId);
    }));

    it('should throw error for invalid ID', fakeAsync(() => {
      let error: Error | undefined;

      service.getAccountById('INVALID-ID-999').subscribe({
        next: () => {},
        error: (err: Error) => {
          error = err;
        },
      });

      tick(300);

      expect(error).toBeDefined();
      expect(error!.message).toContain('not found');
    }));

    it('should return account with all expected properties', fakeAsync(() => {
      let allAccounts: any[] = [];
      let result: any = null;

      service.getAccounts().subscribe((accounts) => {
        allAccounts = accounts;
      });
      tick(500);

      service.getAccountById(allAccounts[0].accountId).subscribe((account) => {
        result = account;
      });
      tick(300);

      expect(result).toHaveProperty('accountId');
      expect(result).toHaveProperty('accountNumber');
      expect(result).toHaveProperty('accountType');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('firstName');
      expect(result).toHaveProperty('lastName');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('balance');
    }));
  });
});
