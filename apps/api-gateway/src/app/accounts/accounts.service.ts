import { Injectable } from '@nestjs/common';
import { CreateAccountApiDto } from './dto/create-account-api.dto';
import { Account } from '@org/shared-mock-data';
import { InMemoryAccountsRepository } from './accounts.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly repository: InMemoryAccountsRepository) {}

  findAll(): Account[] {
    return this.repository.findAll();
  }

  /**
   * Returns undefined when no account matches (HTTP layer maps to 404).
   */
  findOne(id: string): Account | undefined {
    return this.repository.findById(id);
  }

  create(dto: CreateAccountApiDto): Account {
    const account = this.buildAccountFromDto(dto);
    this.repository.add(account);
    return account;
  }

  private buildAccountFromDto(dto: CreateAccountApiDto): Account {
    const nextIndex = this.repository.findAll().length + 1;
    const today = new Date().toISOString().split('T')[0];

    return {
      accountId: `ACC-${String(nextIndex).padStart(3, '0')}`,
      accountNumber: dto.accountNumber,
      accountType: 'BROKERAGE',
      status: 'PENDING',
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username,
      email: dto.email,
      advisorId: 'ADV-101',
      balance: 0,
      availableBalance: 0,
      currency: 'USD',
      openedDate: today,
      lastActivityDate: today,
    };
  }
}
