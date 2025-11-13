export enum PropertyType {
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
  LAND = "LAND",
}

export interface Transaction {
  id: string;
  city: string;
  propertyType: PropertyType;
  area: number;
  transactionDate: string;
  transactionNetValue: number;
  transactionCost: number;
  margin: number;
  marginPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  city: string;
  propertyType: PropertyType;
  area: number;
  transactionDate: string;
  transactionNetValue: number;
  transactionCost: number;
}

// Reports types
export interface HighestMarginItem {
  id: string;
  city: string;
  propertyType: PropertyType;
  area: number;
  transactionDate: string;
  transactionNetValue: number;
  transactionCost: number;
  margin: number;
  marginPercentage: number;
}

export interface HighestMarginReport {
  topTransactions: HighestMarginItem[];
  count: number;
}

export interface WeeklyData {
  averageMargin: number;
  averageMarginPercentage: number;
  transactionCount: number;
  startDate: string;
  endDate: string;
}

export interface WeeklyAverageMarginReport {
  currentWeek: WeeklyData;
  previousWeek: WeeklyData;
  change: {
    marginDifference: number;
    percentageChange: number;
  };
}

export interface CityPerformanceItem {
  city: string;
  averageTransactionValue: number;
  transactionCount: number;
  totalValue: number;
  averageMargin: number;
  averageMarginPercentage: number;
}

export interface CityPerformanceReport {
  topCities: CityPerformanceItem[];
  count: number;
}
