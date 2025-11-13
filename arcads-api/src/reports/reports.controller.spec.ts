import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import {
  HighestMarginReportDto,
  WeeklyAverageMarginDto,
  CityPerformanceReportDto,
} from './dto';
import { PropertyType } from '@prisma/client';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockHighestMarginReport: HighestMarginReportDto = {
    topTransactions: [
      {
        id: '1',
        city: 'Paris',
        propertyType: PropertyType.APARTMENT,
        area: 75.5,
        transactionDate: new Date('2024-01-15'),
        transactionNetValue: 500000,
        transactionCost: 400000,
        margin: 100000,
        marginPercentage: 25,
      },
    ],
    count: 1,
  };

  const mockWeeklyAverageMargin: WeeklyAverageMarginDto = {
    currentWeek: {
      averageMargin: 120000,
      averageMarginPercentage: 30,
      transactionCount: 5,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-21'),
    },
    previousWeek: {
      averageMargin: 100000,
      averageMarginPercentage: 25,
      transactionCount: 4,
      startDate: new Date('2024-01-08'),
      endDate: new Date('2024-01-14'),
    },
    change: {
      marginDifference: 20000,
      percentageChange: 20,
    },
  };

  const mockCityPerformance: CityPerformanceReportDto = {
    topCities: [
      {
        city: 'Paris',
        averageTransactionValue: 450000,
        transactionCount: 10,
        totalValue: 4500000,
        averageMargin: 90000,
        averageMarginPercentage: 25,
      },
      {
        city: 'Lyon',
        averageTransactionValue: 400000,
        transactionCount: 8,
        totalValue: 3200000,
        averageMargin: 80000,
        averageMarginPercentage: 23,
      },
    ],
    count: 2,
  };

  const mockReportsService = {
    getHighestMargin: jest.fn(),
    getWeeklyAverageMargin: jest.fn(),
    getCityPerformance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHighestMargin', () => {
    it('should return top 5 transactions with highest margin', async () => {
      mockReportsService.getHighestMargin.mockResolvedValue(
        mockHighestMarginReport,
      );

      const result = await controller.getHighestMargin();

      expect(service.getHighestMargin).toHaveBeenCalled();
      expect(result).toEqual(mockHighestMarginReport);
      expect(result.topTransactions).toHaveLength(1);
      expect(result.count).toBe(1);
    });

    it('should return correct structure for HighestMarginReportDto', async () => {
      mockReportsService.getHighestMargin.mockResolvedValue(
        mockHighestMarginReport,
      );

      const result = await controller.getHighestMargin();

      expect(result).toHaveProperty('topTransactions');
      expect(result).toHaveProperty('count');
      expect(result.topTransactions[0]).toHaveProperty('id');
      expect(result.topTransactions[0]).toHaveProperty('city');
      expect(result.topTransactions[0]).toHaveProperty('margin');
      expect(result.topTransactions[0]).toHaveProperty('marginPercentage');
    });

    it('should handle empty results', async () => {
      mockReportsService.getHighestMargin.mockResolvedValue({
        topTransactions: [],
        count: 0,
      });

      const result = await controller.getHighestMargin();

      expect(result.topTransactions).toEqual([]);
      expect(result.count).toBe(0);
    });
  });

  describe('getWeeklyAverageMargin', () => {
    it('should return weekly average margin comparison', async () => {
      mockReportsService.getWeeklyAverageMargin.mockResolvedValue(
        mockWeeklyAverageMargin,
      );

      const result = await controller.getWeeklyAverageMargin();

      expect(service.getWeeklyAverageMargin).toHaveBeenCalled();
      expect(result).toEqual(mockWeeklyAverageMargin);
      expect(result.currentWeek).toBeDefined();
      expect(result.previousWeek).toBeDefined();
      expect(result.change).toBeDefined();
    });

    it('should return correct structure for WeeklyAverageMarginDto', async () => {
      mockReportsService.getWeeklyAverageMargin.mockResolvedValue(
        mockWeeklyAverageMargin,
      );

      const result = await controller.getWeeklyAverageMargin();

      expect(result.currentWeek).toHaveProperty('averageMargin');
      expect(result.currentWeek).toHaveProperty('averageMarginPercentage');
      expect(result.currentWeek).toHaveProperty('transactionCount');
      expect(result.currentWeek).toHaveProperty('startDate');
      expect(result.currentWeek).toHaveProperty('endDate');

      expect(result.previousWeek).toHaveProperty('averageMargin');
      expect(result.previousWeek).toHaveProperty('averageMarginPercentage');
      expect(result.previousWeek).toHaveProperty('transactionCount');

      expect(result.change).toHaveProperty('marginDifference');
      expect(result.change).toHaveProperty('percentageChange');
    });

    it('should handle positive change in margin', async () => {
      mockReportsService.getWeeklyAverageMargin.mockResolvedValue(
        mockWeeklyAverageMargin,
      );

      const result = await controller.getWeeklyAverageMargin();

      expect(result.change.marginDifference).toBeGreaterThan(0);
      expect(result.change.percentageChange).toBeGreaterThan(0);
    });

    it('should handle negative change in margin', async () => {
      const negativeChangeReport = {
        ...mockWeeklyAverageMargin,
        change: {
          marginDifference: -20000,
          percentageChange: -20,
        },
      };

      mockReportsService.getWeeklyAverageMargin.mockResolvedValue(
        negativeChangeReport,
      );

      const result = await controller.getWeeklyAverageMargin();

      expect(result.change.marginDifference).toBeLessThan(0);
      expect(result.change.percentageChange).toBeLessThan(0);
    });
  });

  describe('getCityPerformance', () => {
    it('should return top 5 cities by performance', async () => {
      mockReportsService.getCityPerformance.mockResolvedValue(
        mockCityPerformance,
      );

      const result = await controller.getCityPerformance();

      expect(service.getCityPerformance).toHaveBeenCalled();
      expect(result).toEqual(mockCityPerformance);
      expect(result.topCities).toHaveLength(2);
      expect(result.count).toBe(2);
    });

    it('should return correct structure for CityPerformanceReportDto', async () => {
      mockReportsService.getCityPerformance.mockResolvedValue(
        mockCityPerformance,
      );

      const result = await controller.getCityPerformance();

      expect(result).toHaveProperty('topCities');
      expect(result).toHaveProperty('count');

      const firstCity = result.topCities[0];
      expect(firstCity).toHaveProperty('city');
      expect(firstCity).toHaveProperty('averageTransactionValue');
      expect(firstCity).toHaveProperty('transactionCount');
      expect(firstCity).toHaveProperty('totalValue');
      expect(firstCity).toHaveProperty('averageMargin');
      expect(firstCity).toHaveProperty('averageMarginPercentage');
    });

    it('should return cities sorted by average transaction value', async () => {
      mockReportsService.getCityPerformance.mockResolvedValue(
        mockCityPerformance,
      );

      const result = await controller.getCityPerformance();

      const avgValues = result.topCities.map((c) => c.averageTransactionValue);
      expect(avgValues[0]).toBeGreaterThanOrEqual(avgValues[1]);
    });

    it('should handle empty results', async () => {
      mockReportsService.getCityPerformance.mockResolvedValue({
        topCities: [],
        count: 0,
      });

      const result = await controller.getCityPerformance();

      expect(result.topCities).toEqual([]);
      expect(result.count).toBe(0);
    });
  });
});
