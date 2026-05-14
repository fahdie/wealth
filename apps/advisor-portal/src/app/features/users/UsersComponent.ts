import { Component, OnInit, computed, inject } from '@angular/core';
import {
  takeUntilDestroyed,
  toSignal,
} from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, startWith } from 'rxjs';
import { UsersStore } from './store/users.store';

@Component({
  selector: 'app-users-component',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './UsersComponent.html',
  styleUrl: './UsersComponent.css',
})
export class UsersComponent implements OnInit {
  readonly usersStore = inject(UsersStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  filterControl = new FormControl('', { nonNullable: true });
  /** Syncs initial value + every keystroke (valueChanges alone skips the first value until emit). */
  private filterText = toSignal(
    this.filterControl.valueChanges.pipe(
      startWith(this.filterControl.getRawValue())
    ),
    { initialValue: '' }
  );

  filteredUsers = computed(() => {
    const filter = (this.filterText() ?? '').trim().toLowerCase();
    const users = this.usersStore.users();

    if (!filter) {
      return users;
    }

    return users.filter((user) => {
      const name = (user.name ?? '').toLowerCase();
      const email = (user.email ?? '').toLowerCase();
      const username = (user.username ?? '').toLowerCase();
      const id = String(user.id);
      return (
        name.includes(filter) ||
        email.includes(filter) ||
        username.includes(filter) ||
        id.includes(filter)
      );
    });
  });

  constructor() {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter((e): e is NavigationEnd => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        const id = this.route.firstChild?.snapshot.paramMap.get('id');
        if (id == null) {
          this.usersStore.clearActiveUser();
        }
      });
  }

  ngOnInit(): void {
    const id = this.route.firstChild?.snapshot.paramMap.get('id');
    if (id == null) {
      this.usersStore.clearActiveUser();
    }
    if (!this.usersStore.usersLoaded()) {
      this.usersStore.loadUsers();
    }
  }
}
