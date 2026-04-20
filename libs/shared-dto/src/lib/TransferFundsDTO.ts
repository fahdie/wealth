import { IsInt, IsPositive, IsNumber, IsISO4217CurrencyCode, Min } from 'class-validator';

export class TransferFundsDTO {
  @IsInt()
  @IsPositive()
  fromAccountNumber: number;

  @IsInt()
  @IsPositive()
  toAccountNumber: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @IsISO4217CurrencyCode()
  currency: string;
}