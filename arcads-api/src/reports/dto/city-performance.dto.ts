export class CityPerformanceItemDto {
  city: string;
  averageTransactionValue: number;
  transactionCount: number;
  totalValue: number;
  averageMargin: number;
  averageMarginPercentage: number;
}

export class CityPerformanceReportDto {
  topCities: CityPerformanceItemDto[];
  count: number;
}
