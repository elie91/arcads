import { PropertyType } from '@prisma/client';

export class HighestMarginItemDto {
  id: string;
  city: string;
  propertyType: PropertyType;
  area: number;
  transactionDate: Date;
  transactionNetValue: number;
  transactionCost: number;
  margin: number;
  marginPercentage: number;
}

export class HighestMarginReportDto {
  topTransactions: HighestMarginItemDto[];
  count: number;
}
