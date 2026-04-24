import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsPositive, IsString, MaxLength } from 'class-validator';

/**
 * NestJS POST body DTO (with transform hooks for JSON).
 * Kept separate from {@link CreateAccountDTO} in @org/shared-dto so the
 * advisor-portal shape stays unchanged while this module can be wired later.
 */
export class CreateAccountApiDto {
  @Type(() => Number)
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
}
