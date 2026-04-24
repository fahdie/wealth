import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, debounceTime } from 'rxjs';
import { AccountsService } from '../../services/accounts.service';
import * as AccountsActions from './accounts.actions';

export const loadAccountsEffect = createEffect(
  (actions$ = inject(Actions), accountsService = inject(AccountsService)) =>
    actions$.pipe(
      ofType(AccountsActions.loadAccounts),
      switchMap(() =>
        accountsService.getAccounts().pipe(
          map((accounts) => AccountsActions.loadAccountsSuccess({ accounts })),
          catchError((error) =>
            of(
              AccountsActions.loadAccountsFailure({
                error: error.message || 'Failed to load accounts',
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

export const searchAccountsEffect = createEffect(
  (actions$ = inject(Actions), accountsService = inject(AccountsService)) =>
    actions$.pipe(
      ofType(AccountsActions.searchAccounts),
      debounceTime(300),
      switchMap(({ query }) =>
        accountsService.searchAccounts(query).pipe(
          map((accounts) => AccountsActions.searchAccountsSuccess({ accounts })),
          catchError((error) =>
            of(
              AccountsActions.searchAccountsFailure({
                error: error.message || 'Search failed',
              })
            )
          )
        )
      )
    ),
  { functional: true }
);
