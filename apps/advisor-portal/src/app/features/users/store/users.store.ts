import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { User } from '../user.model';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { UserService } from '../services/users-api-service';
import { computed, inject } from '@angular/core';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';

type UsersState = {
  users: User[];
  activeUser: User | null;
  isLoading: boolean;
  error: string | null;
};
// Signal store state + selectors for list/loading/error/selected user.

const initialState: UsersState = {
  users: [],
  activeUser: null,
  isLoading: false,
  error: null
};

export const UsersStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => ({
    list: computed(() => store.users()),
    loading: computed(() => store.isLoading()),
    error: computed(() => store.error()),
    selectedUser: computed(() => store.activeUser()),
  })),

  withMethods((store, userService = inject(UserService)) => ({
    loadUsers() {
      patchState(store, { isLoading: true, error: null });
      userService.getUsers().subscribe({
        next: (users) => patchState(store, { users, isLoading: false }),
        error: (err) =>
          patchState(store, {
            error: err?.message ?? 'Failed to load users',
            isLoading: false,
          }),
      });
    },

    selectUser(id: string) {
      const activeUser =
        store.users().find((user) => String(user.id) === String(id)) ?? null;

      patchState(store, {
        activeUser,
        error: activeUser ? null : 'User not found',
      });
    },

    /** Persists name/username/email edits into the in-memory list (and active user). */
    updateUserInList(updates: Pick<User, 'name' | 'username' | 'email'>) {
      const current = store.activeUser();
      if (!current) {
        return;
      }

      const id = String(current.id);
      const nextUsers = store.users().map((user) =>
        String(user.id) === id
          ? { ...user, ...updates }
          : user
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
