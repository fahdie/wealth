import { IsString, IsEmail, IsInt, IsPositive, MaxLength } from 'class-validator';

export class CreateAccountDTO {
  @IsInt()
  @IsPositive()
  accountNumber: number;

  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsString()
  @MaxLength(30)
  username: string;

  @IsEmail()
  email: string;

  constructor(formValue: any) {
    this.accountNumber = formValue.accountNumber;
    this.firstName = formValue.firstName;
    this.lastName = formValue.lastName;
    this.username = formValue.username;
    this.email = formValue.email;
  }
}
