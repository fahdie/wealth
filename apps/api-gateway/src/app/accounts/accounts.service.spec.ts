import { Test } from '@nestjs/testing';
import { CreateAccountApiDto } from './dto/create-account-api.dto';
import { MOCK_ACCOUNTS } from '@org/shared-mock-data';
import { AccountsService } from './accounts.service';
import { InMemoryAccountsRepository } from './accounts.repository';

describe('AccountsService', () => {
  let service: AccountsService;
  let repository: InMemoryAccountsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AccountsService, InMemoryAccountsRepository],
    }).compile();

    service = moduleRef.get(AccountsService);
    repository = moduleRef.get(InMemoryAccountsRepository);
    repository.reset(structuredClone(MOCK_ACCOUNTS));
  });

  describe('findOne', () => {
    it('returns the account when id exists', () => {
      const expected = MOCK_ACCOUNTS[0];
      const found = service.findOne(expected.accountId);
      expect(found?.accountId).toBe(expected.accountId);
      expect(found?.email).toBe(expected.email);
    });

    it('returns undefined when id does not exist', () => {
      expect(service.findOne('ACC-99999')).toBeUndefined();
    });
  });

  describe('create', () => {
    it('persists and returns a new account from dto', () => {
      const dto = Object.assign(new CreateAccountApiDto(), {
        accountNumber: 99988877,
        firstName: 'Test',
        lastName: 'User',
        username: 'tuser',
        email: 'test.user@example.com',
      });

      const before = service.findAll().length;
      const created = service.create(dto);

      expect(service.findAll().length).toBe(before + 1);
      expect(created.accountNumber).toBe(dto.accountNumber);
      expect(created.firstName).toBe('Test');
      expect(created.status).toBe('PENDING');
      expect(created.accountId).toMatch(/^ACC-/);
      expect(service.findOne(created.accountId)).toEqual(created);
    });
  });
});
