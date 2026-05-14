import { IsString, IsEmail, IsInt, IsPositive, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GeoDto {
    @IsString()
    lat!: string;
    lng!: string;

}
class AddressDto {
    @IsString()
    street!: string;
    
    @IsString()
    suite!: string;

    @IsString()
    city!: string;

    @IsString()
    zip!: string;

    @ValidateNested()
    @Type(() => GeoDto) // Crucial for nested validation
    geo!: GeoDto;

    
}

class CompanyDto {
    @IsString()
    name!: string;
    
    @IsString()
    catchPhrase!: string;

    @IsString()
    bs!: string;

}

export class UserDTO {
  @IsInt()
  @IsPositive()
  id!: number;

  @IsString()
  @MaxLength(50)
  name!: string;

  @IsString()
  @MaxLength(50)
  username!: string;

  @ValidateNested()
  @Type(() => AddressDto) // Crucial for nested validation
  address!: AddressDto;
    
  @IsEmail()
  email!: string;
  
  @IsString()
  phone!: string;

  @IsString()
  website!: string;

  @ValidateNested()
  @Type(() => CompanyDto) // Crucial for nested validation
  company!: CompanyDto;

//   constructor(formValue: any) {
//     this.id = formValue.id;
//     this.name = formValue.name;
//     this.username = formValue.username;
//     this.email = formValue.email;
//     this.address = formValue.address;
//     this.phone = formValue.phone;
//     this.website= formValue.website;
//     this.company = formValue.company;
//   }
}
