import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma.service';
import { CreateTransactionDto, TransactionResponseDto } from './dto';
import { PropertyType } from '@prisma/client';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockTransactionData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    city: 'Paris',
    propertyType: PropertyType.APARTMENT,
    area: 75.5,
    transactionDate: new Date('2024-01-15'),
    transactionNetValue: 500000,
    transactionCost: 400000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateTransactionDto: CreateTransactionDto = {
    city: 'Paris',
    propertyType: PropertyType.APARTMENT,
    area: 75.5,
    transactionDate: '2024-01-15',
    transactionNetValue: 500000,
    transactionCost: 400000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      mockPrismaService.transaction.create.mockResolvedValue(
        mockTransactionData,
      );

      const result = await service.create(mockCreateTransactionDto);

      expect(prismaService.transaction.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateTransactionDto,
          transactionDate: new Date(mockCreateTransactionDto.transactionDate),
        },
      });

      expect(result).toBeInstanceOf(TransactionResponseDto);
      expect(result.id).toBe(mockTransactionData.id);
      expect(result.city).toBe(mockTransactionData.city);
      expect(result.propertyType).toBe(mockTransactionData.propertyType);
      expect(result.margin).toBe(100000); // 500000 - 400000
      expect(result.marginPercentage).toBe(25); // (100000 / 400000) * 100
    });

    it('should handle transaction creation with zero cost', async () => {
      const zeroTransactionData = {
        ...mockTransactionData,
        transactionCost: 0,
      };

      mockPrismaService.transaction.create.mockResolvedValue(
        zeroTransactionData,
      );

      const dto = { ...mockCreateTransactionDto, transactionCost: 0 };
      const result = await service.create(dto);

      expect(result.margin).toBe(500000);
      expect(result.marginPercentage).toBe(0); // Division by zero protection
    });
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const mockTransactions = [mockTransactionData, mockTransactionData];
      mockPrismaService.transaction.findMany.mockResolvedValue(
        mockTransactions,
      );

      const result = await service.findAll();

      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        orderBy: {
          transactionDate: 'desc',
        },
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(TransactionResponseDto);
      expect(result[0].margin).toBe(100000);
    });

    it('should return an empty array when no transactions exist', async () => {
      mockPrismaService.transaction.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      mockPrismaService.transaction.findUnique.mockResolvedValue(
        mockTransactionData,
      );

      const result = await service.findOne(mockTransactionData.id);

      expect(prismaService.transaction.findUnique).toHaveBeenCalledWith({
        where: { id: mockTransactionData.id },
      });

      expect(result).toBeInstanceOf(TransactionResponseDto);
      expect(result.id).toBe(mockTransactionData.id);
      expect(result.margin).toBe(100000);
    });

    it('should throw NotFoundException when transaction does not exist', async () => {
      const nonExistentId = 'non-existent-id';
      mockPrismaService.transaction.findUnique.mockResolvedValue(null);

      await expect(service.findOne(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(nonExistentId)).rejects.toThrow(
        `Transaction with id ${nonExistentId} not found`,
      );

      expect(prismaService.transaction.findUnique).toHaveBeenCalledWith({
        where: { id: nonExistentId },
      });
    });
  });
});
