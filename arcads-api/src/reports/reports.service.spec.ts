import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma.service';
import { PropertyType } from '@prisma/client';

describe('ReportsService', () => {
  let service: ReportsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    transaction: {
      findMany: jest.fn(),
    },
  };

  const mockTransactions = [
    {
      id: '1',
      city: 'Paris',
      propertyType: PropertyType.APARTMENT,
      area: 75.5,
      transactionDate: new Date('2024-01-15'),
      transactionNetValue: 500000,
      transactionCost: 400000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      city: 'Lyon',
      propertyType: PropertyType.HOUSE,
      area: 120,
      transactionDate: new Date('2024-01-10'),
      transactionNetValue: 600000,
      transactionCost: 450000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      city: 'Paris',
      propertyType: PropertyType.LAND,
      area: 200,
      transactionDate: new Date('2024-01-20'),
      transactionNetValue: 300000,
      transactionCost: 250000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      city: 'Marseille',
      propertyType: PropertyType.APARTMENT,
      area: 60,
      transactionDate: new Date('2024-01-18'),
      transactionNetValue: 400000,
      transactionCost: 350000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      city: 'Lyon',
      propertyType: PropertyType.HOUSE,
      area: 150,
      transactionDate: new Date('2024-01-22'),
      transactionNetValue: 700000,
      transactionCost: 600000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '6',
      city: 'Bordeaux',
      propertyType: PropertyType.APARTMENT,
      area: 80,
      transactionDate: new Date('2024-01-12'),
      transactionNetValue: 450000,
      transactionCost: 380000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHighestMargin', () => {
    it('should return top 5 transactions with highest margin', async () => {
      mockPrismaService.transaction.findMany.mockResolvedValue(
        mockTransactions,
      );

      const result = await service.getHighestMargin();

      expect(result.topTransactions).toHaveLength(5);
      expect(result.count).toBe(5);

      // Check that transactions are sorted by descending margin
      const margins = result.topTransactions.map((t) => t.margin);
      expect(margins[0]).toBeGreaterThanOrEqual(margins[1]);
      expect(margins[1]).toBeGreaterThanOrEqual(margins[2]);

      // Verify that the first transaction has the highest margin
      const firstTransaction = result.topTransactions[0];
      expect(firstTransaction.margin).toBe(150000); // Lyon: 600000 - 450000
      expect(firstTransaction.city).toBe('Lyon');
    });

    it('should calculate margin and marginPercentage correctly', async () => {
      const singleTransaction = [mockTransactions[0]];
      mockPrismaService.transaction.findMany.mockResolvedValue(
        singleTransaction,
      );

      const result = await service.getHighestMargin();

      expect(result.topTransactions).toHaveLength(1);
      const transaction = result.topTransactions[0];
      expect(transaction.margin).toBe(100000); // 500000 - 400000
      expect(transaction.marginPercentage).toBe(25); // (100000 / 400000) * 100
    });

    it('should handle zero cost in margin calculation', async () => {
      const zeroCostTransaction = [
        {
          ...mockTransactions[0],
          transactionCost: 0,
        },
      ];
      mockPrismaService.transaction.findMany.mockResolvedValue(
        zeroCostTransaction,
      );

      const result = await service.getHighestMargin();

      expect(result.topTransactions[0].marginPercentage).toBe(0);
    });

    it('should return empty array when no transactions exist', async () => {
      mockPrismaService.transaction.findMany.mockResolvedValue([]);

      const result = await service.getHighestMargin();

      expect(result.topTransactions).toEqual([]);
      expect(result.count).toBe(0);
    });
  });

  describe('getWeeklyAverageMargin', () => {
    it('should calculate weekly average margin correctly', async () => {
      // Mock for the current week
      const currentWeekTransactions = [
        mockTransactions[0],
        mockTransactions[1],
      ];

      // Mock for the previous week
      const previousWeekTransactions = [mockTransactions[2]];

      mockPrismaService.transaction.findMany
        .mockResolvedValueOnce(currentWeekTransactions)
        .mockResolvedValueOnce(previousWeekTransactions);

      const result = await service.getWeeklyAverageMargin();

      expect(result.currentWeek).toBeDefined();
      expect(result.previousWeek).toBeDefined();
      expect(result.change).toBeDefined();

      expect(result.currentWeek.transactionCount).toBe(2);
      expect(result.previousWeek.transactionCount).toBe(1);

      // Verify that averages are calculated
      expect(result.currentWeek.averageMargin).toBeGreaterThan(0);
      expect(result.previousWeek.averageMargin).toBeGreaterThan(0);

      // Verify the percentage change
      expect(typeof result.change.percentageChange).toBe('number');
      expect(typeof result.change.marginDifference).toBe('number');
    });

    it('should handle zero transactions in current week', async () => {
      mockPrismaService.transaction.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockTransactions[0]]);

      const result = await service.getWeeklyAverageMargin();

      expect(result.currentWeek.averageMargin).toBe(0);
      expect(result.currentWeek.transactionCount).toBe(0);
    });

    it('should handle zero transactions in previous week', async () => {
      mockPrismaService.transaction.findMany
        .mockResolvedValueOnce([mockTransactions[0]])
        .mockResolvedValueOnce([]);

      const result = await service.getWeeklyAverageMargin();

      expect(result.previousWeek.averageMargin).toBe(0);
      expect(result.change.percentageChange).toBe(0);
    });

    it('should include date ranges in response', async () => {
      mockPrismaService.transaction.findMany
        .mockResolvedValueOnce([mockTransactions[0]])
        .mockResolvedValueOnce([mockTransactions[1]]);

      const result = await service.getWeeklyAverageMargin();

      expect(result.currentWeek.startDate).toBeInstanceOf(Date);
      expect(result.currentWeek.endDate).toBeInstanceOf(Date);
      expect(result.previousWeek.startDate).toBeInstanceOf(Date);
      expect(result.previousWeek.endDate).toBeInstanceOf(Date);
    });
  });

  describe('getCityPerformance', () => {
    it('should return top 5 cities by average transaction value', async () => {
      mockPrismaService.transaction.findMany.mockResolvedValue(
        mockTransactions,
      );

      const result = await service.getCityPerformance();

      expect(result.topCities).toHaveLength(4); // Paris, Lyon, Marseille, Bordeaux
      expect(result.count).toBe(4);

      // Verify that cities are sorted by descending average transaction value
      const avgValues = result.topCities.map((c) => c.averageTransactionValue);
      expect(avgValues[0]).toBeGreaterThanOrEqual(avgValues[1]);
    });

    it('should aggregate transactions by city correctly', async () => {
      mockPrismaService.transaction.findMany.mockResolvedValue(
        mockTransactions,
      );

      const result = await service.getCityPerformance();

      // Lyon has 2 transactions: 600000 and 700000
      const lyon = result.topCities.find((c) => c.city === 'Lyon');
      expect(lyon).toBeDefined();
      expect(lyon!.transactionCount).toBe(2);
      expect(lyon!.averageTransactionValue).toBe(650000); // (600000 + 700000) / 2

      // Paris has 2 transactions: 500000 and 300000
      const paris = result.topCities.find((c) => c.city === 'Paris');
      expect(paris).toBeDefined();
      expect(paris!.transactionCount).toBe(2);
      expect(paris!.averageTransactionValue).toBe(400000); // (500000 + 300000) / 2
    });

    it('should calculate average margin and percentage correctly', async () => {
      mockPrismaService.transaction.findMany.mockResolvedValue(
        mockTransactions,
      );

      const result = await service.getCityPerformance();

      result.topCities.forEach((city) => {
        expect(city.averageMargin).toBeGreaterThan(0);
        expect(city.averageMarginPercentage).toBeGreaterThan(0);
        expect(city.totalValue).toBeGreaterThan(0);
      });
    });

    it('should return empty array when no transactions exist', async () => {
      mockPrismaService.transaction.findMany.mockResolvedValue([]);

      const result = await service.getCityPerformance();

      expect(result.topCities).toEqual([]);
      expect(result.count).toBe(0);
    });

    it('should limit results to top 5 cities', async () => {
      // Create 10 different cities
      const manyTransactions = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        city: `City${i + 1}`,
        propertyType: PropertyType.APARTMENT,
        area: 75,
        transactionDate: new Date(),
        transactionNetValue: 500000 + i * 10000,
        transactionCost: 400000,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockPrismaService.transaction.findMany.mockResolvedValue(
        manyTransactions,
      );

      const result = await service.getCityPerformance();

      expect(result.topCities).toHaveLength(5);
      expect(result.count).toBe(5);
    });
  });
});
