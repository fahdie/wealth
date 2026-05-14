import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
} from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersStore } from '../store/users.store';
import { combineLatest, distinctUntilChanged, filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-user-details-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './UserDetailsComponent.html',
  styleUrl: './UserDetailsComponent.css',
})
export class UserDetailsComponent {
  readonly store = inject(UsersStore);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  /** Deep signal chain: store → selected user → nested address / company. */
  readonly selectedUser = computed(() => this.store.activeUser());
  readonly addressSignal = computed(() => this.selectedUser()?.address ?? null);
  readonly fullAddressSignal = computed(() => {
    const a = this.addressSignal();
    if (!a) {
      return 'No address on file';
    }
    return [a.street, a.suite, a.city, a.zipcode].filter(Boolean).join(', ');
  });
  readonly companySummarySignal = computed(() => {
    const c = this.selectedUser()?.company;
    if (!c) {
      return 'No company on file';
    }
    return `${c.name} — ${c.catchPhrase}`;
  });

  readonly userForm = this.fb.group({
    id: [{ value: '', disabled: true }],
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    combineLatest([
      this.route.paramMap.pipe(
        map((p) => p.get('id')),
        distinctUntilChanged()
      ),
      toObservable(this.store.users),
    ])
      .pipe(
        takeUntilDestroyed(),
        filter(
          ([id, users]) => id != null && id !== '' && users.length > 0
        ),
        tap(([id]) => this.store.selectUser(id!))
      )
      .subscribe();

    toObservable(this.store.activeUser)
      .pipe(takeUntilDestroyed())
      .subscribe((user) => {
        if (!user) {
          this.userForm.reset(undefined, { emitEvent: false });
          return;
        }

        this.userForm.patchValue(
          {
            id: String(user.id),
            name: user.name,
            username: user.username,
            email: user.email,
          },
          { emitEvent: false }
        );
      });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { name, username, email } = this.userForm.getRawValue();
    if (name == null || username == null || email == null) {
      return;
    }
    this.store.updateUserInList({ name, username, email });
  }
}
