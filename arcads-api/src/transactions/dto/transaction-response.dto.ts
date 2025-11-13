import { PropertyType, Transaction } from '@prisma/client';

export class TransactionResponseDto {
  id: string;
  city: string;
  propertyType: PropertyType;
  area: number;
  transactionDate: Date;
  transactionNetValue: number;
  transactionCost: number;
  margin: number; // Calculé : transactionNetValue - transactionCost
  marginPercentage: number; // Calculé : (margin / transactionCost) * 100
  createdAt: Date;
  updatedAt: Date;

  constructor(transaction: Transaction) {
    this.id = transaction.id;
    this.city = transaction.city;
    this.propertyType = transaction.propertyType;
    this.area = transaction.area;
    this.transactionDate = transaction.transactionDate;
    this.transactionNetValue = transaction.transactionNetValue;
    this.transactionCost = transaction.transactionCost;
    this.createdAt = transaction.createdAt;
    this.updatedAt = transaction.updatedAt;

    // Calculs automatiques
    this.margin = this.transactionNetValue - this.transactionCost;
    this.marginPercentage =
      this.transactionCost > 0 ? (this.margin / this.transactionCost) * 100 : 0;
  }
}
