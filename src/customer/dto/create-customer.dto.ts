import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from 'src/common/enums/roles.enum';
export class CreateCustomerDto {
  @ApiProperty({ description: 'The name of the customer' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The email of the customer', uniqueItems: true })
  @IsNotEmpty({ message: `email cann't be empty` })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({ description: 'The password of the customer' })
  @IsNotEmpty({ message: `password cann't be empty` })
  @IsString()
  password: string;

  @ApiProperty({ description: 'The phone number of the customer', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'The address of the customer', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'The User type enum(customer,admin)' })
  @IsOptional()
  @IsEnum(UserRole)
  type: UserRole
}
