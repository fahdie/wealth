import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { User } from '../user.model';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { UserService } from '../services/users-api-service';
import { inject } from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';

type UsersState = {
  users: User[];
  activeUser: User | null;
  isLoading: boolean;
  error: string | null;
  /** After first successful fetch; avoids refetch on every navigation (which would wipe local edits). */
  usersLoaded: boolean;
};

const initialState: UsersState = {
  users: [],
  activeUser: null,
  isLoading: false,
  error: null,
  usersLoaded: false,
};

export const UsersStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods((store, userService = inject(UserService)) => ({
    /** Loads users; `switchMap` cancels an in-flight request when triggered again. */
    loadUsers: rxMethod<void>((trigger$) =>
      trigger$.pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          userService.getUsers().pipe(
            tap({
              next: (users) =>
                patchState(store, {
                  users,
                  isLoading: false,
                  error: null,
                  usersLoaded: true,
                }),
            }),
            catchError((err: unknown) => {
              patchState(store, {
                error:
                  err instanceof Error ? err.message : 'Failed to load users',
                isLoading: false,
              });
              return of(null);
            })
          )
        )
      )
    ),

    selectUser(id: string) {
      const activeUser =
        store.users().find((user) => String(user.id) === String(id)) ?? null;

      patchState(store, {
        activeUser,
        error: activeUser ? null : 'User not found',
      });
    },

    clearActiveUser() {
      patchState(store, { activeUser: null, error: null });
    },

    /** Persists name/username/email edits into the in-memory list (and active user). */
    updateUserInList(updates: Pick<User, 'name' | 'username' | 'email'>) {
      const current = store.activeUser();
      if (!current) {
        return;
      }

      const id = String(current.id);
      const nextUsers = store.users().map((user) =>
        String(user.id) === id ? { ...user, ...updates } : user
      );
      const nextActive =
        nextUsers.find((user) => String(user.id) === id) ?? null;

      patchState(store, {
        users: nextUsers,
        activeUser: nextActive,
        error: null,
      });
    },
  }))
);
