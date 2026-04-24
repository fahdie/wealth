import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountsService } from '../../../services/accounts.service';
import { CreateAccountDTO } from '@org/shared-dto';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css',
})
export class CreateAccount {
  private accountsService = inject(AccountsService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  isSuccess = signal(false);

  createAccountForm = new FormGroup({
    accountNumber: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^\d+$/)
    ]),
    firstName: new FormControl('', [
      Validators.required,
      Validators.maxLength(50)
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.maxLength(50)
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(30)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  onSubmit() {
    if (this.createAccountForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.isSuccess.set(false);

    const formValue = this.createAccountForm.value;
    const dto: CreateAccountDTO = {
      accountNumber: formValue.accountNumber!,
      firstName: formValue.firstName!,
      lastName: formValue.lastName!,
      username: formValue.username!,
      email: formValue.email!,
    };

    this.accountsService.createAccount(dto).subscribe({
      next: (account) => {
        console.log('Account created:', account);
        this.isSuccess.set(true);
        this.createAccountForm.reset();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'An unexpected error occurred');
        this.isLoading.set(false);
      }
    });
  }

  dismissError() {
    this.errorMessage.set(null);
  }
}
