/**
 * Accounts REST feature module — currently **not** imported by {@link AppModule}
 * so the default api-gateway stays the original minimal bootstrap.
 * Wire it by adding `AccountsModule` to `AppModule.imports` and registering
 * `ValidationPipe` in `main.ts` (see ACCOUNTS-NEST-ARCHITECTURE.md).
 */
import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { InMemoryAccountsRepository } from './accounts.repository';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, InMemoryAccountsRepository],
  exports: [AccountsService],
})
export class AccountsModule {}
