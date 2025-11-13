export class WeeklyAverageMarginDto {
  currentWeek: {
    averageMargin: number;
    averageMarginPercentage: number;
    transactionCount: number;
    startDate: Date;
    endDate: Date;
  };
  previousWeek: {
    averageMargin: number;
    averageMarginPercentage: number;
    transactionCount: number;
    startDate: Date;
    endDate: Date;
  };
  change: {
    marginDifference: number; // currentWeek - previousWeek
    percentageChange: number; // ((current - previous) / previous) * 100
  };
}
