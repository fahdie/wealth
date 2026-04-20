import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import * as AccountsActions from './accounts.actions';

export const loadAccountsEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AccountsActions.loadAccounts),
      switchMap(() =>
        of([]).pipe(
          map((accounts) => AccountsActions.loadAccountsSuccess({ accounts })),
          catchError(() =>
            of(
              AccountsActions.loadAccountsFailure({
                error: 'Failed to load accounts',
              })
            )
          )
        )
      )
    ),
  { functional: true }
);
