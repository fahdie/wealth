import { Injectable } from '@nestjs/common';
import { Account, MOCK_ACCOUNTS } from '@org/shared-mock-data';

/**
 * In-memory persistence for local / interview use. Swap for a real
 * TypeORM/Prisma/repository implementation without changing the service contract.
 */
@Injectable()
export class InMemoryAccountsRepository {
  private accounts: Account[] = structuredClone(MOCK_ACCOUNTS);

  findAll(): Account[] {
    return [...this.accounts];
  }

  findById(id: string): Account | undefined {
    return this.accounts.find((a) => a.accountId === id);
  }

  add(account: Account): void {
    this.accounts = [...this.accounts, account];
  }

  /** Test-only reset to isolate specs. */
  reset(seed: Account[] = structuredClone(MOCK_ACCOUNTS)): void {
    this.accounts = structuredClone(seed);
  }
}
