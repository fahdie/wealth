import { Component, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UsersStore } from '../store/users.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './UserDetailsComponent.html',
  styleUrl: './UserDetailsComponent.css',
})
export class UserDetailsComponent {
  readonly store = inject(UsersStore);
  private fb = inject(FormBuilder);

  readonly userForm = this.fb.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    // Avoid `effect` + `patchValue`: updating reactive forms from an effect can
    // conflict with Angular's signal write rules and leave the UI out of sync.
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
