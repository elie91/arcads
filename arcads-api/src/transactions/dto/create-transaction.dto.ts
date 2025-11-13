import {
  IsString,
  IsEnum,
  IsNumber,
  IsDateString,
  IsPositive,
} from 'class-validator';
import { PropertyType } from '@prisma/client';

export class CreateTransactionDto {
  @IsString()
  city: string;

  @IsEnum(PropertyType, {
    message: 'propertyType must be one of: APARTMENT, HOUSE, LAND',
  })
  propertyType: PropertyType;

  @IsNumber()
  @IsPositive({ message: 'area must be a positive number' })
  area: number;

  @IsDateString(
    {},
    { message: 'transactionDate must be a valid ISO 8601 date' },
  )
  transactionDate: string;

  @IsNumber()
  @IsPositive({ message: 'transactionNetValue must be a positive number' })
  transactionNetValue: number;

  @IsNumber()
  @IsPositive({ message: 'transactionCost must be a positive number' })
  transactionCost: number;
}
