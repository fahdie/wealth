import { Component, OnInit, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { startWith } from 'rxjs';
import { UsersStore } from './store/users.store';
import { UserDetailsComponent } from './user-details/UserDetailsComponent';
import { User } from './user.model';

@Component({
  selector: 'app-users-component',
  standalone: true,
  imports: [ReactiveFormsModule, UserDetailsComponent],
  templateUrl: './UsersComponent.html',
  styleUrl: './UsersComponent.css',
})
export class UsersComponent implements OnInit {
  usersStore = inject(UsersStore);
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

  ngOnInit(): void {
    this.usersStore.loadUsers();
  }

  onSelectUser(user: User): void {
    this.usersStore.selectUser(String(user.id));
  }

  isSelected(user: User): boolean {
    const active = this.usersStore.activeUser();
    return !!active && String(active.id) === String(user.id);
  }
}
